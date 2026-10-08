function bytesToBase64Url(bytes) {
    let binario = "";

    for (const byte of bytes) {
        binario += String.fromCharCode(byte);
    }

    return btoa(binario)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}

async function hashToken(token) {
    const dados = new TextEncoder().encode(token);

    const hash = await crypto.subtle.digest(
        "SHA-256",
        dados
    );

    const bytes = new Uint8Array(hash);

    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}

export async function criarToken() {
    const bytes = new Uint8Array(32);

    crypto.getRandomValues(bytes);

    return bytesToBase64Url(bytes);
}

export async function criarSessao(
    env,
    usuarioId
) {
    const token = await criarToken();

    const tokenHash = await hashToken(token);

    const agora = Math.floor(
        Date.now() / 1000
    );

    const expiraEm =
        agora + (60 * 60 * 24 * 7);

    await env.DB.prepare(`
        INSERT INTO sessoes (
            token_hash,
            usuario_id,
            criada_em,
            expira_em
        )
        VALUES (?, ?, ?, ?)
    `)
        .bind(
            tokenHash,
            usuarioId,
            agora,
            expiraEm
        )
        .run();

    return token;
}

export async function obterSessao(
    request,
    env
) {
    const cabecalho =
        request.headers.get("Authorization") || "";

    if (!cabecalho.startsWith("Bearer ")) {
        return null;
    }

    const token =
        cabecalho.slice(7).trim();

    if (!token) {
        return null;
    }

    const tokenHash =
        await hashToken(token);

    const agora =
        Math.floor(Date.now() / 1000);

    const sessao =
        await env.DB.prepare(`
            SELECT
                sessoes.usuario_id AS usuarioId,
                usuarios.nome AS nome
            FROM sessoes
            INNER JOIN usuarios
                ON usuarios.id = sessoes.usuario_id
            WHERE sessoes.token_hash = ?
              AND sessoes.expira_em > ?
        `)
            .bind(
                tokenHash,
                agora
            )
            .first();

    return sessao || null;
}

export async function excluirSessao(
    request,
    env
) {
    const cabecalho =
        request.headers.get("Authorization") || "";

    if (!cabecalho.startsWith("Bearer ")) {
        return;
    }

    const token =
        cabecalho.slice(7).trim();

    if (!token) {
        return;
    }

    const tokenHash =
        await hashToken(token);

    await env.DB.prepare(`
        DELETE FROM sessoes
        WHERE token_hash = ?
    `)
        .bind(tokenHash)
        .run();
}

export async function lerDados(request) {
    const tipo =
        request.headers.get("content-type") || "";

    if (
        tipo.includes("application/json")
    ) {
        return await request.json();
    }

    const formulario =
        await request.formData();

    return Object.fromEntries(
        formulario.entries()
    );
}

export function respostaJson(
    dados,
    status = 200
) {
    return new Response(
        JSON.stringify(dados),
        {
            status,
            headers: {
                "Content-Type":
                    "application/json; charset=UTF-8"
            }
        }
    );
}