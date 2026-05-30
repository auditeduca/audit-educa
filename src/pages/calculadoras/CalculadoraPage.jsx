import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { runCalculator, formatValue } from '../../core/calc-engine';

import jurosSimples from '../../../content/calculators/juros-simples.json';
import jurosCompostos from '../../../content/calculators/juros-compostos.json';
import desconto from '../../../content/calculators/desconto.json';
import salarioLiquido from '../../../content/calculators/salario-liquido.json';
import ferias from '../../../content/calculators/ferias.json';

const CALC_MAP = {
  'content/calculators/juros-simples.json': jurosSimples,
  'content/calculators/juros-compostos.json': jurosCompostos,
  'content/calculators/desconto.json': desconto,
  'content/calculators/salario-liquido.json': salarioLiquido,
  'content/calculators/ferias.json': ferias,
};

export default function CalculadoraPage({ contentFile }) {
  const config = CALC_MAP[contentFile];
  const [inputs, setInputs] = useState(() => {
    if (!config) return {};
    return Object.fromEntries(config.inputs.map((i) => [i.id, i.default ?? 0]));
  });

  const results = useMemo(() => {
    if (!config) return {};
    return runCalculator(config.formulaType, inputs);
  }, [config, inputs]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Calculadora não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-10">
        <nav className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          <Link to="/" className="hover:text-audit-gold">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/calculadoras" className="hover:text-audit-gold">Calculadoras</Link>
          <span className="mx-2">/</span>
          <span className="text-audit-blue">{config.title}</span>
        </nav>

        <h1 className="text-3xl font-serif font-bold text-audit-navy mb-2">{config.title}</h1>
        <p className="text-slate-600 mb-8">{config.description}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            {config.inputs.map((input) => (
              <div key={input.id}>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{input.label}</label>
                <input
                  type="number"
                  min={input.min}
                  max={input.max}
                  step={input.step || 1}
                  value={inputs[input.id]}
                  onChange={(e) => setInputs({ ...inputs, [input.id]: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
            ))}
          </div>

          <div className="bg-audit-navy text-white rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-audit-gold">Resultado</h2>
            {config.outputs.map((out) => (
              <div key={out.id} className="border-b border-white/10 pb-3">
                <div className="text-xs text-slate-300 uppercase">{out.label}</div>
                <div className="text-2xl font-bold">{formatValue(results[out.id] ?? 0, out.format)}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-8 italic">
          Simulação educativa. Consulte um profissional habilitado para casos reais. Ver{' '}
          <Link to="/termos-de-uso" className="text-audit-gold underline">Termos de Uso</Link>.
        </p>
      </main>
      <Footer />
    </div>
  );
}
