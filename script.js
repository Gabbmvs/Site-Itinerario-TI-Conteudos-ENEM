let indiceAtual = 0;

function mostrarImagem(indice) {

    const imagens = document.querySelectorAll(".slide");
    const pontos = document.querySelectorAll(".ponto");

    // Remove a classe ativo de todos os elementos
    imagens.forEach(imagem => {
        imagem.classList.remove("ativo");
    });

    pontos.forEach(ponto => {
        ponto.classList.remove("ativo");
    });

    // Atualiza o índice
    indiceAtual = indice;

    // Ativa a imagem e o indicador correspondente
    imagens[indiceAtual].classList.add("ativo");
    pontos[indiceAtual].classList.add("ativo");
}

// Avança ou volta uma imagem
function mudarImagem(direcao) {

    const imagens = document.querySelectorAll(".slide");

    indiceAtual += direcao;

    // Volta para a primeira imagem
    if (indiceAtual >= imagens.length) {
        indiceAtual = 0;
    }

    // Vai para a última imagem
    if (indiceAtual < 0) {
        indiceAtual = imagens.length - 1;
    }

    mostrarImagem(indiceAtual);
}

// Permite clicar nos indicadores
function irParaImagem(indice) {
    mostrarImagem(indice);
}