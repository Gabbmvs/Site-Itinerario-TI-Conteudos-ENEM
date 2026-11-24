
from flask import Flask, render_template, request, jsonify
from chatbot import responder

app = Flask(__name__)

# Página principal
@app.route("/")
def inicio():
    return render_template("index.html")

# Recebe mensagens do navegador
@app.route("/chat", methods=["POST"])
def chat():
    dados = request.get_json()

    mensagem = dados.get("mensagem", "").strip()

    if not mensagem:
        return jsonify({"erro": "Digite uma mensagem."}), 400

    try:
        resposta = responder(mensagem)
        return jsonify({"resposta": resposta})

    except Exception as erro:
        print("Erro:", erro)
        return jsonify({
            "erro": "Não foi possível obter uma resposta."
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
