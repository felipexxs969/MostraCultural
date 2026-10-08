import {
    obterSessao,
    respostaJson
} from "../../lib/auth.js";

export async function onRequestGet(context) {
    try {
        const sessao = await obterSessao(
            context.request,
            context.env
        );

        if (!sessao) {
            return respostaJson(
                {
                    sucesso: false,
                    mensagem:
                        "Sua sessão terminou. Faça login novamente."
                },
                401
            );
        }

        return respostaJson({
            sucesso: true,
            nome: sessao.nome
        });
    }
    catch (erro) {
        console.error(
            "Erro ao verificar sessão:",
            erro
        );

        return respostaJson(
            {
                sucesso: false,
                mensagem:
                    "Erro ao verificar sessão."
            },
            500
        );
    }
}