
const formulario = document.getElementById("formulario");
const campoMensagem = document.getElementById("mensagem");
const areaMensagens = document.getElementById("mensagens");
const botaoEnviar = document.getElementById("botao-enviar");

// Adiciona uma mensagem na tela
function adicionarMensagem(texto, tipo) {
    const mensagem = document.createElement("div");
    mensagem.classList.add("message", `${tipo}-message`);

    const avatar = document.createElement("div");
    avatar.classList.add("message-avatar");
    avatar.textContent = tipo === "bot" ? "P" : "V";

    const conteudo = document.createElement("div");
    conteudo.classList.add("message-content");

    const paragrafo = document.createElement("p");
    paragrafo.textContent = texto;

    conteudo.appendChild(paragrafo);
    mensagem.appendChild(avatar);
    mensagem.appendChild(conteudo);

    areaMensagens.appendChild(mensagem);

    areaMensagens.scrollTop = areaMensagens.scrollHeight;

    return mensagem;
}

// Envia a mensagem ao servidor
formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const texto = campoMensagem.value.trim();

    if (!texto || botaoEnviar.disabled) return;

    adicionarMensagem(texto, "user");

    campoMensagem.value = "";
    botaoEnviar.disabled = true;
    campoMensagem.disabled = true;

    const carregamento = adicionarMensagem(
        "PyBot está pensando...",
        "bot"
    );

    try {
        const resposta = await fetch("/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mensagem: texto
            })
        });

        const dados = await resposta.json();

        carregamento.remove();

        if (!resposta.ok) {
            adicionarMensagem(
                dados.erro || "Ocorreu um erro.",
                "bot"
            );
        } else {
            adicionarMensagem(dados.resposta, "bot");
        }

    } catch (erro) {
        carregamento.remove();

        adicionarMensagem(
            "Não foi possível conectar ao servidor.",
            "bot"
        );

        console.error("Erro:", erro);

    } finally {
        botaoEnviar.disabled = false;
        campoMensagem.disabled = false;
        campoMensagem.focus();
    }
});
