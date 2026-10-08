const express = require("express");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const PORT = 3000;

const db = new DatabaseSync(path.join(__dirname, "usuarios.db"));
const pastaImagens = path.join(__dirname, "imagens");

if (!fs.existsSync(pastaImagens)) {
    fs.mkdirSync(pastaImagens, { recursive: true });
}

db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )
`);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ================================================================
// SESSÕES
// ================================================================

const sessoes = new Map();

function criarSessao(usuarioId, nome) {
    const token = crypto.randomBytes(32).toString("hex");
    sessoes.set(token, {
        usuarioId,
        nome,
        criadaEm: Date.now()
    });
    return token;
}

function obterSessao(req) {
    const cabecalho = req.headers.authorization || "";
    if (!cabecalho.startsWith("Bearer ")) return null;
    return sessoes.get(cabecalho.slice(7)) || null;
}

function exigirLogin(req, res, next) {
    const sessao = obterSessao(req);
    if (!sessao) {
        return res.status(401).json({
            sucesso: false,
            mensagem: "Sua sessão terminou. Faça login novamente."
        });
    }
    req.sessao = sessao;
    next();
}

// ================================================================
// CONFIGURAÇÃO DOS MAPAS
// ================================================================

function carregarConfig() {
    const caminhoConfig = path.join(__dirname, "site-config.js");
    delete require.cache[require.resolve(caminhoConfig)];
    return require(caminhoConfig);
}

app.get("/api/site", (req, res) => {
    try {
        const config = carregarConfig();
        const chaveAndar = String(req.query.andar || "patio");
        const andar = config.andares?.[chaveAndar];

        if (!andar) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Andar não encontrado."
            });
        }

        res.json({
            sucesso: true,
            nome: andar.nome,
            fundo: andar.fundo,
            cameraInicial: andar.cameraInicial,
            elementos: Array.isArray(andar.elementos) ? andar.elementos : []
        });
    }
    catch (erro) {
        console.error("Erro na configuração do site:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao carregar site-config.js."
        });
    }
});

// ================================================================
// CADASTRO
// ================================================================

app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Preencha todos os campos."
            });
        }

        if (nome.trim().length < 2) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Digite um nome válido."
            });
        }

        if (senha.length < 6) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "A senha precisa ter pelo menos 6 caracteres."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const usuarioExistente = db
            .prepare("SELECT id FROM usuarios WHERE email = ?")
            .get(emailNormalizado);

        if (usuarioExistente) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        db.prepare(`
            INSERT INTO usuarios (nome, email, senha)
            VALUES (?, ?, ?)
        `).run(nome.trim(), emailNormalizado, senhaHash);

        res.json({
            sucesso: true,
            mensagem: "Cadastro realizado com sucesso!"
        });
    }
    catch (erro) {
        console.error("Erro no cadastro:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao cadastrar usuário."
        });
    }
});

// ================================================================
// LOGIN
// ================================================================

app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Digite seu e-mail e sua senha."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const usuario = db.prepare(`
            SELECT id, nome, email, senha
            FROM usuarios
            WHERE email = ?
        `).get(emailNormalizado);

        if (!usuario) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail ou senha incorretos."
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "E-mail ou senha incorretos."
            });
        }

        const token = criarSessao(usuario.id, usuario.nome);

        res.json({
            sucesso: true,
            nome: usuario.nome,
            token
        });
    }
    catch (erro) {
        console.error("Erro no login:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao realizar login."
        });
    }
});

app.get("/api/auth/me", exigirLogin, (req, res) => {
    res.json({ sucesso: true, nome: req.sessao.nome });
});

app.post("/api/logout", (req, res) => {
    const cabecalho = req.headers.authorization || "";
    if (cabecalho.startsWith("Bearer ")) {
        sessoes.delete(cabecalho.slice(7));
    }
    res.json({ sucesso: true, mensagem: "Sessão encerrada." });
});

app.delete("/api/conta", exigirLogin, (req, res) => {
    try {
        db.prepare("DELETE FROM usuarios WHERE id = ?").run(req.sessao.usuarioId);

        const cabecalho = req.headers.authorization || "";
        if (cabecalho.startsWith("Bearer ")) {
            sessoes.delete(cabecalho.slice(7));
        }

        res.json({ sucesso: true, mensagem: "Conta excluída com sucesso." });
    }
    catch (erro) {
        console.error("Erro ao excluir conta:", erro);
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao excluir conta."
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log("");
    console.log("==============================");
    console.log(" SERVIDOR INICIADO");
    console.log(` http://localhost:${PORT}`);
    console.log("==============================");
    console.log("");
});
