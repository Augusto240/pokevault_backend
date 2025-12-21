import google.generativeai as genai
from django.conf import settings
from django.db.models import Sum
from .models import Transacao
import os

def gerar_analise_tendencias():
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        return {"error": "API Key do Gemini não configurada."}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')

    ultimas_transacoes = Transacao.objects.select_related('item').order_by('-data_hora')[:50]
    
    dados_contexto = "Analise os seguintes dados de movimentação do PokéVault:\n"
    for t in ultimas_transacoes:
        dados_contexto += f"- {t.get_tipo_display()}: {t.quantidade}x {t.item.nome} em {t.data_hora}\n"

    prompt = f"""
    {dados_contexto}
    
    Com base nesses dados, forneça uma análise estratégica curta (máximo 3 parágrafos) para o Gerente do Centro de Distribuição Pokémon.
    Identifique itens com alta demanda (saída) e necessidades urgentes de reposição.
    Use tom profissional corporativo.
    """

    try:
        response = model.generate_content(prompt)
        return {"analise": response.text}
    except Exception as e:
        return {"error": str(e)}