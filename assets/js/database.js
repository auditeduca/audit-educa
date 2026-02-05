const calculatorDB = {
    "JRS_SIMPLES": {
        "name": "Juros Simples",
        "variables": [
            {"id": "pv", "label": "Capital Inicial", "unit": "currency"},
            {"id": "i", "label": "Taxa Mensal (%)", "unit": "percentage"},
            {"id": "n", "label": "Prazo (Meses)", "unit": "number"}
        ],
        "calc": (d) => {
            const j = d.pv * (d.i / 100) * d.n;
            return { total: d.pv + j, interest: j, effective: (j / d.pv) * 100 };
        }
    },
    "JRS_COMPOSTOS": {
        "name": "Juros Compostos",
        "variables": [
            {"id": "pv", "label": "Valor Atual", "unit": "currency"},
            {"id": "i", "label": "Taxa Mensal (%)", "unit": "percentage"},
            {"id": "n", "label": "Meses", "unit": "number"}
        ],
        "calc": (d) => {
            const m = d.pv * Math.pow((1 + (d.i / 100)), d.n);
            return { total: m, interest: m - d.pv, effective: ((m / d.pv) - 1) * 100 };
        }
    },
    "PRICE": {
        "name": "Tabela Price",
        "variables": [
            {"id": "pv", "label": "Valor Financiado", "unit": "currency"},
            {"id": "i", "label": "Taxa Mensal (%)", "unit": "percentage"},
            {"id": "n", "label": "Meses", "unit": "number"}
        ],
        "calc": (d) => {
            const i = d.i / 100;
            const pmt = d.pv * ((i * Math.pow(1 + i, d.n)) / (Math.pow(1 + i, d.n) - 1));
            let saldo = d.pv;
            let rows = [];
            for (let t = 1; t <= d.n; t++) {
                let jurosMes = saldo * i;
                let amortMes = pmt - jurosMes;
                saldo -= amortMes;
                rows.push({ t, pmt, juros: jurosMes, amort: amortMes, saldo: Math.max(0, saldo) });
            }
            return { total: pmt * d.n, interest: (pmt * d.n) - d.pv, effective: (((pmt * d.n) / d.pv) - 1) * 100, table: rows };
        }
    },
    "SAC": {
        "name": "Tabela SAC",
        "variables": [
            {"id": "pv", "label": "Valor Financiado", "unit": "currency"},
            {"id": "i", "label": "Taxa Mensal (%)", "unit": "percentage"},
            {"id": "n", "label": "Meses", "unit": "number"}
        ],
        "calc": (d) => {
            const i = d.i / 100;
            const amort = d.pv / d.n;
            let saldo = d.pv;
            let totalPago = 0;
            let rows = [];
            for (let t = 1; t <= d.n; t++) {
                let jurosMes = saldo * i;
                let pmt = amort + jurosMes;
                saldo -= amort;
                totalPago += pmt;
                rows.push({ t, pmt, juros: jurosMes, amort: amort, saldo: Math.max(0, saldo) });
            }
            return { total: totalPago, interest: totalPago - d.pv, effective: ((totalPago / d.pv) - 1) * 100, table: rows };
        }
    },
    "VPL_TIR": {
        "name": "VPL (Valor Presente Líquido)",
        "variables": [
            {"id": "tma", "label": "TMA (%)", "unit": "percentage"},
            {"id": "investimento", "label": "Investimento Inicial", "unit": "currency"}
        ],
        "isDynamic": true,
        "calc": (d) => {
            const tma = d.tma / 100;
            let vpl = -d.investimento;
            let rows = d.fluxos.map((val, idx) => {
                const t = idx + 1;
                const vp = val / Math.pow(1 + tma, t);
                vpl += vp;
                return { t, pmt: val, vp, vpl_acumulado: vpl };
            });
            return { total: vpl, interest: vpl > 0 ? "Viável" : "Inviável", effective: (vpl / d.investimento) * 100, table: rows, type: 'VPL' };
        }
    }
};