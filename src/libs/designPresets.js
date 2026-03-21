import { N, GR } from "./utils";

export const DES_PRESETS = [
  {
    id: "big4",
    nome: "Padrão Institucional",
    desc: "Sóbrio, direto — estilo Big4.",
    icon: "🏢",
    props: { font: "DM Sans", accent: N, hs: "solid", lpos: "left", fs: 12, lh: 1.6 },
  },
  {
    id: "classic",
    nome: "Clássico Auditoria",
    desc: "Elegante, serifado, tradicional.",
    icon: "🏛️",
    props: { font: "Playfair Display", accent: "#7A5C10", hs: "double", lpos: "center", fs: 13, lh: 1.7 },
  },
  {
    id: "modern",
    nome: "Moderno Tech",
    desc: "Clean com gradiente sutil.",
    icon: "✨",
    props: { font: "Inter", accent: GR, hs: "gradient", lpos: "left", fs: 11, lh: 1.8 },
  },
  {
    id: "minimal",
    nome: "Minimalista",
    desc: "Foco no conteúdo, sem linhas.",
    icon: "📝",
    props: { font: "Lato", accent: "#374151", hs: "none", lpos: "right", fs: 12, lh: 1.55 },
  },
  {
    id: "custom",
    nome: "Personalizado",
    desc: "Definição manual — suas escolhas.",
    icon: "⚙️",
    props: null,
  },
];