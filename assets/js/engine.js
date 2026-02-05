// FORMATADORES E UTILITÁRIOS
const formatBRL = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const parseCurrency = (s) => {
    if (!s) return 0;
    const value = s.replace(/\D/g, "");
    return parseFloat(value) / 100 || 0;
};

// INICIALIZAÇÃO DO SELETOR
document.addEventListener('DOMContentLoaded', () => {
    const selector = document.getElementById('calc-selector');
    if (!selector) return;

    Object.keys(calculatorDB).forEach(id => {
        let opt = document.createElement('option');
        opt.value = id;
        opt.innerText = calculatorDB[id].name;
        selector.appendChild(opt);
    });

    selector.addEventListener('change', (e) => renderInputs(e.target.value));
    renderInputs(selector.value); // Primeira carga
});

function renderInputs(calcId) {
    const container = document.getElementById('dynamic-inputs-container');
    const calc = calculatorDB[calcId];
    if (!calc) return;
    
    container.innerHTML = ''; // Limpa campos anteriores
    
    calc.variables.forEach(v => {
        const div = document.createElement('div');
        div.className = "mb-4";
        div.innerHTML = `
            <label class="block text-xs font-bold text-slate-700 uppercase mb-1">${v.label}</label>
            <input id="${v.id}" class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="${v.unit === 'currency' ? '0,00' : '0'}"
            oninput="${v.unit === 'currency' ? 'handleCurrencyInput(this)' : ''}">`;
        container.appendChild(div);
    });

    // Fluxos dinâmicos para VPL
    if(calc.isDynamic) {
        const dynamicSection = document.createElement('div');
        dynamicSection.className = "col-span-1 md:col-span-2 border-t pt-4 mt-2";
        dynamicSection.innerHTML = `
            <button type="button" onclick="addFlowField()" class="text-blue-600 text-xs font-bold hover:underline">
                <i class="fas fa-plus mr-1"></i> ADICIONAR NOVO FLUXO DE CAIXA
            </button>
            <div id="extra-flows" class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3"></div>
        `;
        container.appendChild(dynamicSection);
    }
}

function handleCurrencyInput(i) {
    let v = i.value.replace(/\D/g, "");
    if (v === "") return i.value = "";
    i.value = (parseFloat(v) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function addFlowField() {
    const container = document.getElementById('extra-flows');
    const count = container.children.length + 1;
    const div = document.createElement('div');
    div.innerHTML = `
        <label class="block text-[10px] text-slate-400 font-bold uppercase">Mês ${count}</label>
        <input class="flow-input w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="0,00" oninput="handleCurrencyInput(this)">
    `;
    container.appendChild(div);
}

function executeCalculation() {
    const id = document.getElementById('calc-selector').value;
    const calc = calculatorDB[id];
    const data = {};
    
    // Captura dados fixos
    calc.variables.forEach(v => {
        const input = document.getElementById(v.id);
        data[v.id] = v.unit === 'currency' ? parseCurrency(input.value) : parseFloat(input.value);
    });

    // Captura fluxos dinâmicos
    if(calc.isDynamic) {
        const flowInputs = document.querySelectorAll('.flow-input');
        data.fluxos = Array.from(flowInputs).map(i => parseCurrency(i.value));
    }

    const res = calc.calc(data);
    
    // Atualiza Displays
    document.getElementById('display-total').innerText = formatBRL(res.total);
    document.getElementById('display-interest').innerText = typeof res.interest === 'string' ? res.interest : formatBRL(res.interest);
    document.getElementById('display-effective-rate').innerText = res.effective.toFixed(2) + "%";
    
    document.getElementById('result-area').classList.remove('hidden');
    if(res.table) renderTable(res.table, res.type);
}

function renderTable(rows, type) {
    let headers = type === 'VPL' ? ['Mês', 'Fluxo', 'Valor Presente', 'VPL Acumulado'] : ['Mês', 'Parcela', 'Juros', 'Amortização', 'Saldo'];
    let html = `<div class="overflow-x-auto mt-6 rounded-xl border border-slate-200">
        <table class="w-full text-left text-xs bg-white">
        <thead><tr class="bg-slate-50 text-slate-500">`;
    headers.forEach(h => html += `<th class="p-3 font-bold">${h}</th>`);
    html += `</tr></thead><tbody>`;
    
    rows.forEach(r => {
        html += `<tr class="border-t hover:bg-slate-50 transition">
            <td class="p-3 font-bold">${r.t}</td>
            <td class="p-3">${formatBRL(r.pmt || 0)}</td>
            <td class="p-3">${formatBRL(r.juros || r.vp || 0)}</td>
            <td class="p-3 text-blue-600">${formatBRL(r.amort || 0)}</td>
            <td class="p-3 font-bold ${r.vpl_acumulado < 0 ? 'text-red-500' : 'text-slate-800'}">${formatBRL(r.saldo || r.vpl_acumulado || 0)}</td>
        </tr>`;
    });
    
    document.getElementById('table-container').innerHTML = html + `</tbody></table></div>`;
}

async function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    const area = document.getElementById('capture-pdf-area');
    const canvas = await html2canvas(area, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.setFontSize(16);
    pdf.text("AUDIT EDUCA - RELATÓRIO TÉCNICO", 10, 15);
    pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight);
    pdf.save(`Audit_Relatorio_${Date.now()}.pdf`);
}