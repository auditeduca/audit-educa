export async function buscarInstituicoes(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const base = [
        "Polícia Federal (PF)", "Polícia Rodoviária Federal (PRF)", "Tribunal de Justiça (TJ)",
        "Ministério Público (MP)", "Receita Federal do Brasil (RFB)", "INSS",
        "Caixa Econômica Federal", "Banco do Brasil", "Prefeitura Municipal",
        "Governo do Estado", "Secretaria de Educação", "Secretaria de Saúde",
        "Universidade de São Paulo (USP)", "Universidade Estadual de Campinas (UNICAMP)",
        "Universidade Federal do Rio de Janeiro (UFRJ)", "Instituto Tecnológico de Aeronáutica (ITA)",
        "Instituto Militar de Engenharia (IME)"
      ];
      if (!query.trim()) return resolve([]);
      const filtered = base.filter(inst => inst.toLowerCase().includes(query.toLowerCase()));
      resolve(filtered);
    }, 400);
  });
}