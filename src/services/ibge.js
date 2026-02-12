export async function getEstados() {
  const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  if (!res.ok) throw new Error('Erro ao buscar estados');
  return res.json();
}

export async function getMunicipios(ufId) {
  const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufId}/municipios`);
  if (!res.ok) throw new Error('Erro ao buscar municípios');
  return res.json();
}