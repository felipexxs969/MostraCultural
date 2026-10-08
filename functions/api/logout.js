import {
    excluirSessao,
    respostaJson
} from "../lib/auth.js";

export async function onRequestPost(context) {
    try {
        await excluirSessao(
            context.request,
            context.env
        );

        return respostaJson({
            sucesso: true,
            mensagem: "Sessão encerrada."
        });
    }
    catch (erro) {
        console.error(
            "Erro ao sair:",
            erro
        );

        return respostaJson(
            {
                sucesso: false,
                mensagem:
                    "Erro ao encerrar sessão."
            },
            500
        );
    }
}