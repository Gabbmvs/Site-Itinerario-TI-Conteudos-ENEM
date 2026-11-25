import json
import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
RANKING_FILE = "ranking.json"


def carregar_ranking():
    if not os.path.exists(RANKING_FILE):
        return []
    with open(RANKING_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []


def salvar_ranking(dados):
    with open(RANKING_FILE, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/ranking", methods=["GET"])
def get_ranking():
    ranking = carregar_ranking()
    ranking_ordenado = sorted(ranking, key=lambda x: x["pontos"], reverse=True)[:10]
    return jsonify(ranking_ordenado)


@app.route("/api/ranking", methods=["POST"])
def post_ranking():
    body = request.get_json(silent=True) or {}
    nome = str(body.get("nome", "Anônimo")).strip()[:15] or "Anônimo"
    pontos = body.get("pontos", 0)

    if not isinstance(pontos, int) or pontos < 0 or pontos > 999999:
        return jsonify({"erro": "Pontuação inválida"}), 400

    ranking = carregar_ranking()
    ranking.append({"nome": nome, "pontos": pontos})
    ranking_ordenado = sorted(ranking, key=lambda x: x["pontos"], reverse=True)[:10]
    salvar_ranking(ranking_ordenado)

    return jsonify(ranking_ordenado), 201


if __name__ == "__main__":
    app.run(debug=True)