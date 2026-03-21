/**
 * AUDITEDUCA - ANALYZE ENGINE (VERCEL SERVERLESS)
 * Versão: 1.0.1 - Gatilho de Redeploy Automático
 * Este arquivo deve ser salvo em: C:\GitHub\audit-educa\api\analyze.js
 */

import Groq from 'groq-sdk';

// Inicialização segura da Groq
const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("ERRO DE CONFIGURAÇÃO: A variável GROQ_API_KEY não foi encontrada no ambiente da Vercel.");
  }
  return new Groq({ apiKey });
};

export default async function handler(req, res) {
  // 1. Configuração de CORS para permitir que o seu frontend fale com a API
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido. Use POST." });
  }

  try {
    const { context, userMessage, documents } = req.body;
    const groq = getGroqClient();

    const systemPrompt = `
      Você é o Revisor Sênior Agêntico do Laboratório Auditeduca.
      Especialista em auditoria externa (CPC/IFRS).
      
      DIRETRIZES:
      1. Identifique riscos de distorção relevante.
      2. Mantenha o padrão Navy & Gold de excelência.
      3. Responda APENAS em JSON estruturado.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Caso: ${context}. Mensagem: ${userMessage}. Docs: ${JSON.stringify(documents || [])}` }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content);
    
    // Retorno de sucesso
    return res.status(200).json(result);

  } catch (error) {
    console.error("LOG DE ERRO AUDITEDUCA:", error.message);
    
    // Retorno detalhado para ajudar no Debug
    return res.status(500).json({ 
      error: "Falha no processamento da IA", 
      details: error.message,
      tip: "A chave GROQ_API_KEY pode estar ausente ou o build atual ainda não a reconheceu."
    });
  }
}