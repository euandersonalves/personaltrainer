/* ============================================================
   SCRIPT DO SITE - RAMIRES PERSONAL
   ------------------------------------------------------------
   Aqui fica tudo que "se mexe" no site. O arquivo está dividido
   em blocos, na mesma ordem do index.html:

     1. CONFIGURAÇÕES (número do WhatsApp - o que você mais vai mudar)
     2. FUNÇÕES AUXILIARES
     3. BOTÕES DE WHATSAPP
     4. ANO DO RODAPÉ
     5. CALCULADORA DE SAÚDE
     6. CARDS DE SERVIÇO (abrir e fechar)
     7. APARECER AO ROLAR
     8. EFEITO DO MOUSE NO INÍCIO

   Cada bloco é independente: se um dia você apagar uma seção
   do HTML, pode apagar o bloco dela aqui também.
   ============================================================ */


/* ============================================================
   1. CONFIGURAÇÕES
   ============================================================ */

// Número do WhatsApp do Ramires: código do país (55) + DDD + número, tudo junto, sem espaços.
// Exemplo: 55 + 83 + 999999999 = "5583999999999"
const NUMERO_WHATSAPP = "5500000000000"; // <-- TROQUE PELO NÚMERO REAL

// Mensagem que vai pronta nos botões comuns de WhatsApp
const MENSAGEM_PADRAO = "Olá, Ramires! Quero saber mais sobre os treinos.";


/* ============================================================
   2. FUNÇÕES AUXILIARES
   (pequenas funções usadas em vários lugares)
   ============================================================ */

// Cria o link do WhatsApp com uma mensagem já escrita
function criarLinkWhatsapp(mensagem) {
    return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(mensagem);
}

// Escreve um número com 1 casa decimal e vírgula (ex.: 22.46 vira "22,5")
function formatarNumero(numero) {
    return numero.toFixed(1).replace(".", ",");
}


/* ============================================================
   3. BOTÕES DE WHATSAPP
   Todo elemento com o atributo data-whatsapp no HTML recebe o link.
   Para criar mais um botão de WhatsApp, é só colocar data-whatsapp nele.
   ============================================================ */
const botoesWhatsapp = document.querySelectorAll("[data-whatsapp]");

botoesWhatsapp.forEach(function (botao) {
    botao.href = criarLinkWhatsapp(MENSAGEM_PADRAO);
    botao.target = "_blank"; // abre em outra aba
});


/* ============================================================
   4. ANO DO RODAPÉ
   ============================================================ */
const campoAno = document.getElementById("ano-atual");
campoAno.textContent = new Date().getFullYear();


/* ============================================================
   5. CALCULADORA DE SAÚDE
   Estima o percentual de gordura corporal (BF) com a fórmula de Deurenberg:
       BF = 1,20 x IMC + 0,23 x idade - 10,8 x (1 se homem, 0 se mulher) - 5,4
   É só uma ESTIMATIVA (por isso o aviso no site).
   ============================================================ */

// ---- 5.1 Elementos da página ----
const botoesSexo = document.querySelectorAll(".botao-sexo");
const campoIdade = document.getElementById("campo-idade");
const campoPeso = document.getElementById("campo-peso");
const campoAltura = document.getElementById("campo-altura");
const mensagemErro = document.getElementById("mensagem-erro");
const botaoCalcular = document.getElementById("botao-calcular");

const caixaResultado = document.getElementById("resultado");
const arcoGrafico = document.getElementById("arco-grafico");
const valorGordura = document.getElementById("valor-gordura");
const nomeCategoria = document.getElementById("nome-categoria");
const barraFaixas = document.getElementById("barra-faixas");
const textoImc = document.getElementById("texto-imc");
const textoDescricao = document.getElementById("texto-descricao");
const botaoWhatsappResultado = document.getElementById("botao-whatsapp-resultado");

// ---- 5.2 Dados ----

// Sexo escolhido no momento (começa em "homem", igual ao HTML)
let sexoEscolhido = "homem";

// Limites das faixas de gordura (%). Exemplo para homem:
// abaixo de 6 = faixa 0, de 6 a 18 = faixa 1, de 18 a 25 = faixa 2, acima de 25 = faixa 3
const LIMITES_DAS_FAIXAS = {
    homem: [6, 18, 25],
    mulher: [14, 25, 32]
};

// Os 4 resultados possíveis. A posição na lista é o número da faixa (0, 1, 2 ou 3).
//   nome     = aparece embaixo do gráfico
//   cor      = cor do gráfico, do nome e da barra
//   descricao = frase que aparece para a pessoa
//   mensagem = final da mensagem que vai para o WhatsApp
const RESULTADOS = [
    {
        nome: "Abaixo da faixa ideal",
        cor: "#3b82f6", // azul
        descricao: "Seu percentual está abaixo da faixa que costuma ser indicada para a saúde. Com ajustes na alimentação e no treino, dá para chegar lá com segurança.",
        mensagem: "Meu percentual ficou abaixo da faixa ideal e quero ajuda para ganhar massa e manter a saúde com segurança."
    },
    {
        nome: "Na faixa ideal",
        cor: "#22a06b", // verde
        descricao: "Ótima notícia: você está numa faixa considerada saudável. Agora dá para evoluir em força e desempenho.",
        mensagem: "Estou numa faixa boa e quero um plano para evoluir e manter os resultados."
    },
    {
        nome: "Um pouco acima",
        cor: "#f59e0b", // laranja
        descricao: "Você está um pouco acima da faixa ideal, e isso é bem comum. Com treino regular e bons hábitos, esse quadro muda.",
        mensagem: "Estou um pouco acima do ideal e quero montar uma rotina para reduzir gordura."
    },
    {
        nome: "Acima da faixa ideal",
        cor: "#e5484d", // vermelho
        descricao: "O primeiro passo você já deu. Agora é montar um plano seguro, no seu ritmo, para chegar à faixa ideal.",
        mensagem: "Meu resultado ficou acima da faixa ideal e quero começar um plano seguro, no meu ritmo."
    }
];

// ---- 5.3 Escolher Homem / Mulher ----
botoesSexo.forEach(function (botao) {
    botao.addEventListener("click", function () {
        sexoEscolhido = botao.dataset.sexo; // lê o data-sexo do HTML

        // Marca só o botão clicado (o CSS pinta de preto o aria-pressed="true")
        botoesSexo.forEach(function (outro) {
            outro.setAttribute("aria-pressed", outro === botao);
        });
    });
});

// ---- 5.4 Mostrar o resultado na tela ----
function mostrarResultado(dados) {
    // dados = { idade, peso, altura, imc, gordura, faixa }
    const resultado = RESULTADOS[dados.faixa];
    const limites = LIMITES_DAS_FAIXAS[sexoEscolhido];

    // A) Barra com 4 faixas coloridas
    // Cada faixa tem largura proporcional ao seu tamanho (a escala vai de 0 a 50%)
    const tamanhoDasFaixas = [
        limites[0],
        limites[1] - limites[0],
        limites[2] - limites[1],
        50 - limites[2]
    ];

    let htmlDaBarra = "";
    tamanhoDasFaixas.forEach(function (tamanho, numero) {
        const largura = (tamanho / 50) * 100;
        // a faixa da pessoa fica forte; as outras ficam bem claras
        const opacidade = (numero === dados.faixa) ? 1 : 0.35;
        htmlDaBarra += '<span class="barra-faixa" style="width:' + largura + '%; background:' + RESULTADOS[numero].cor + '; opacity:' + opacidade + ';"></span>';
    });

    // Marcador preto na posição da pessoa
    const posicaoMarcador = (Math.min(dados.gordura, 50) / 50) * 100;
    htmlDaBarra += '<span class="barra-marcador" style="left:' + posicaoMarcador + '%;"></span>';
    barraFaixas.innerHTML = htmlDaBarra;

    // B) Mostra a caixa do resultado
    caixaResultado.classList.add("visivel");

    // C) Gráfico em anel: zera, e logo depois enche (assim a animação toca)
    arcoGrafico.style.stroke = resultado.cor;
    arcoGrafico.setAttribute("stroke-dasharray", "0 352");
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            const tamanhoDoArco = (Math.min(dados.gordura, 50) / 50) * 352; // 352 = volta completa do círculo
            arcoGrafico.setAttribute("stroke-dasharray", tamanhoDoArco + " 352");
        });
    });

    // D) Textos
    valorGordura.textContent = formatarNumero(dados.gordura) + "%";
    nomeCategoria.textContent = resultado.nome;
    nomeCategoria.style.color = resultado.cor;
    textoImc.textContent = "IMC " + formatarNumero(dados.imc);
    textoDescricao.textContent = resultado.descricao;

    // E) Botão do WhatsApp com a mensagem escrita de acordo com o resultado
    const mensagem =
        "Olá, Ramires! Fiz a avaliação rápida do seu site: tenho " + dados.idade + " anos, sou " +
        (sexoEscolhido === "homem" ? "homem" : "mulher") + ", peso " + formatarNumero(dados.peso) +
        " kg e tenho " + Math.round(dados.altura) + " cm. O IMC deu " + formatarNumero(dados.imc) +
        " e a gordura corporal estimada é de " + formatarNumero(dados.gordura) + "% (" +
        resultado.nome.toLowerCase() + "). " + resultado.mensagem;

    botaoWhatsappResultado.href = criarLinkWhatsapp(mensagem);

    // F) Rola a página até o resultado, se ele estiver fora da tela
    caixaResultado.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// ---- 5.5 Clique no botão "Ver meu resultado" ----
botaoCalcular.addEventListener("click", function () {
    const idade = Number(campoIdade.value);
    const peso = Number(campoPeso.value);
    let altura = Number(campoAltura.value);

    // Se a pessoa digitar a altura em metros (ex.: 1,75), converte para centímetros
    if (altura > 0 && altura < 3) {
        altura = altura * 100;
    }

    // Confere se os números fazem sentido
    const idadeValida = idade >= 18 && idade <= 90;
    const pesoValido = peso >= 30 && peso <= 300;
    const alturaValida = altura >= 100 && altura <= 230;

    if (!idadeValida || !pesoValido || !alturaValida) {
        mensagemErro.textContent = "Confira os dados: idade de 18 a 90 anos, peso em kg e altura em cm.";
        return; // para aqui e não calcula
    }
    mensagemErro.textContent = ""; // limpa o erro

    // Conta do IMC e da gordura corporal
    const imc = peso / Math.pow(altura / 100, 2);
    const ajusteSexo = (sexoEscolhido === "homem") ? 10.8 : 0;
    let gordura = 1.2 * imc + 0.23 * idade - ajusteSexo - 5.4;

    // Mantém o resultado entre 3% e 60% para não aparecer número absurdo
    gordura = Math.max(3, Math.min(60, gordura));

    // Descobre em qual das 4 faixas a pessoa está
    const limites = LIMITES_DAS_FAIXAS[sexoEscolhido];
    let faixa = 3;
    if (gordura < limites[0]) {
        faixa = 0;
    } else if (gordura < limites[1]) {
        faixa = 1;
    } else if (gordura < limites[2]) {
        faixa = 2;
    }

    mostrarResultado({ idade: idade, peso: peso, altura: altura, imc: imc, gordura: gordura, faixa: faixa });
});


/* ============================================================
   6. CARDS DE SERVIÇO (abrir e fechar)
   Regras:
     - clicar em um card abre ele (e fecha o que estava aberto)
     - clicar no card aberto fecha
     - clicar fora, apertar Esc ou rolar a página para longe também fecha
   O JavaScript só troca CLASSES. Quem muda o tamanho dos cards é o CSS
   (veja a seção "10. SERVIÇOS" no estilo.css).
   ============================================================ */
const gradeServicos = document.getElementById("grade-servicos");
const linhasServicos = document.querySelectorAll(".linha-servicos");
const todosOsCards = document.querySelectorAll(".card-servico");

// Guarda qual card está aberto agora (null = nenhum)
let cardAberto = null;

// Abre o card recebido. Se receber null, fecha tudo.
function abrirCard(card) {
    cardAberto = card;

    // 1) Limpa o estado de todos os cards
    todosOsCards.forEach(function (outroCard) {
        const estaAberto = (outroCard === card);
        outroCard.classList.toggle("aberto", estaAberto);
        outroCard.querySelector(".card-botao").setAttribute("aria-expanded", estaAberto);
    });

    // 2) Limpa as classes de tamanho das linhas e da grade
    linhasServicos.forEach(function (linha) {
        linha.classList.remove("aberto-0", "aberto-1", "aberto-2");
    });
    gradeServicos.classList.remove("tem-aberto", "aberto-linha-1", "aberto-linha-2");

    // 3) Se tem card aberto, avisa a linha dele e a grade
    if (card !== null) {
        const linha = card.parentNode;
        const posicaoNaLinha = Array.from(linha.children).indexOf(card); // 0, 1 ou 2
        linha.classList.add("aberto-" + posicaoNaLinha);

        gradeServicos.classList.add("tem-aberto");
        if (linha.dataset.linha === "linha-1") {
            gradeServicos.classList.add("aberto-linha-1");
        } else {
            gradeServicos.classList.add("aberto-linha-2");
        }

        // Depois que a animação termina, garante que o card aberto aparece inteiro na tela
        setTimeout(function () {
            if (cardAberto === card) {
                card.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        }, 380);
    }
}

// Clique em um card: abre (ou fecha, se já estava aberto)
todosOsCards.forEach(function (card) {
    card.addEventListener("click", function (evento) {
        evento.stopPropagation(); // impede que o clique "vaze" e feche o card logo em seguida
        if (cardAberto === card) {
            abrirCard(null);
        } else {
            abrirCard(card);
        }
    });
});

// Clique em qualquer lugar fora dos cards: fecha
document.addEventListener("click", function () {
    if (cardAberto !== null) {
        abrirCard(null);
    }
});

// Tecla Esc: fecha
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && cardAberto !== null) {
        abrirCard(null);
    }
});

// Rolar a página até o card sair bem longe da tela: fecha
let verificandoRolagem = false; // evita rodar a conta mais de uma vez por quadro

window.addEventListener("scroll", function () {
    if (cardAberto === null || verificandoRolagem) {
        return;
    }
    verificandoRolagem = true;

    requestAnimationFrame(function () {
        verificandoRolagem = false;
        if (cardAberto === null) {
            return;
        }
        const posicao = cardAberto.getBoundingClientRect();
        const saiuPorCima = posicao.bottom < -80;
        const saiuPorBaixo = posicao.top > window.innerHeight + 80;
        if (saiuPorCima || saiuPorBaixo) {
            abrirCard(null);
        }
    });
}, { passive: true });


/* ============================================================
   7. APARECER AO ROLAR
   Os blocos listados abaixo começam invisíveis e "sobem" quando
   entram na tela. Para animar um bloco novo, coloque o seletor dele na lista.
   ============================================================ */
const BLOCOS_QUE_APARECEM = [
    ".titulo-secao",
    ".linha-servicos",
    ".secao-saude",
    ".secao-chamada-final",
    ".redes-sociais",
    ".rodape",
    ".faixa-especialidades"
];

const blocos = document.querySelectorAll(BLOCOS_QUE_APARECEM.join(","));

// Se o navegador for muito antigo e não tiver o "observador", simplesmente não anima
if ("IntersectionObserver" in window) {

    // O observador avisa quando um bloco entra na tela (12% visível)
    const observador = new IntersectionObserver(function (avisos) {
        avisos.forEach(function (aviso) {
            if (aviso.isIntersecting) {
                aviso.target.classList.add("revelado"); // toca a animação
                observador.unobserve(aviso.target); // só anima uma vez
            }
        });
    }, { threshold: 0.12 });

    blocos.forEach(function (bloco) {
        bloco.classList.add("revelar"); // esconde o bloco até ele aparecer
        observador.observe(bloco);
    });
}


/* ============================================================
   8. EFEITO DO MOUSE NO INÍCIO (só computador)
   Guarda a posição do mouse em duas variáveis CSS
   (--deslocamento-x e --deslocamento-y, valores de -1 a 1).
   O CSS usa essas variáveis para mexer um pouco na foto e no brilho.
   ============================================================ */
const secaoInicio = document.querySelector(".secao-inicio");
const temMouse = window.matchMedia("(hover: hover)").matches; // celular não tem

if (secaoInicio && temMouse) {

    secaoInicio.addEventListener("mousemove", function (evento) {
        const area = secaoInicio.getBoundingClientRect();
        // posição do mouse dentro do cartão, de -1 (esquerda/topo) a 1 (direita/baixo)
        const x = ((evento.clientX - area.left) / area.width - 0.5) * 2;
        const y = ((evento.clientY - area.top) / area.height - 0.5) * 2;
        secaoInicio.style.setProperty("--deslocamento-x", x);
        secaoInicio.style.setProperty("--deslocamento-y", y);
    });

    // Quando o mouse sai, tudo volta para o centro
    secaoInicio.addEventListener("mouseleave", function () {
        secaoInicio.style.setProperty("--deslocamento-x", 0);
        secaoInicio.style.setProperty("--deslocamento-y", 0);
    });
}
