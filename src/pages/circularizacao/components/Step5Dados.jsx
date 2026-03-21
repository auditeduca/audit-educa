// src/pages/circularizacao/components/Step5Dados.jsx
import React, { useState, useEffect } from "react";
import CNPJField from "./CNPJField";   // import padrão
import CEPField from "./CEPField";     // import padrão
import MXBadge from "./MXBadge";       // import padrão
import FixedButtons from "./FixedButtons";
import { Building, MapPin, UserCircle, Plus, Trash2, Calendar, Briefcase, ChevronDown, ChevronUp } from "lucide-react";

const COLLAPSED_KEY = 'collapsedSections';

export default function Step5Dados({
  empresas, setEmpresas,
  firma, setFirma,
  crc, setCrc,
  tel, setTel,
  cep, setCep,
  fend, setFend,
  fcid, setFcid,
  fuf, setFuf,
  femails, setFemails,
  db, setDb,
  dr, setDr,
  sign, setSign,
  onNext, onBack
}) {
  const [collapsed, setCollapsed] = useState({
    entidades: false,
    datas: false,
    auditoria: false,
    signatarios: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved) {
      try {
        setCollapsed(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addEmpresa = () => setEmpresas([...empresas, { nome: "", cnpj: "" }]);
  const removeEmpresa = (idx) => setEmpresas(empresas.filter((_, i) => i !== idx));
  const updateEmpresa = (idx, key, val) => {
    const list = [...empresas];
    list[idx][key] = val;
    setEmpresas(list);
  };

  const addSignatario = () => setSign([...sign, { nome: "", cargo: "", doc: "" }]);
  const removeSignatario = (idx) => setSign(sign.filter((_, i) => i !== idx));
  const updateSignatario = (idx, key, val) => {
    const list = [...sign];
    list[idx][key] = val;
    setSign(list);
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-audit-navy/40 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-audit-gold focus:border-transparent outline-none transition-all dark:text-white placeholder:text-gray-400";
  const labelClass = "block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 ml-1";

  return (
    <div className="space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Coluna Esquerda */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-audit-navy/50 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('entidades')}>
              <h3 className="text-xl font-bold text-audit-navy dark:text-white flex items-center gap-3">
                <Building className="text-audit-gold" />
                Entidades Auditadas
              </h3>
              {collapsed.entidades ? <ChevronDown /> : <ChevronUp />}
            </div>
            {!collapsed.entidades && (
              <div className="mt-6 space-y-4">
                {empresas.map((emp, i) => (
                  <div key={i} className="relative p-5 border border-gray-100 dark:border-gray-800 rounded-2xl bg-gray-50/50 dark:bg-audit-navy/20 group">
                    {i > 0 && (
                      <button onClick={() => removeEmpresa(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className={labelClass}>Nome/Razão Social</label>
                        <input className={inputClass} value={emp.nome} onChange={e => updateEmpresa(i, 'nome', e.target.value)} placeholder="Ex: Minha Empresa Ltda" />
                      </div>
                      <div>
                        <label className={labelClass}>CNPJ</label>
                        <CNPJField value={emp.cnpj} onChange={val => updateEmpresa(i, 'cnpj', val)} className={inputClass} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addEmpresa} className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 hover:text-audit-gold hover:border-audit-gold transition-all flex items-center justify-center gap-2 font-bold">
                  <Plus size={20} /> Adicionar Entidade
                </button>
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-audit-navy/50 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('datas')}>
              <h3 className="text-xl font-bold text-audit-navy dark:text-white flex items-center gap-3">
                <Calendar className="text-audit-gold" />
                Datas Importantes
              </h3>
              {collapsed.datas ? <ChevronDown /> : <ChevronUp />}
            </div>
            {!collapsed.datas && (
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Data-Base</label>
                  <input type="date" className={inputClass} value={db} onChange={e => setDb(e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>Prazo Resposta</label>
                  <input type="date" className={inputClass} value={dr} onChange={e => setDr(e.target.value)} />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-8">
          <section className="bg-white dark:bg-audit-navy/50 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('auditoria')}>
              <h3 className="text-xl font-bold text-audit-navy dark:text-white flex items-center gap-3">
                <Briefcase className="text-audit-gold" />
                Dados da Auditoria
              </h3>
              {collapsed.auditoria ? <ChevronDown /> : <ChevronUp />}
            </div>
            {!collapsed.auditoria && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Nome da Firma</label>
                    <input className={inputClass} value={firma} onChange={e => setFirma(e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>CRC/Registro</label>
                    <input className={inputClass} value={crc} onChange={e => setCrc(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>CEP</label>
                    <CEPField value={cep} onChange={setCep} onAddress={setFend} onCity={setFcid} onUF={setFuf} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Telefone</label>
                    <input className={inputClass} value={tel} onChange={e => setTel(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>E-mails para Cópia (Auditoria)</label>
                  <div className="relative">
                    <input className={inputClass} value={femails} onChange={e => setFemails(e.target.value)} placeholder="separados por ponto e vírgula" />
                    <div className="absolute right-3 top-3">
                      <MXBadge email={femails?.split(';')[0]} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-white dark:bg-audit-navy/50 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleSection('signatarios')}>
              <h3 className="text-xl font-bold text-audit-navy dark:text-white flex items-center gap-3">
                <UserCircle className="text-audit-gold" />
                Signatários (Cliente)
              </h3>
              {collapsed.signatarios ? <ChevronDown /> : <ChevronUp />}
            </div>
            {!collapsed.signatarios && (
              <div className="mt-6 space-y-4">
                {sign.map((s, i) => (
                  <div key={i} className="p-5 bg-gray-50/50 dark:bg-audit-navy/20 rounded-2xl relative border border-gray-100 dark:border-gray-800">
                    {i > 0 && (
                      <button onClick={() => removeSignatario(i)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    )}
                    <div className="space-y-3">
                      <input className={inputClass} placeholder="Nome Completo" value={s.nome} onChange={e => updateSignatario(i, 'nome', e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        <input className={inputClass} placeholder="Cargo" value={s.cargo} onChange={e => updateSignatario(i, 'cargo', e.target.value)} />
                        <input className={inputClass} placeholder="Doc/CPF (Opcional)" value={s.doc} onChange={e => updateSignatario(i, 'doc', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={addSignatario} className="text-sm font-bold text-audit-gold hover:underline flex items-center gap-1 mx-auto py-2">
                  <Plus size={16} /> Adicionar outro signatário
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      <FixedButtons onBack={onBack} onNext={onNext} />
    </div>
  );
}