// src/pages/templates/hooks/useExport.js
import PptxGenJS from 'pptxgenjs';

export const useExport = () => {
  const exportToFormats = async (format, { template, variables, processedHTML }) => {
    try {
      const download = (filename, content, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      };

      switch (format) {
        case 'html':
          download(`${template.name}.html`, processedHTML, 'text/html');
          break;

        case 'json':
          const json = JSON.stringify({ 
            template: template.name, 
            variables, 
            processedHTML, 
            timestamp: new Date().toISOString() 
          }, null, 2);
          download(`${template.name}.json`, json, 'application/json');
          break;

        case 'word':
          const wordHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body { font-family: Arial; }</style></head><body>${processedHTML}</body></html>`;
          download(`${template.name}.doc`, wordHtml, 'application/msword');
          break;

        case 'ppt':
          // Gerar apresentação PowerPoint real usando pptxgenjs
          const pptx = new PptxGenJS();
          
          // Adicionar um slide com o conteúdo do template
          const slide = pptx.addSlide();
          
          // Adicionar o HTML como objeto de texto formatado (suporte básico)
          // Nota: pptxgenjs não renderiza HTML completo, apenas texto simples.
          // Para melhor resultado, extraímos o texto puro do HTML.
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = processedHTML;
          const textContent = tempDiv.textContent || tempDiv.innerText || '';
          
          slide.addText(textContent, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 6,
            fontSize: 12,
            color: '363636',
            bold: false
          });

          // Gerar o arquivo PPTX
          await pptx.writeFile({ fileName: `${template.name}.pptx` });
          break;

        default:
          return { success: false, error: 'Formato não implementado' };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return { exportToFormats, copyToClipboard };
};