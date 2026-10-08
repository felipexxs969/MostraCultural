import {
    obterSessao,
    respostaJson
} from "../lib/auth.js";

export async function onRequestDelete(context) {
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

        await context.env.DB.batch([
            context.env.DB.prepare(`
                DELETE FROM sessoes
                WHERE usuario_id = ?
            `).bind(sessao.usuarioId),

            context.env.DB.prepare(`
                DELETE FROM usuarios
                WHERE id = ?
            `).bind(sessao.usuarioId)
        ]);

        return respostaJson({
            sucesso: true,
            mensagem:
                "Conta excluída com sucesso."
        });
    }
    catch (erro) {
        console.error(
            "Erro ao excluir conta:",
            erro
        );

        return respostaJson(
            {
                sucesso: false,
                mensagem:
                    "Erro ao excluir conta."
            },
            500
        );
    }
}