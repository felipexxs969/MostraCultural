import bcrypt from "bcryptjs";

import {
    lerDados,
    respostaJson
} from "./lib/auth.js";

export async function onRequestPost(context) {
    try {
        const {
            env,
            request
        } = context;

        const dados =
            await lerDados(request);

        const nome =
            String(dados.nome || "").trim();

        const email =
            String(dados.email || "")
                .trim()
                .toLowerCase();

        const senha =
            String(dados.senha || "");

        if (!nome || !email || !senha) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "Preencha todos os campos."
                },
                400
            );
        }

        if (nome.length < 2) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "Digite um nome válido."
                },
                400
            );
        }

        if (senha.length < 6) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "A senha precisa ter pelo menos 6 caracteres."
                },
                400
            );
        }

        const usuarioExistente =
            await env.DB.prepare(`
                SELECT id
                FROM usuarios
                WHERE email = ?
            `)
                .bind(email)
                .first();

        if (usuarioExistente) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "Este e-mail já está cadastrado."
                },
                400
            );
        }

        const senhaHash =
            await bcrypt.hash(
                senha,
                10
            );

        await env.DB.prepare(`
            INSERT INTO usuarios (
                nome,
                email,
                senha
            )
            VALUES (?, ?, ?)
        `)
            .bind(
                nome,
                email,
                senhaHash
            )
            .run();

        return respostaJson({
            sucesso: true,
            mensagem:
                "Cadastro realizado com sucesso!"
        });
    }
    catch (erro) {
        console.error(
            "Erro no cadastro:",
            erro
        );

        return respostaJson(
            {
                sucesso: false,
                mensagem:
                    "Erro ao cadastrar usuário."
            },
            500
        );
    }
}