// src/pages/circularizacao/hooks/useCircularization.js
import { useState, useCallback, useRef } from "react";
import {
  apiCNPJ,
  apiCEP,
  apiMX,
  emailOk,
  today,
  fd,
  ddiff,
  LS,
  LS_SESS,
  LS_CAR,
  LS_DES,
} from "../../../libs/utils.js";
import { TPLS, CTYPES, TCOLS, BANK_PRODS } from "../../../libs/letterTemplates.js";
import { DES_PRESETS } from "../../../libs/designPresets.js";

export function useCircularization() {
  // --- Navegação e Configuração ---
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("pt");
  const [mc, setMC] = useState(false);

  // --- Seleção de Template ---
  const [sTypes, setST] = useState([]);
  const [selTpl, setSelTpl] = useState({});
  const [customBody, setCustomBody] = useState({});
  const [bP, setBP] = useState({});

  // --- Dados da Firma ---
  const [empresas, setEmpresas] = useState([{ nome: "", cnpj: "" }]);
  const [firma, setFirma] = useState("");
  const [crc, setCrc] = useState("");
  const [tel, setTel] = useState("");
  const [cep, setCep] = useState("");
  const [fend, setFend] = useState("");
  const [fcid, setFcid] = useState("");
  const [fuf, setFuf] = useState("SP");
  const [femails, setFemails] = useState([{ email: "", nome: "" }]);

  // --- Datas e Referências ---
  const [db, setDb] = useState("");
  const [dem, setDem] = useState(today());
  const [dr, setDr] = useState("");
  const [num, setNum] = useState("");
  const [sign, setSign] = useState([{ nome: "", cargo: "", doc: "" }]);

  // --- Destinatários ---
  const [recs, setRecs] = useState([]);
  const [rf, setRf] = useState({
    nome: "",
    empresa: "",
    email: "",
    saldo: "",
    end: "",
    cnpj: "",
  });

  // --- Design ---
  const [designPreset, setDP] = useState("big4");
  const [accent, setAcc] = useState("#0C1B33");
  const [font, setFont] = useState("DM Sans");
  const [fs, setFs] = useState(12);
  const [lh, setLh] = useState(1.6);
  const [hs, setHs] = useState("solid");
  const [lpos, setLpos] = useState("left");
  const [lsz, setLsz] = useState(60);
  const [sTbl, setSTbl] = useState(true);
  const [conf, setConf] = useState(true);
  const [sNBC, setSNBC] = useState(true);
  const [logo, setLogo] = useState(null);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [savedCartas, setSavedCartas] = useState([]);

  // --- Geração e Exportação ---
  const [ltrs, setLtrs] = useState([]);
  const [ed, setEd] = useState({});
  const [ai, setAi] = useState(0);
  const [filterTipo, setFilterTipo] = useState("");

  const eRef = useRef(null);
  const allowsValue = sTypes.includes("clientes") || sTypes.includes("custom");

  // --- buildL (geração completa da carta) ---
  const buildL = useCallback(
    (type, rec) => {
      const tp = CTYPES[type] || CTYPES.custom;
      const cols = TCOLS[type] || TCOLS.custom;
      const isCC = type === "clientes" || type === "custom";
      const tplId = selTpl[type];
      const tpl = TPLS.find((t) => t.id === tplId) || TPLS.find((t) => t.tipo === type) || TPLS[0];
      const bfn = tpl.body[lang] || tpl.body.pt;

      // Produtos bancários
      const spn = type === "bancos" ? Object.entries(bP).filter(([, v]) => v).map(([k]) => {
        for (const [, ps] of Object.entries(BANK_PRODS)) {
          const p = ps.find((x) => x.id === k);
          if (p) return `<li style="margin-bottom:3px"><b>${p.l}</b>: <em style="color:${accent}">${p.f}</em></li>`;
        }
        return "";
      }).filter(Boolean).join("") : "";
      const ph = spn ? `<ul style="margin:10px 0;padding-left:18px;font-size:${fs - 1}px">${spn}</ul>` : "";

      const entNames = empresas.filter((e) => e.nome).map((e) => e.nome).join(" e ");
      const entFull = empresas.filter((e) => e.nome).map((e) => `<strong>${e.nome}</strong>${e.cnpj ? ` (CNPJ: ${e.cnpj})` : ""}`).join(" · ");
      const showV = isCC && rec.saldo;
      const d = { ent: entNames || "[Empresa Auditada]", db: fd(db), dr: fd(dr), mc, saldo: showV ? rec.saldo : "" };
      const bt = customBody[type] || (typeof bfn === "function" ? bfn(d, ph) : bfn);

      const hStyle = hs === "gradient" ? `background:linear-gradient(90deg, ${accent}, #E2C87A)` : hs === "double" ? `height:6px;border-top:3px solid ${accent};border-bottom:1px solid ${accent};background:transparent` : hs === "none" ? `display:none` : `background:${accent}`;
      const hMar = hs === "none" ? "0" : "16px";

      // Tabela de detalhamento
      const tbody = [0, 1, 2].map((i) => {
        let rHtml = cols.map((c, idx) => {
          if (idx === 0) return `<td style="padding:6px 9px;border-bottom:1px solid #E0DDD8;width:30%">${i === 0 ? rec.nome || "" : " "}${" "}</td>`;
          if (idx === 1 && (c.includes("CNPJ") || c.includes("Descrição"))) return `<td style="padding:6px 9px;border-bottom:1px solid #E0DDD8;width:20%">${i === 0 ? rec.cnpj || "" : " "}${" "}</td>`;
          if (i === 0 && showV) {
            if (idx === 4 && type === "clientes") return `<td style="padding:6px 9px;border-bottom:1px solid #E0DDD8">${rec.saldo}</td>`;
            if (idx === 2 && type === "custom") return `<td style="padding:6px 9px;border-bottom:1px solid #E0DDD8">${rec.saldo}</td>`;
          }
          return `<td style="padding:6px 9px;border-bottom:1px solid #E0DDD8">  </td>`;
        }).join("");
        return `<tr style="background:${i % 2 ? "#f9f8f5" : "#FFF"}">${rHtml}</tr>`;
      }).join("");

      const tH = sTbl
        ? `<table style="width:100%;border-collapse:collapse;font-size:${fs - 1}px;margin:16px 0"><thead><tr>${cols
            .map(
              (c) =>
                `<th style="background:${accent};color:white;text-align:left;padding:6px 9px;font-size:${fs - 2}px;font-weight:700;white-space:nowrap">${c}</th>`
            )
            .join("")}</tr></thead><tbody>${tbody}</tbody></table>`
        : "";

      const ae = femails.filter((e) => e.email).map((e) => (e.nome ? `${e.nome} &lt;${e.email}&gt;` : e.email)).join(" | ");
      const sH = sign
        .filter((s) => s.nome)
        .map(
          (s) =>
            `<div style="display:inline-block;min-width:180px;margin-right:24px;vertical-align:top;margin-top:16px">
               <div style="height:1px;background:#CCC9C2;margin-bottom:8px;width:80%"></div>
               <div style="font-weight:700;color:#2D3748">${s.nome}</div>
               <div style="font-size:${fs - 1}px;color:#6B7280">${s.cargo || ""}</div>
               ${s.doc ? `<div style="font-size:${fs - 2}px;color:#9CA3AF">${s.doc}</div>` : ""}
             </div>`
        )
        .join("");

      return `<div data-section="carta" style="font-family:'${font}',sans-serif;font-size:${fs}px;line-height:${lh};color:#2D3748;box-sizing:border-box;width:100%">
        ${conf ? `<div data-section="confidencial" style="display:inline-block;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#991B1B;border:1px solid #991B1B;padding:2px 8px;border-radius:2px;margin-bottom:14px">CONFIDENCIAL — Uso exclusivo de auditoria independente</div><br>` : ""}
        <div data-section="logo" style="display:flex;justify-content:${lpos === "center" ? "center" : lpos === "right" ? "flex-end" : "flex-start"};margin-bottom:12px">
          ${logo ? `<img src="${logo}" style="height:${lsz}px;width:auto;object-fit:contain" alt="">` : `<div style="width:90px;height:36px;background:#F8F7F4;border:1px dashed #CCC9C2;display:flex;align-items:center;justify-content:center;font-size:9px;color:#9CA3AF">Logomarca</div>`}
        </div>
        <div data-section="header-line" style="height:3px;margin-bottom:${hMar};${hStyle}"></div>
        <div data-section="firma" style="font-size:${fs - 1}px;color:#6B7280;margin-bottom:14px;line-height:1.8">
          <strong style="color:#2D3748;font-size:${fs}px">${firma || "[Firma Auditora]"}</strong><br>
          ${fend || "[Endereço]"}${fcid ? `, ${fcid} — ${fuf}` : ""}<br>
          ${tel ? `Tel.: ${tel} · ` : ""}${ae ? `E-mail: <strong>${ae}</strong>` : ""}${crc ? `<br>CRC: ${crc}` : ""}
        </div>
        <div data-section="data-ref" style="display:flex;justify-content:space-between;margin-bottom:14px;font-size:${fs - 1}px;color:#6B7280">
          <span>${fcid || "[Cidade]"}, ${fd(dem)}</span>
          ${num ? `<span style="font-family:monospace;font-size:${fs - 2}px;color:#9CA3AF;background:#F8F7F4;padding:2px 8px;border-radius:2px">Ref: ${num}</span>` : ""}
        </div>
        <div data-section="destinatario" style="margin-bottom:16px;padding:12px 16px;background:#F8F7F4;border-left:3px solid #CCC9C2;border-radius:4px;line-height:1.8">
          <strong>À</strong><br>
          ${rec.nome ? `A/C: <strong>${rec.nome}</strong><br>` : ""}
          <strong>${rec.empresa || "[Destinatário]"}</strong><br>
          ${rec.cnpj ? `CNPJ: ${rec.cnpj}<br>` : ""}
          ${rec.end || "[Endereço do destinatário]"}
        </div>
        <div data-section="assunto" style="background:${accent}18;border-left:4px solid ${accent};padding:10px 16px;font-weight:700;color:#2D3748;margin-bottom:12px">
          Assunto: Confirmação Externa — ${tp.l} — Data-base: ${fd(db) || "__/__/____"}
        </div>
        ${sNBC ? `<div data-section="norma" style="font-size:${fs - 2}px;color:#9CA3AF;font-style:italic;margin-bottom:12px">Procedimento em conformidade com ${tp.norm} · Empresas auditadas: ${entFull || "[Empresa]"}</div>` : ""}
        <p data-section="saudacao" style="margin:14px 0 8px">Prezado(a) Senhor(a),</p>
        <div data-section="corpo" style="font-weight:300;line-height:${lh}">${bt}</div>
        ${tH}
        <div data-section="instrucoes" style="margin-top:14px;font-size:${fs - 1}px;color:#6B7280;padding:10px 14px;background:#F8F7F4;border-radius:4px;border-left:3px solid ${accent}">
          ⚠ <b>Atenção:</b> Responda <b>diretamente ao auditor independente</b>, sem intermediação da empresa auditada, para: <strong>${femails.filter(e => e.email).map(e => e.email).join("; ") || "[email@firma.com.br]"}</strong><br>
          Prazo: <strong>${fd(dr) || "__/__/____"}</strong>. A não resposta implica procedimentos alternativos (NBC TA 505 §14).
        </div>
        <div data-section="assinatura" style="margin-top:28px;padding-top:16px;border-top:1px solid #E0DDD8">
          <p style="margin-bottom:4px;color:#6B7280">${{ pt: "Atenciosamente,", es: "Atentamente,", en: "Yours faithfully," }[lang]}</p>
          ${sH || `<div style="margin-top:16px;font-weight:700;color:#2D3748">[Representante da Empresa]</div><div style="font-size:${fs - 1}px;color:#6B7280">[Cargo]</div>`}
        </div>
      </div>`;
    },
    [accent, font, fs, lh, hs, logo, lpos, lsz, sTbl, conf, sNBC, firma, crc, fend, fcid, fuf, tel, femails, empresas, db, dem, dr, num, sign, bP, lang, mc, selTpl, customBody]
  );

  // --- genAll (geração em lote) ---
  const genAll = useCallback(() => {
    if (recs.length === 0) return;
    const all = recs.flatMap((r) =>
      sTypes.map((tp) => ({
        ...r,
        id: `${r.id || Date.now()}-${tp}`,
        tipo: tp,
        html: buildL(tp, r),
      }))
    );
    setLtrs(all);
    setEd({});
    setAi(0);
    setFilterTipo(null);
  }, [recs, sTypes, buildL]);

  // --- Exportadores (stubs) ---
  const xWordLote = () => console.log("Word lote");
  const xWordSingle = (html, nm) => console.log("Word single", nm);
  const xExcelLote = () => console.log("Excel lote");
  const xPrintAll = () => window.print();
  const xControl = () => console.log("Controle");

  return {
    step,
    setStep,
    lang,
    setLang,
    mc,
    setMC,
    sTypes,
    setST,
    selTpl,
    setSelTpl,
    customBody,
    setCustomBody,
    bP,
    setBP,
    empresas,
    setEmpresas,
    firma,
    setFirma,
    crc,
    setCrc,
    tel,
    setTel,
    cep,
    setCep,
    fend,
    setFend,
    fcid,
    setFcid,
    fuf,
    setFuf,
    femails,
    setFemails,
    db,
    setDb,
    dem,
    setDem,
    dr,
    setDr,
    num,
    setNum,
    sign,
    setSign,
    recs,
    setRecs,
    rf,
    setRf,
    ltrs,
    ed,
    setEd,
    ai,
    setAi,
    filterTipo,
    setFilterTipo,
    allowsValue,
    genAll,
    xWordLote,
    xWordSingle,
    xExcelLote,
    xPrintAll,
    xControl,
    buildL,
    eRef,
  };
}