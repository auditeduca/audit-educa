import { useState } from 'react';

export const useAgent = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const askAgent = async (userMessage, currentContext, docs) => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: currentContext,
          documents: docs,
          userMessage: userMessage
        }),
      });

      const data = await response.json();
      setReport(data);
      return data;
    } catch (error) {
      console.error("Erro ao consultar o agente:", error);
    } finally {
      setLoading(false);
    }
  };

  return { askAgent, report, loading };
};