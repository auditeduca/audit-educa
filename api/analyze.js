/**
 * AUDITEDUCA - ANALYZE ENGINE (VERCEL SERVERLESS)
 * Versão: 1.0.2 - Fix CommonJS + Groq SDK
 * Caminho: /api/analyze.js (raiz do repo)
 */

const Groq = require('groq-sdk').default || require('groq-sdk');

// Handler principal
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.VERCEL_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Validar método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas POST permitido' });
  }

  try {
    // Validar chave
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('❌ GROQ_API_KEY não encontrada');
      return res.status(500).json({
        error: 'Configuração ausente',
        details: 'GROQ_API_KEY não definida na Vercel'
      });
    }

    // Inicializar Groq
    const groq = new Groq({ apiKey });

    // Validar request
    const { context, userMessage, documents } = req.body;
    if (!context || !userMessage) {
      return res.status(400).json({
        error: 'Parâmetros obrigatórios ausentes',
        required: ['context', 'userMessage']
      });
    }

    // System prompt
    const systemPrompt = `Você é o Revisor Sênior Agêntico do Laboratório Auditeduca.
Especialista em auditoria externa (CPC/IFRS).

DIRETRIZES:
1. Identifique riscos de distorção relevante.
2. Mantenha o padrão Navy & Gold de excelência.
3. Responda APENAS em JSON estruturado com fields: analysis, risks, recommendations.`;

    // Chamar Groq
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Contexto: ${context}\n\nMensagem: ${userMessage}\n\nDocumentos: ${JSON.stringify(documents || [])}`
        }
      ],
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    // Parse resposta
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('Resposta vazia do Groq');
    }

    const result = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('🔴 ERRO AUDITEDUCA:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Falha no processamento',
      type: error.name,
      // Remove em produção:
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};