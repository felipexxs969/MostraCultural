/*
 * MOSTRA CULTURAL - CONFIGURAÇÃO DOS MAPAS
 *
 * O index.html é apenas a tela inicial.
 * Cada botão escolhe um mapa e leva o usuário para o login.
 * Depois do login, mapa.html abre o andar escolhido.
 *
 * Edite os elementos abaixo para montar cada andar pelo código.
 * Mapa: 3000 x 2000 px.
 */

(function () {
    const mapaPadrao = {
        largura: 3000,
        altura: 2000
    };

    const config = {
        mapa: mapaPadrao,

        andares: {
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
        }
    };

    if (typeof window !== "undefined") {
        window.SITE_CONFIG = config;
    }

    if (typeof module !== "undefined" && module.exports) {
        module.exports = config;
    }
})();
