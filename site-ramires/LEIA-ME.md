# Site do Ramires Personal - Guia de manutenção

## Como abrir
Dê dois cliques no arquivo `index.html`. Ele abre no navegador (precisa de internet só para carregar as fontes do Google).

## O que tem em cada pasta
```
site-ramires/
├── index.html        <- a ESTRUTURA do site (textos, seções, botões)
├── css/
│   └── estilo.css    <- a APARÊNCIA (cores, tamanhos, animações, versão celular e computador)
├── js/
│   └── script.js     <- o COMPORTAMENTO (calculadora, cards que abrem, WhatsApp...)
└── imagens/          <- todas as fotos do site
```
Regra simples: **mudou um texto → index.html. Mudou um visual → estilo.css. Mudou algo que se mexe → script.js.**

## As 3 coisas mais comuns

### 1) Colocar o número do WhatsApp
Abra `js/script.js`, procure por `NUMERO_WHATSAPP` (está no início) e troque.
Formato: 55 + DDD + número, tudo junto. Exemplo: `"5583999999999"`.
Isso já conserta todos os botões de WhatsApp do site de uma vez.

### 2) Trocar as redes sociais
Em `index.html`, procure `id="contatos"`. Cada rede tem um `<a href="#">`. Troque o `#` pelo link da rede
(ex.: `href="https://instagram.com/ramirespersonal"`). Para tirar uma rede, apague o bloco `<a>` dela.

### 3) Trocar uma cor
Abra `css/estilo.css` e procure `01. CORES E FONTES`. Mude o valor da variável e o site inteiro acompanha.

## Como trocar uma foto
Substitua o arquivo dentro de `imagens/` mantendo o mesmo nome (ou troque o nome no `index.html`).
Dica: use fotos `.webp` ou `.jpg` leves (até uns 100 KB cada) para o site abrir rápido.
Nos cards de serviço, o `object-position: 50% 20%` (no `index.html`) escolhe qual parte da foto aparece:
o primeiro número é esquerda/direita e o segundo é cima/baixo.

## Como adicionar uma SEÇÃO nova
1. No `index.html`, copie o modelo abaixo e cole antes do `<footer class="rodape">`:
```html
<!-- ===== MINHA NOVA SEÇÃO ===== -->
<section class="secao-nova" id="nova">
    <h2 class="titulo-secao">Título da seção</h2>
    <p>Texto da seção.</p>
</section>
```
2. No `css/estilo.css`, crie um bloco novo (copie o formato dos outros, com o comentário em cima):
```css
/* ============================================================
   16. MINHA NOVA SEÇÃO
   ============================================================ */
.secao-nova {
    margin-top: 34px;
}

@media (min-width: 768px) {
    .secao-nova { margin-top: 84px; }
}
```
3. (Opcional) Para a seção "aparecer ao rolar", em `js/script.js` adicione `".secao-nova"` na lista `BLOCOS_QUE_APARECEM`.

## Como adicionar um SERVIÇO novo
Copie um bloco `<div class="card-servico">` inteiro dentro de uma `linha-servicos` e troque a foto e os textos
(o `id` do detalhe e o `aria-controls` precisam ser iguais, ex.: `detalhe-pilates`).
Se a linha passar de 3 cards, ajuste as colunas em `estilo.css` (procure por `COLUNAS DAS LINHAS`).

## Como criar uma PÁGINA nova
1. Copie `index.html` e salve com outro nome, por exemplo `sobre.html` (na mesma pasta).
2. Apague o miolo (as seções) e deixe só o cabeçalho, as suas seções novas e o rodapé.
3. Mantenha as linhas `<link rel="stylesheet" href="css/estilo.css">` e `<script src="js/script.js">`.
4. Para ligar as páginas, use `<a href="sobre.html">Sobre</a>` no cabeçalho.
Observação: o `script.js` procura elementos que existem só na página inicial. Se uma página nova não tiver a
calculadora, por exemplo, o JavaScript dá erro no console ao procurar `campo-idade`. O mais seguro é copiar o
`script.js` para `script-sobre.js` e deixar nele apenas os blocos que a página usa (WhatsApp e ano do rodapé).

## Como colocar o site na internet
Envie a pasta inteira (`index.html`, `css`, `js` e `imagens`) para uma hospedagem (Netlify, Vercel, GitHub Pages, etc.).
Não separe os arquivos: o `index.html` precisa encontrar as pastas ao lado dele.

## Nomes que você vai ver no código
| Nome | O que é |
|---|---|
| `pagina` | A caixa que guarda o site inteiro |
| `secao-inicio` | A primeira tela (título + foto do Ramires) |
| `faixa-especialidades` | O texto que fica rolando |
| `secao-saude` | A calculadora |
| `secao-servicos` / `card-servico` | Os cards com foto |
| `secao-chamada-final` | A faixa escura "Vamos conversar..." |
| `secao-contatos` / `rede-social` | Os botões das redes |
| `rodape` | A última linha com os direitos reservados |
| `botao` | O botão preto padrão |
