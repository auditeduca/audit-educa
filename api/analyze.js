import { Groq } from 'groq-sdk';

/**
 * AGENTE DE AUDITORIA COM LOGS DE DEPURAÇÃO
 * Este arquivo deve estar em /api/analyze.js
 */

export default async function handler(req, res) {
    // Configurações de CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') return res.status(200).end();

    // 1. Verificação de Segurança da Chave
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
        console.error("[ERRO CRÍTICO] GROQ_API_KEY não encontrada nas variáveis de ambiente da Vercel.");
        return res.status(500).json({ 
            error: "Configuração incompleta", 
            details: "A chave de API do Groq não foi configurada no painel da Vercel." 
        });
    }

    const groq = new Groq({ apiKey });

    try {
        const { context, documents, userMessage } = req.body;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Você é um Auditor Sênior Agêntico. Responda APENAS em JSON."
                },
                {
                    role: "user",
                    content: `Contexto: ${context}. Mensagem: ${userMessage}`
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.2,
        });

        const result = JSON.parse(completion.choices[0].message.content);
        return res.status(200).json(result);

    } catch (error) {
        console.error("[ERRO NA API GROQ]:", error.message);
        
        // Trata especificamente o erro de limite de cota ou chave inválida
        if (error.status === 401) {
            return res.status(500).json({ error: "Chave de API inválida." });
        }

        return res.status(500).json({ 
            error: "Falha no processamento agêntico", 
            details: error.message 
        });
    }
}