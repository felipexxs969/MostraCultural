const MAPA = {
    largura: 3000,
    altura: 2000
};

const ANDARES = {
    patio: {
        nome: "Pátio",
        fundo: "#4f46e5",
        cameraInicial: {
            x: "auto",
            y: 0
        },
        elementos: [
            {
                id: "titulo-patio",
                tipo: "texto",
                texto: "Pátio",
                x: 300,
                y: 100,
                largura: 700,
                altura: 70,
                cor: "#ffffff",
                tamanho: 42
            },
            {
                id: "subtitulo-patio",
                tipo: "texto",
                texto: "Mapa do Pátio",
                x: 300,
                y: 190,
                largura: 700,
                altura: 50,
                cor: "#ffffff",
                tamanho: 22
            }
        ]
    },

    andar1: {
        nome: "1º Andar",
        fundo: "#0f766e",
        cameraInicial: {
            x: "auto",
            y: 0
        },
        elementos: [
            {
                id: "titulo-1-andar",
                tipo: "texto",
                texto: "1º Andar",
                x: 300,
                y: 100,
                largura: 700,
                altura: 70,
                cor: "#ffffff",
                tamanho: 42
            },
            {
                id: "subtitulo-1-andar",
                tipo: "texto",
                texto: "Mapa do 1º andar",
                x: 300,
                y: 190,
                largura: 700,
                altura: 50,
                cor: "#ffffff",
                tamanho: 22
            }
        ]
    },

    andar2: {
        nome: "2º Andar",
        fundo: "#b45309",
        cameraInicial: {
            x: "auto",
            y: 0
        },
        elementos: [
            {
                id: "titulo-2-andar",
                tipo: "texto",
                texto: "2º Andar",
                x: 300,
                y: 100,
                largura: 700,
                altura: 70,
                cor: "#ffffff",
                tamanho: 42
            },
            {
                id: "subtitulo-2-andar",
                tipo: "texto",
                texto: "Mapa do 2º andar",
                x: 300,
                y: 190,
                largura: 700,
                altura: 50,
                cor: "#ffffff",
                tamanho: 22
            }
        ]
    },

    andar3: {
        nome: "3º Andar",
        fundo: "#7c3aed",
        cameraInicial: {
            x: "auto",
            y: 0
        },
        elementos: [
            {
                id: "titulo-3-andar",
                tipo: "texto",
                texto: "3º Andar",
                x: 300,
                y: 100,
                largura: 700,
                altura: 70,
                cor: "#ffffff",
                tamanho: 42
            },
            {
                id: "subtitulo-3-andar",
                tipo: "texto",
                texto: "Mapa do 3º andar",
                x: 300,
                y: 190,
                largura: 700,
                altura: 50,
                cor: "#ffffff",
                tamanho: 22
            }
        ]
    }
};

export async function onRequestGet(context) {
    try {
        const url = new URL(
            context.request.url
        );

        const chaveAndar =
            url.searchParams.get("andar") ||
            "patio";

        const andar =
            ANDARES[chaveAndar];

        if (!andar) {
            return Response.json(
                {
                    sucesso: false,
                    mensagem:
                        "Andar não encontrado."
                },
                {
                    status: 404
                }
            );
        }

        return Response.json({
            sucesso: true,
            mapa: MAPA,
            nome: andar.nome,
            fundo: andar.fundo,
            cameraInicial:
                andar.cameraInicial,
            elementos:
                Array.isArray(
                    andar.elementos
                )
                    ? andar.elementos
                    : []
        });
    }
    catch (erro) {
        console.error(
            "Erro ao carregar mapa:",
            erro
        );

        return Response.json(
            {
                sucesso: false,
                mensagem:
                    "Erro ao carregar o mapa."
            },
            {
                status: 500
            }
        );
    }
}