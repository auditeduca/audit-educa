import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
  // Habilitar CORS para o seu frontend Vite
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { context, documents, userMessage } = req.body;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é o Auditor Agêntico do Laboratório Auditeduca. 
          Sua missão é analisar evidências e confrontar o aluno.
          Regra: Responda APENAS em JSON estruturado.
          Formato: { "status": "string", "analise": "string", "pergunta_desafio": "string", "score_ceticismo": number }`
        },
        {
          role: "user",
          content: `Contexto: ${context}. Docs: ${JSON.stringify(documents)}. Aluno diz: ${userMessage}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2, // Rigor técnico alto
      response_format: { type: "json_object" }
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
    
    // Retorna para o Frontend
    return res.status(200).json(aiResponse);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Falha no processamento da IA' });
  }
}