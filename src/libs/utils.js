export const N = "#0C1B33";
export const G = "#C9A84C";
export const GL = "#E2C87A";
export const BG = "#F8F7F4";
export const WH = "#FFF";
export const BD = "#E0DDD8";
export const BD2 = "#CCC9C2";
export const TX = "#2D3748";
export const T2 = "#6B7280";
export const T3 = "#9CA3AF";
export const GR = "#065F46";
export const RD = "#991B1B";
export const AM = "#B45309";
export const BL = "#1E40AF";
export const PU = "#5B21B6";

export const LS_SESS = "hub_circ_v3_sess";
export const LS_DES = "hub_circ_v3_designs";
export const LS_CAR = "hub_circ_v3_cartas";

export const LS = {
  get: (k) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : null;
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  },
  del: (k) => {
    try {
      localStorage.removeItem(k);
      return true;
    } catch {
      return false;
    }
  },
};

export const cleanNum = (s) => (s || "").replace(/\D/g, "");
export const fmtCNPJ = (s) => {
  const c = cleanNum(s).slice(0, 14);
  if (c.length <= 2) return c;
  if (c.length <= 5) return `${c.slice(0, 2)}.${c.slice(2)}`;
  if (c.length <= 8) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5)}`;
  if (c.length <= 12) return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8)}`;
  return `${c.slice(0, 2)}.${c.slice(2, 5)}.${c.slice(5, 8)}/${c.slice(8, 12)}-${c.slice(12)}`;
};
export const fmtCEP = (s) => {
  const c = cleanNum(s).slice(0, 8);
  return c.length > 5 ? `${c.slice(0, 5)}-${c.slice(5)}` : c;
};

const fetchTimeout = (url, ms = 8000) =>
  new Promise((res, rej) => {
    const ctrl = new AbortController();
    const id = setTimeout(() => {
      ctrl.abort();
      rej(new Error("timeout"));
    }, ms);
    fetch(url, { signal: ctrl.signal, mode: "cors", headers: { Accept: "application/json" } })
      .then((r) => {
        clearTimeout(id);
        res(r);
      })
      .catch((e) => {
        clearTimeout(id);
        rej(e);
      });
  });

export const apiCNPJ = async (cnpj) => {
  const c = cleanNum(cnpj);
  if (c.length !== 14) return null;
  try {
    const r = await fetchTimeout(`https://brasilapi.com.br/api/cnpj/v1/${c}`, 7000);
    if (r.ok) {
      const d = await r.json();
      if (d && d.cnpj) return d;
    }
  } catch {}
  try {
    const r = await fetchTimeout(`https://receitaws.com.br/v1/cnpj/${c}`, 7000);
    if (r.ok) {
      const d = await r.json();
      if (d && d.status !== "ERROR") {
        return {
          cnpj: c,
          razao_social: d.nome || "",
          nome_fantasia: d.fantasia || "",
          logradouro: `${d.logradouro || ""}${d.numero ? ", " + d.numero : ""}${d.complemento ? ", " + d.complemento : ""}`,
          municipio: d.municipio || "",
          uf: d.uf || "",
          cep: d.cep || "",
          email: d.email || "",
          telefone: d.telefone || "",
          situacao: d.situacao || "",
        };
      }
    }
  } catch {}
  return null;
};

export const apiCEP = async (cep) => {
  const c = cleanNum(cep);
  if (c.length !== 8) return null;
  try {
    const r = await fetchTimeout(`https://viacep.com.br/ws/${c}/json/`, 6000);
    if (!r.ok) return null;
    const d = await r.json();
    return d.erro ? null : d;
  } catch {
    return null;
  }
};

export const apiMX = async (email) => {
  const domain = (email || "").split("@")[1];
  if (!domain || !domain.includes(".")) return null;
  try {
    const r = await fetchTimeout(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, 5000);
    if (!r.ok) return null;
    const d = await r.json();
    return !!(d.Answer && d.Answer.length > 0);
  } catch {
    return null;
  }
};

export const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e || "");
export const today = () => new Date().toISOString().split("T")[0];
export const fd = (d) => {
  if (!d) return "__/__/____";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
};
export const ddiff = (a, b) => (!a || !b ? null : Math.round((new Date(b) - new Date(a)) / 86400000));