import bcrypt from "bcryptjs";

import {
    lerDados,
    respostaJson,
    criarSessao
} from "./lib/auth.js";

export async function onRequestPost(context) {
    try {
        const {
            env,
            request
        } = context;

        const dados =
            await lerDados(request);

        const email =
            String(dados.email || "")
                .trim()
                .toLowerCase();

        const senha =
            String(dados.senha || "");

        if (!email || !senha) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "Digite seu e-mail e sua senha."
                },
                400
            );
        }

        const usuario =
            await env.DB.prepare(`
                SELECT
                    id,
                    nome,
                    email,
                    senha
                FROM usuarios
                WHERE email = ?
            `)
                .bind(email)
                .first();

        if (!usuario) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "E-mail ou senha incorretos."
                },
                401
            );
        }

        const senhaCorreta =
            await bcrypt.compare(
                senha,
                usuario.senha
            );

        if (!senhaCorreta) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "E-mail ou senha incorretos."
                },
                401
            );
        }

        const token =
            await criarSessao(
                env,
                usuario.id
            );

        return respostaJson({
            sucesso: true,
            nome: usuario.nome,
            token
        });
    }
    catch (erro) {
        console.error(
            "Erro no login:",
            erro
        );

        return respostaJson(
            {
                sucesso: false,
                mensagem:
                    "Erro ao realizar login."
            },
            500
        );
    }
}