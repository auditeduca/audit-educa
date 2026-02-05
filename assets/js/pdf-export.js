async function generatePDFReport() {
    const { jsPDF } = window.jspdf;
    showToast(A gerar relatório técnico, por favor aguarde...);
    
     Capturamos o container que engloba os parâmetros, resultados e a tabela
    const area = document.getElementById('capture-pdf-area');
    const tableArea = document.getElementById('table-container');
    
    try {
         html2canvas configurado para capturar o scroll total e alta definição
        const canvas = await html2canvas(area, {
            scale 2,
            useCORS true,
            backgroundColor '#ffffff',
            scrollY -window.scrollY,  Ajuste de posição para captura total
            windowWidth area.scrollWidth,
            windowHeight area.scrollHeight
        });

        const imgData = canvas.toDataURL('imagepng');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height  pdfWidth)  imgProps.width;

         --- CABEÇALHO DO RELATÓRIO (ESTILO PAPEL DE TRABALHO) ---
        pdf.setFillColor(15, 23, 42);  Audit Navy
        pdf.rect(0, 0, pdfWidth, 40, 'F');
        
        pdf.setFont(helvetica, bold);
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.text(AUDIT EDUCA - RELATÓRIO DE EVIDÊNCIA, 15, 15);
        
        pdf.setFontSize(8);
        pdf.setFont(helvetica, normal);
        pdf.setTextColor(197, 160, 89);  Audit Gold
        pdf.text(FERRAMENTA DE RECÁLCULO E COMPLIANCE FINANCEIRO, 15, 20);

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(9);
        const calcName = document.getElementById('calc-selector').options[document.getElementById('calc-selector').selectedIndex].text;
        pdf.text(`Metodologia aplicada ${calcName}`, 15, 28);
        pdf.text(`Data de Emissão ${new Date().toLocaleString('pt-PT')}`, 15, 33);

         --- INSERÇÃO DO CONTEÚDO ---
         Se a imagem for maior que a página, o jsPDF pode criar múltiplas páginas 
         ou ajustar o conteúdo. Aqui escalamos para caber na largura.
        pdf.addImage(imgData, 'PNG', 0, 45, pdfWidth, imgHeight);

         --- RODAPÉ ---
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(Este documento é uma memória de cálculo gerada para fins de suporte à auditoria., 15, pdfHeight - 10);
        pdf.text(Página 1 de 1, pdfWidth - 30, pdfHeight - 10);

        const fileName = `AuditEduca_Recalculo_${Date.now()}.pdf`;
        pdf.save(fileName);
        showToast(Relatório exportado com sucesso!);
        
    } catch (err) {
        console.error(err);
        showToast(Erro crítico ao gerar evidência em PDF.);
    }
}