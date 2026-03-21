import { Groq } from 'groq-sdk';

/**
 * BACKEND DO AUDITEDUCA - SERVERLESS FUNCTION
 * Este arquivo processa as requisições de auditoria usando o Llama 3.3 via Groq.
 */

export default async function handler(req, res) {
  // Configuração de CORS para permitir chamadas do Frontend na Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { context, userMessage } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ 
      analise: "ERRO DE CONFIGURAÇÃO: A chave GROQ_API_KEY não foi encontrada no ambiente da Vercel.",
      pergunta_socrata: "Por favor, verifique as variáveis de ambiente no painel da Vercel."
    });
  }

  const groq = new Groq({ apiKey });

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é o Auditor Sênior do Laboratório Auditeduca. 
          Seu objetivo é desafiar o aluno a pensar com ceticismo profissional sobre casos de auditoria (Cut-off, Estoques, etc).
          Diretrizes:
          1. Nunca dê a resposta de bandeja.
          2. Use referências a normas (CPC/IFRS).
          3. Avalie o ceticismo do aluno de 0 a 100.
          
          Responda OBRIGATORIAMENTE em JSON:
          { "analise": "string", "ceticismo_score": number, "pergunta_socrata": "string" }`
        },
        {
          role: "user",
          content: `Caso Atual: ${context}. Mensagem do Aluno: ${userMessage}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    return res.status(200).json(result);

  } catch (error) {
    console.error("Erro no processamento da IA:", error);
    return res.status(500).json({ 
      analise: "Ocorreu um erro no motor de raciocínio FinLLM.",
      pergunta_socrata: "Você poderia tentar reformular sua dúvida técnica?"
    });
  }
}