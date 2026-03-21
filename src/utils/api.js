export async function sendSuggestion(data) {
  const response = await fetch('/api/sugestoes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': window.csrfToken || '',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erro ao enviar');
  }

  return response.json();
}