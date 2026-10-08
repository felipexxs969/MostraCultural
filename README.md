# Mostra Cultural — seleção de andar + login + mapa

O painel visual foi removido.

Agora o site está separado em 3 etapas:

1. `index.html` — tela inicial com apenas o nome **Mostra Cultural** e os botões `Pátio`, `1º Andar`, `2º Andar` e `3º Andar`.
2. `login.html` — o usuário faz login depois de escolher o andar.
3. `mapa.html` — abre o mapa do andar escolhido.

## Fluxo

`index.html` → escolher andar → `login.html?andar=...` → login → `mapa.html?andar=...`

## Onde editar os mapas

Abra `site-config.js`.

Cada andar tem sua própria configuração:

```js
andares: {
    patio: { ... },
    andar1: { ... },
    andar2: { ... },
    andar3: { ... }
}
```

Dentro de cada andar você pode adicionar `texto`, `botao`, `imagem`, `icone` e `separador`, usando `x`, `y`, `largura` e `altura`.

### Exemplo de imagem

```js
{
    id: "logo-entrada",
    tipo: "imagem",
    imagem: "imagens/logo.png",
    ajuste: "contain",
    x: 500,
    y: 400,
    largura: 300,
    altura: 200
}
```

### Exemplo de botão

```js
{
    id: "sala-101",
    tipo: "botao",
    texto: "Sala 101",
    x: 900,
    y: 500,
    largura: 220,
    altura: 60,
    cor: "#ffffff",
    corTexto: "#111827",
    tamanho: 18,
    acao: "link",
    link: "https://exemplo.com"
}
```

## Como executar

```bash
npm install
node server.js
```

Depois abra `http://localhost:3000`.

O `mapa.html` exige um login válido. O mapa continua grande, com 3000 × 2000 px, e pode ser arrastado com mouse ou toque.


## Alteração desta versão

Na tela do mapa foram removidos os botões “Trocar andar” e “Sair”. O mapa continua protegido pelo login, e o usuário permanece no andar que escolheu até sair do navegador/sessão.
