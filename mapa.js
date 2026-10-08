let dadosSite = null;

let mapaX = 0;
let mapaY = 0;

let arrastandoMapa = false;

let inicioMouseX = 0;
let inicioMouseY = 0;

let inicioMapaX = 0;
let inicioMapaY = 0;

let moveuMapa = false;
let ignorarProximoClique = false;

const LIMITE_MOVIMENTO = 6;

const configCompleta =
    window.SITE_CONFIG || {};

const MAPA_LARGURA =
    Number(configCompleta.mapa?.largura) || 3000;

const MAPA_ALTURA =
    Number(configCompleta.mapa?.altura) || 2000;


// ========================================
// ANDAR ESCOLHIDO
// ========================================

const parametros =
    new URLSearchParams(
        window.location.search
    );

const andarEscolhido =
    parametros.get("andar") || "patio";


// ========================================
// ELEMENTOS
// ========================================

const viewport =
    document.getElementById(
        "mapa-viewport"
    );

const site =
    document.getElementById("site");

const nomeAndar =
    document.getElementById("nomeAndar");


site.style.width =
    MAPA_LARGURA + "px";

site.style.height =
    MAPA_ALTURA + "px";


// ========================================
// FUNÇÕES AUXILIARES
// ========================================

function numero(valor, padrao = 0) {

    const n = Number(valor);

    return Number.isFinite(n)
        ? n
        : padrao;
}


function limitarElementoAoMapa(elemento) {

    const largura =
        Math.max(
            2,
            numero(elemento.largura, 100)
        );

    const altura =
        Math.max(
            2,
            numero(elemento.altura, 50)
        );


    elemento.largura =
        largura;

    elemento.altura =
        altura;


    elemento.x =
        Math.max(
            0,
            Math.min(
                numero(elemento.x, 0),
                MAPA_LARGURA - largura
            )
        );


    elemento.y =
        Math.max(
            0,
            Math.min(
                numero(elemento.y, 0),
                MAPA_ALTURA - altura
            )
        );
}


// ========================================
// NORMALIZAR DADOS
// ========================================

function normalizarDados(dados) {

    if (
        !dados ||
        typeof dados !== "object"
    ) {
        throw new Error(
            "Configuração do mapa inválida."
        );
    }


    const elementos =
        Array.isArray(dados.elementos)
            ? dados.elementos.map(
                elemento => ({
                    ...elemento
                })
            )
            : [];


    elementos.forEach(
        limitarElementoAoMapa
    );


    return {

        nome:
            typeof dados.nome === "string"
                ? dados.nome
                : "Mapa",

        fundo:
            typeof dados.fundo === "string"
                ? dados.fundo
                : "#4f46e5",

        cameraInicial:
            dados.cameraInicial || {},

        elementos

    };
}


// ========================================
// CRIAR ELEMENTO
// ========================================

function criarElemento(elemento) {

    let item;


    // ====================================
    // TEXTO
    // ====================================

    if (elemento.tipo === "texto") {

        item =
            document.createElement("div");

        item.textContent =
            elemento.texto || "";

        item.style.color =
            elemento.cor || "#ffffff";

        item.style.fontSize =
            numero(
                elemento.tamanho,
                18
            ) + "px";

        item.style.whiteSpace =
            "pre-wrap";

        item.style.overflowWrap =
            "anywhere";
    }


    // ====================================
    // BOTÃO
    // ====================================

    else if (
        elemento.tipo === "botao"
    ) {

        item =
            document.createElement("a");

        item.textContent =
            elemento.texto || "Botão";

        item.style.background =
            elemento.cor || "#4f46e5";

        item.style.color =
            elemento.corTexto || "#ffffff";

        item.style.borderRadius =
            "10px";

        item.style.textDecoration =
            "none";

        item.style.fontWeight =
            "bold";

        item.style.display =
            "flex";

        item.style.alignItems =
            "center";

        item.style.justifyContent =
            "center";

        item.style.padding =
            "8px 14px";

        item.style.cursor =
            "pointer";

        item.style.userSelect =
            "none";


        if (
            elemento.acao === "link"
        ) {

            item.href =
                elemento.link || "#";

        } else {

            item.href = "#";

        }


        item.addEventListener(
            "click",
            event => {

                if (
                    ignorarProximoClique
                ) {

                    event.preventDefault();

                    event.stopPropagation();

                    ignorarProximoClique =
                        false;

                    return;
                }


                if (
                    elemento.acao === "back"
                ) {

                    event.preventDefault();

                    window.history.back();

                }

                else if (
                    elemento.acao === "reload"
                ) {

                    event.preventDefault();

                    window.location.reload();

                }

            }
        );
    }


    // ====================================
    // IMAGEM / ÍCONE
    // ====================================

    else if (
        elemento.tipo === "imagem" ||
        elemento.tipo === "icone"
    ) {

        item =
            document.createElement("div");

        item.classList.add(
            "imagem-publica"
        );


        const img =
            document.createElement("img");


        img.src =
            elemento.imagem || "";

        img.alt =
            elemento.alt || "";

        img.draggable =
            false;

        img.style.width =
            "100%";

        img.style.height =
            "100%";

        img.style.objectFit =
            elemento.ajuste || "contain";

        img.style.pointerEvents =
            "none";


        item.appendChild(img);
    }


    // ====================================
    // SEPARADOR
    // ====================================

    else if (
        elemento.tipo === "separador"
    ) {

        item =
            document.createElement("div");

        item.classList.add(
            "separador-site"
        );

        item.style.background =
            elemento.cor || "#ffffff";
    }


    else {

        return null;
    }


    // ====================================
    // POSIÇÃO DO ELEMENTO
    // ====================================

    item.id =
        elemento.id || "";

    item.classList.add(
        "elemento-site"
    );

    item.style.left =
        numero(elemento.x) + "px";

    item.style.top =
        numero(elemento.y) + "px";

    item.style.width =
        numero(
            elemento.largura,
            100
        ) + "px";

    item.style.height =
        numero(
            elemento.altura,
            50
        ) + "px";

    item.dataset.elementoId =
        elemento.id || "";


    return item;
}


// ========================================
// RENDERIZAR MAPA
// ========================================

function renderizarSite() {

    site.innerHTML = "";


    dadosSite.elementos.forEach(
        elemento => {

            const item =
                criarElemento(
                    elemento
                );

            if (item) {

                site.appendChild(item);

            }

        }
    );


    document.body.style.background =
        dadosSite.fundo;

    site.style.background =
        dadosSite.fundo;


    if (nomeAndar) {

        nomeAndar.textContent =
            dadosSite.nome;

    }
}


// ========================================
// VERIFICAR LOGIN
// ========================================

async function verificarLogin() {

    const token =
        sessionStorage.getItem(
            "token"
        );


    if (!token) {

        window.location.replace(
            `login.html?andar=${encodeURIComponent(andarEscolhido)}`
        );

        return false;
    }


    try {

        const resposta =
            await fetch(
                "/api/auth/me",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    cache: "no-store"
                }
            );


        if (!resposta.ok) {

            sessionStorage.removeItem(
                "token"
            );

            window.location.replace(
                `login.html?andar=${encodeURIComponent(andarEscolhido)}`
            );

            return false;
        }


        return true;

    }

    catch (erro) {

        console.error(
            "Erro ao verificar login:",
            erro
        );


        // Mantém o comportamento
        // atual do seu projeto.
        return true;
    }
}


// ========================================
// CARREGAR MAPA
// ========================================

async function carregarSite() {

    try {

        let dados = null;


        // ==================================
        // TENTA API
        // ==================================

        try {

            const resposta =
                await fetch(
                    `/api/site?andar=${encodeURIComponent(andarEscolhido)}`,
                    {
                        cache: "no-store"
                    }
                );


            if (resposta.ok) {

                dados =
                    await resposta.json();

            }

        }

        catch (erroApi) {

            console.warn(
                "API indisponível. Usando site-config.js."
            );

        }


        // ==================================
        // FALLBACK PARA SITE-CONFIG.JS
        // ==================================

        if (
            !dados ||
            !dados.sucesso
        ) {

            const andar =
                configCompleta
                    .andares?.[
                        andarEscolhido
                    ];


            if (!andar) {

                throw new Error(
                    "Andar não encontrado."
                );

            }


            dados = {

                sucesso: true,

                nome:
                    andar.nome,

                fundo:
                    andar.fundo,

                cameraInicial:
                    andar.cameraInicial,

                elementos:
                    andar.elementos

            };
        }


        dadosSite =
            normalizarDados(
                dados
            );


        renderizarSite();

        iniciarMapaNaAreaPrincipal();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar mapa:",
            erro
        );


        site.innerHTML = "";

        site.style.background =
            "#111827";


        const aviso =
            document.createElement(
                "div"
            );


        aviso.textContent =
            "Não foi possível carregar este andar.";


        aviso.style.position =
            "absolute";

        aviso.style.left =
            "80px";

        aviso.style.top =
            "80px";

        aviso.style.color =
            "white";

        aviso.style.font =
            "bold 24px Arial, sans-serif";


        site.appendChild(
            aviso
        );
    }
}


// ========================================
// LIMITAR MOVIMENTO DO MAPA
// ========================================

function limitarMapa() {

    const vw =
        viewport.clientWidth;

    const vh =
        viewport.clientHeight;


    const menorX =
        Math.min(
            0,
            vw - MAPA_LARGURA
        );


    const menorY =
        Math.min(
            0,
            vh - MAPA_ALTURA
        );


    mapaX =
        Math.min(
            0,
            Math.max(
                menorX,
                mapaX
            )
        );


    mapaY =
        Math.min(
            0,
            Math.max(
                menorY,
                mapaY
            )
        );
}


// ========================================
// APLICAR POSIÇÃO
// ========================================

function aplicarPosicao() {

    site.style.transform =
        `translate3d(
            ${Math.round(mapaX)}px,
            ${Math.round(mapaY)}px,
            0
        )`;
}


// ========================================
// POSIÇÃO INICIAL
// ========================================

function iniciarMapaNaAreaPrincipal() {

    const camera =
        dadosSite?.cameraInicial || {};


    if (
        camera.x === "auto"
    ) {

        const primeiroElemento =
            dadosSite.elementos[0];


        if (primeiroElemento) {

            mapaX =
                Math.round(
                    viewport.clientWidth / 2 -
                    (
                        numero(
                            primeiroElemento.x
                        ) +
                        numero(
                            primeiroElemento.largura,
                            100
                        ) / 2
                    )
                );


            mapaY =
                Math.round(
                    viewport.clientHeight / 2 -
                    (
                        numero(
                            primeiroElemento.y
                        ) +
                        numero(
                            primeiroElemento.altura,
                            50
                        ) / 2
                    )
                );

        }

        else {

            mapaX =
                Math.round(
                    (
                        viewport.clientWidth -
                        MAPA_LARGURA
                    ) / 2
                );


            mapaY =
                Math.round(
                    (
                        viewport.clientHeight -
                        MAPA_ALTURA
                    ) / 2
                );

        }

    }

    else {

        const valorX =
            Number(camera.x);


        mapaX =
            Number.isFinite(valorX)
                ? valorX
                : 0;
    }


    const valorY =
        Number(camera.y);


    if (
        Number.isFinite(valorY)
    ) {

        mapaY =
            valorY;

    }


    limitarMapa();

    aplicarPosicao();
}


// ========================================
// ARRASTAR MAPA
// ========================================

function iniciarArrastoMapa(event) {

    if (
        event.pointerType === "mouse" &&
        event.button !== 0
    ) {

        return;
    }


    if (
        event.target.closest(
            "a, button, header"
        )
    ) {

        return;
    }


    arrastandoMapa =
        true;

    moveuMapa =
        false;


    inicioMouseX =
        event.clientX;

    inicioMouseY =
        event.clientY;


    inicioMapaX =
        mapaX;

    inicioMapaY =
        mapaY;


    viewport.classList.add(
        "arrastando"
    );


    try {

        viewport.setPointerCapture(
            event.pointerId
        );

    }

    catch (_) {}
}


// ========================================
// MOVER MAPA
// ========================================

function moverMapa(event) {

    if (!arrastandoMapa) {
        return;
    }


    const dx =
        event.clientX -
        inicioMouseX;


    const dy =
        event.clientY -
        inicioMouseY;


    if (
        Math.abs(dx) >
            LIMITE_MOVIMENTO ||
        Math.abs(dy) >
            LIMITE_MOVIMENTO
    ) {

        moveuMapa =
            true;
    }


    mapaX =
        inicioMapaX + dx;

    mapaY =
        inicioMapaY + dy;


    limitarMapa();

    aplicarPosicao();


    if (moveuMapa) {

        ignorarProximoClique =
            true;

        event.preventDefault();

    }
}


// ========================================
// FINALIZAR ARRASTO
// ========================================

function finalizarArrastoMapa(event) {

    if (!arrastandoMapa) {
        return;
    }


    arrastandoMapa =
        false;


    viewport.classList.remove(
        "arrastando"
    );


    try {

        viewport.releasePointerCapture(
            event.pointerId
        );

    }

    catch (_) {}


    setTimeout(() => {

        moveuMapa =
            false;

    }, 0);
}


// ========================================
// EVENTOS DO MAPA
// ========================================

viewport.addEventListener(
    "pointerdown",
    iniciarArrastoMapa
);

viewport.addEventListener(
    "pointermove",
    moverMapa
);

viewport.addEventListener(
    "pointerup",
    finalizarArrastoMapa
);

viewport.addEventListener(
    "pointercancel",
    finalizarArrastoMapa
);


// ========================================
// RODA DO MOUSE
// ========================================

viewport.addEventListener(
    "wheel",
    event => {

        if (
            Math.abs(event.deltaX) >
            Math.abs(event.deltaY)
        ) {

            mapaX -=
                event.deltaX;

        }

        else if (
            event.shiftKey
        ) {

            mapaX -=
                event.deltaY;

        }

        else {

            mapaY -=
                event.deltaY;

        }


        limitarMapa();

        aplicarPosicao();

        event.preventDefault();

    },
    {
        passive: false
    }
);


// ========================================
// REDIMENSIONAMENTO
// ========================================

window.addEventListener(
    "resize",
    () => {

        limitarMapa();

        aplicarPosicao();

    }
);


// ========================================
// INICIAR
// ========================================

(async function iniciar() {

    const logado =
        await verificarLogin();


    if (!logado) {
        return;
    }


    await carregarSite();

})();