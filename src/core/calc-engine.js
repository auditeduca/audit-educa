/**
 * Safe calculator engine — no arbitrary eval.
 */
import inssTable from '../../content/calculators/tables/inss-2026.json';

function calcInss(gross) {
  let remaining = gross;
  let prev = 0;
  let total = 0;
  for (const b of inssTable.inssBrackets) {
    const slice = Math.min(remaining, b.upTo - prev);
    if (slice <= 0) break;
    total += slice * b.rate;
    remaining -= slice;
    prev = b.upTo;
    if (remaining <= 0) break;
  }
  const cap = inssTable.inssBrackets[inssTable.inssBrackets.length - 1].upTo;
  return Math.min(total, cap * 0.14);
}

function calcIrrf(taxable, dependents = 0) {
  const base = taxable - dependents * inssTable.dependentDeduction;
  if (base <= 0) return 0;
  for (const b of inssTable.irrfBrackets) {
    if (b.upTo === null || base <= b.upTo) {
      return Math.max(0, base * b.rate - b.deduction);
    }
  }
  return 0;
}

export function runCalculator(formulaType, inputs) {
  const p = Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, Number(v) || 0]));

  switch (formulaType) {
    case 'juros-simples': {
      const interest = p.principal * (p.rate / 100) * p.periods;
      return { interest, total: p.principal + interest };
    }
    case 'juros-compostos': {
      const total = p.principal * Math.pow(1 + p.rate / 100, p.periods);
      return { total, interest: total - p.principal };
    }
    case 'desconto': {
      const discount = p.faceValue * (p.rate / 100) * p.periods;
      return { presentValue: p.faceValue - discount, discount };
    }
    case 'salario-liquido': {
      const inss = calcInss(p.gross);
      const irrf = calcIrrf(p.gross - inss, p.dependents);
      const net = p.gross - inss - irrf;
      return { inss, irrf, net };
    }
    case 'ferias': {
      const daily = p.gross / 30;
      const vacationPay = daily * p.days;
      const third = vacationPay / 3;
      return { vacationPay, third, total: vacationPay + third };
    }
    default:
      return {};
  }
}

export function formatValue(value, format) {
  if (format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
  if (format === 'percent') {
    return `${value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat('pt-BR').format(value);
}
