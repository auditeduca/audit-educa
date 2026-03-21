// src/pages/circularizacao/components/Step7Destinatarios.jsx
import { useState } from "react";
import CNPJField from "./CNPJField";      // import padrão
import MXBadge from "./MXBadge";          // import padrão
import { emailOk } from "../../../libs/utils.js";
import FixedButtons from "./FixedButtons";

export default function Step7Destinatarios({
  recs,
  setRecs,
  rf,
  setRf,
  allowsValue,
  sTypes,
  genAll,
  onNext,
  onBack,
  showToast,
}) {
  const totalCartas = Math.max(recs.length, 1) * sTypes.length;

  const handleAdd = () => {
    if (!rf.nome || !rf.empresa) {
      showToast("⚠ Nome e Empresa são obrigatórios", "error");
      return;
    }
    if (rf.email && !emailOk(rf.email)) {
      showToast("⚠ Formato de e-mail inválido", "error");
      return;
    }
    if (rf.email && recs.some((r) => r.email.toLowerCase() === rf.email.toLowerCase())) {
      showToast(`⚠ E-mail "${rf.email}" já cadastrado`, "error");
      return;
    }
    setRecs([...recs, { ...rf, id: `m${Date.now()}` }]);
    setRf({ nome: "", empresa: "", email: "", saldo: "", end: "", cnpj: "" });
    showToast("Destinatário adicionado");
  };

  const remove = (id) => {
    setRecs(recs.filter((r) => r.id !== id));
    showToast("Destinatário removido");
  };

  const handleProceed = () => {
    genAll();
    onNext();
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-audit-navy dark:text-white mb-3">Adicionar Destinatário</h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="col-span-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800"
                placeholder="Nome do Responsável / Atenção de..."
                value={rf.nome}
                onChange={(e) => setRf({ ...rf, nome: e.target.value })}
              />
              <input
                className="col-span-2 p-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800"
                placeholder="Nome da Empresa / Instituição"
                value={rf.empresa}
                onChange={(e) => setRf({ ...rf, empresa: e.target.value })}
              />
              <CNPJField value={rf.cnpj} onChange={(v) => setRf({ ...rf, cnpj: v })} />
              <input
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800"
                placeholder="E-mail"
                value={rf.email}
                onChange={(e) => setRf({ ...rf, email: e.target.value })}
              />
              <input
                className="p-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800"
                placeholder="Endereço Completo (Opcional)"
                value={rf.end}
                onChange={(e) => setRf({ ...rf, end: e.target.value })}
              />
              {allowsValue && (
                <input
                  className="p-2 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800"
                  placeholder="Saldo p/ Confirmação"
                  value={rf.saldo}
                  onChange={(e) => setRf({ ...rf, saldo: e.target.value })}
                />
              )}
            </div>
            <button
              onClick={handleAdd}
              className="mt-3 w-full bg-audit-navy dark:bg-audit-gold dark:text-audit-navy text-white py-2 rounded-md hover:bg-opacity-90 text-sm font-medium"
            >
              + Adicionar à Lista
            </button>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-800/50">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                <tr>
                  <th className="p-3">Empresa / Contato</th>
                  <th className="p-3">E-mail</th>
                  {allowsValue && <th className="p-3 text-right">Saldo</th>}
                  <th className="p-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {recs.length === 0 ? (
                  <tr>
                    <td colSpan={allowsValue ? 4 : 3} className="p-8 text-center text-gray-400 dark:text-gray-500 italic">
                      Nenhum destinatário adicionado.
                    </td>
                  </tr>
                ) : (
                  recs.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-3">
                        <div className="font-medium text-audit-navy dark:text-white">{r.empresa}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{r.nome}</div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={emailOk(r.email) ? "" : "text-red-500 line-through"}>
                            {r.email || "—"}
                          </span>
                          {r.email && <MXBadge email={r.email} />}
                        </div>
                      </td>
                      {allowsValue && (
                        <td className="p-3 text-right font-mono text-audit-navy dark:text-white">
                          {r.saldo || "Circularização Aberta"}
                        </td>
                      )}
                      <td className="p-3 text-center">
                        <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-600">
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl">
            <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2">Resumo do Lote</h3>
            <div className="space-y-2 text-sm text-amber-900 dark:text-amber-200">
              <div className="flex justify-between">
                <span>Destinatários</span>
                <span className="font-bold">{recs.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Tipos de Resposta</span>
                <span className="font-bold">{sTypes.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total de Cartas</span>
                <span className="font-bold">{totalCartas}</span>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800/50">
            <h3 className="text-sm font-semibold text-audit-navy dark:text-white mb-2">💡 NBC TA 505</h3>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
              <li>Auditor controla envio e recepção, sem intermediação da entidade.</li>
              <li>Não resposta → procedimentos alternativos obrigatórios (§14).</li>
              <li>Negativa isolada não é adequada em risco elevado.</li>
              <li>Manter cartas originais como evidência de auditoria.</li>
            </ul>
          </div>
        </div>
      </div>

      <FixedButtons onBack={onBack} onNext={handleProceed} disabledNext={recs.length === 0} />
    </div>
  );
}