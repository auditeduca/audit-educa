const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseCurrency = (s) => parseFloat(s.replace(/\D/g, "")) / 100 || 0;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('calc-selector');
    Object.keys(calculatorDB).forEach(id => {
        let opt = document.createElement('option');
        opt.value = id;
        opt.innerText = calculatorDB[id].name;
        selector.appendChild(opt);
    });
    selector.addEventListener('change', (e) => renderInputs(e.target.value));
    renderInputs(selector.value);
});

function renderInputs(calcId) {
    const container = document.getElementById('dynamic-inputs-container');
    const calc = calculatorDB[calcId];
    container.innerHTML = '';
    
    calc.variables.forEach(v => {
        const div = document.createElement('div');
        div.innerHTML = `<label class="block text-xs font-bold mb-1">${v.label}</label>
            <input id="${v.id}" class="w-full p-3 border rounded-lg" oninput="${v.unit==='currency'?'formatCurrency(this)':''}">`;
        container.appendChild(div);
    });

    if(calc.isDynamic) {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.className = "col-span-2 text-blue-600 text-xs font-bold";
        btn.innerText = "+ ADICIONAR FLUXO DE CAIXA";
        btn.onclick = () => {
            const input = document.createElement('input');
            input.className = "flow-input w-full p-3 border rounded-lg mt-2";
            input.placeholder = "Valor do Mês";
            input.oninput = function() { formatCurrency(this) };
            container.appendChild(input);
        };
        container.appendChild(btn);
    }
}

function formatCurrency(i) {
    let v = i.value.replace(/\D/g, "");
    i.value = (v/100).toLocaleString('pt-BR', {minimumFractionDigits: 2});
}

function executeCalculation() {
    const id = document.getElementById('calc-selector').value;
    const calc = calculatorDB[id];
    const data = {};
    calc.variables.forEach(v => {
        const val = document.getElementById(v.id).value;
        data[v.id] = v.unit === 'currency' ? parseCurrency(val) : parseFloat(val);
    });
    if(calc.isDynamic) {
        data.fluxos = Array.from(document.querySelectorAll('.flow-input')).map(i => parseCurrency(i.value));
    }

    const res = calc.calc(data);
    document.getElementById('display-total').innerText = res.type === 'VPL' ? formatBRL(res.total) : formatBRL(res.total);
    document.getElementById('display-interest').innerText = typeof res.interest === 'string' ? res.interest : formatBRL(res.interest);
    document.getElementById('display-effective-rate').innerText = res.effective.toFixed(2) + "%";
    document.getElementById('result-area').classList.remove('hidden');
    
    if(res.table) renderTable(res.table, res.type);
}

function renderTable(rows, type) {
    let headers = type === 'VPL' ? ['Mês', 'Fluxo', 'VP', 'Acumulado'] : ['Mês', 'Parcela', 'Juros', 'Amort', 'Saldo'];
    let html = `<table class="w-full bg-white border mt-4 text-xs"><thead><tr class="bg-slate-100">`;
    headers.forEach(h => html += `<th class="p-3 border">${h}</th>`);
    html += `</tr></thead><tbody>`;
    rows.forEach(r => {
        html += `<tr class="border text-center">
            <td class="p-2 border">${r.t}</td>
            <td class="p-2 border">${formatBRL(r.pmt || 0)}</td>
            <td class="p-2 border">${formatBRL(r.juros || r.vp || 0)}</td>
            <td class="p-2 border">${formatBRL(r.amort || 0)}</td>
            <td class="p-2 border">${formatBRL(r.saldo || r.vpl_acumulado || 0)}</td>
        </tr>`;
    });
    document.getElementById('table-container').innerHTML = html + `</tbody></table>`;
}

async function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(document.getElementById('capture-pdf-area'));
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width);
    pdf.save('Relatorio_Audit.pdf');
}