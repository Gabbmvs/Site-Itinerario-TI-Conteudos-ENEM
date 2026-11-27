
let indiceAtual = 0;
let intervaloCarrossel;

const TEMPO_CARROSSEL = 3000;

// Mostra o slide selecionado
function mostrarImagem(indice) {
    const imagens = document.querySelectorAll(".slide");
    const pontos = document.querySelectorAll(".ponto");

    if (imagens.length === 0) return;

    // Remove a classe ativo e pausa vídeos anteriores
    imagens.forEach(imagem => {
        imagem.classList.remove("ativo");

        const video = imagem.querySelector("video");

        if (video) {
            video.pause();
        }
    });

    // Remove a seleção dos indicadores
    pontos.forEach(ponto => {
        ponto.classList.remove("ativo");
    });

    // Atualiza o índice
    indiceAtual = indice;

    // Ativa o slide atual
    imagens[indiceAtual].classList.add("ativo");

    // Ativa o indicador correspondente
    if (pontos[indiceAtual]) {
        pontos[indiceAtual].classList.add("ativo");
    }

    // Reinicia a contagem de 3 segundos
    iniciarCarrossel();
}

// Avança ou volta um slide
function mudarImagem(direcao) {
    const imagens = document.querySelectorAll(".slide");

    indiceAtual += direcao;

    // Volta para o primeiro slide
    if (indiceAtual >= imagens.length) {
        indiceAtual = 0;
    }

    // Vai para o último slide
    if (indiceAtual < 0) {
        indiceAtual = imagens.length - 1;
    }

    mostrarImagem(indiceAtual);
}

// Permite clicar nos indicadores
function irParaImagem(indice) {
    mostrarImagem(indice);
}

// Inicia a passagem automática
function iniciarCarrossel() {
    pararCarrossel();

    intervaloCarrossel = setInterval(() => {
        mudarImagem(1);
    }, TEMPO_CARROSSEL);
}

// Para a passagem automática
function pararCarrossel() {
    clearInterval(intervaloCarrossel);
}

// Configura os vídeos
document.querySelectorAll(".slide video").forEach(video => {

    // Pausa o carrossel quando o vídeo começa
    video.addEventListener("play", () => {
        pararCarrossel();
    });

    // Quando o vídeo termina
    video.addEventListener("ended", () => {
        video.pause();
        video.currentTime = 0;
        video.load();

        // Continua o carrossel após 3 segundos
        iniciarCarrossel();
    });

});

// Inicia o carrossel na primeira imagem
mostrarImagem(0);
