
import os
import time

from dotenv import load_dotenv
from google import genai

# Carrega as configurações
load_dotenv()

# Obtém a chave da API
CHAVE_API = os.getenv("GEMINI_API_KEY")

if not CHAVE_API:
    raise ValueError("Chave da API não encontrada no arquivo .env")

# Inicializa o cliente
cliente = genai.Client(api_key=CHAVE_API)

# Instruções do PyBot
INSTRUCOES = """
Você é o PyBot, um assistente virtual inteligente.

- Responda em português brasileiro.
- Seja educado e comunicativo.
- Explique assuntos de forma clara.
- Ajude com programação, tecnologia e estudos.
- Utilize exemplos quando necessário.
- Evite respostas excessivamente longas.
"""

# Função principal
def responder(mensagem):
    inicio = time.perf_counter()

    try:
        print("PyBot está consultando o Gemini...")

        resposta = cliente.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=mensagem,
            config={
                "system_instruction": INSTRUCOES,
                "temperature": 0.7,
                "max_output_tokens": 300
            }
        )

        tempo = time.perf_counter() - inicio

        print(f"Tempo de resposta: {tempo:.2f} segundos")

        return resposta.text

    except Exception as erro:
        print(f"Erro na comunicação com Gemini: {erro}")
        return "Não consegui responder neste momento. Tente novamente."
