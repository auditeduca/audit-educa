const Groq = require('groq-sdk');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Apenas POST permitido' });
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GROQ_API_KEY nao definida' });
    }

    const groq = new Groq({ apiKey });
    const { context, userMessage, documents } = req.body;
    
    if (!context || !userMessage) {
      return res.status(400).json({ error: 'Parametros obrigatorios ausentes' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: 'Voce eh o Revisor Senior Agentico do Laboratorio Auditeduca. Responda em formato JSON estruturado.' },
        { role: 'user', content: 'Contexto: ' + context + '\n\nMensagem: ' + userMessage + '\n\nDocumentos: ' + JSON.stringify(documents || []) }
      ],
      temperature: 0.2,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const responseText = completion.choices[0].message.content;
    if (!responseText) throw new Error('Resposta vazia');

    const result = JSON.parse(responseText);
    return res.status(200).json({ success: true, data: result, timestamp: new Date().toISOString() });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message, type: error.name });
  }
};
