function salvarToken(token) {
    sessionStorage.setItem("token", token);
}

function obterAndarEscolhido() {
    const parametros = new URLSearchParams(
        window.location.search
    );

    return parametros.get("andar") || "patio";
}


// ========================================
// LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const senha =
                document
                    .getElementById("senha")
                    .value;

            const mensagem =
                document.getElementById("mensagem");

            const botao =
                document.getElementById("botaoLogin");

            const andar =
                obterAndarEscolhido();


            mensagem.textContent = "Entrando...";
            mensagem.style.color = "#555";

            botao.disabled = true;


            try {

                const resposta = await fetch(
                    "/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            senha
                        })
                    }
                );


                const resultado =
                    await resposta.json();


                if (resultado.sucesso) {

                    salvarToken(
                        resultado.token
                    );


                    mensagem.textContent =
                        "Login realizado!";

                    mensagem.style.color =
                        "#16a34a";


                    setTimeout(() => {

                        window.location.href =
                            `mapa.html?andar=${encodeURIComponent(andar)}`;

                    }, 350);

                }

                else {

                    mensagem.textContent =
                        resultado.mensagem ||
                        "Não foi possível entrar.";

                    mensagem.style.color =
                        "#dc2626";

                    botao.disabled = false;
                }

            }

            catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );

                mensagem.textContent =
                    "Erro ao conectar com o servidor.";

                mensagem.style.color =
                    "#dc2626";

                botao.disabled = false;
            }

        }
    );
}


// ========================================
// CADASTRO
// ========================================

const cadastroForm =
    document.getElementById("cadastroForm");

if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const nome =
                document
                    .getElementById("nome")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("emailCadastro")
                    .value
                    .trim();

            const senha =
                document
                    .getElementById("senhaCadastro")
                    .value;

            const mensagem =
                document.getElementById(
                    "mensagemCadastro"
                );

            const botao =
                document.getElementById(
                    "botaoCadastro"
                );


            if (senha.length < 6) {

                mensagem.textContent =
                    "A senha precisa ter pelo menos 6 caracteres.";

                mensagem.style.color =
                    "#dc2626";

                return;
            }


            mensagem.textContent =
                "Criando conta...";

            mensagem.style.color =
                "#555";

            botao.disabled = true;


            try {

                const resposta = await fetch(
                    "/cadastro",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            nome,
                            email,
                            senha
                        })
                    }
                );


                const resultado =
                    await resposta.json();


                if (resultado.sucesso) {

                    mensagem.textContent =
                        "Conta criada! Agora faça login.";

                    mensagem.style.color =
                        "#16a34a";


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 900);

                }

                else {

                    mensagem.textContent =
                        resultado.mensagem ||
                        "Erro ao cadastrar.";

                    mensagem.style.color =
                        "#dc2626";

                    botao.disabled = false;
                }

            }

            catch (erro) {

                console.error(
                    "Erro no cadastro:",
                    erro
                );

                mensagem.textContent =
                    "Erro ao conectar com o servidor.";

                mensagem.style.color =
                    "#dc2626";

                botao.disabled = false;
            }

        }
    );
}