export const accountingProposal = {
  name: '💰 Proposta de Serviços Contábeis',
  description: 'Proposta específica para serviços contábeis',
  category: 'Documentos',
  html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">PROPOSTA DE SERVIÇOS CONTÁBEIS</h1>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>CLIENTE:</strong> {{clientName}}</p>
        <p style="margin: 0 0 20px 0;"><strong>DATA:</strong> {{date}}</p>
        <p style="margin: 0 0 20px 0;"><strong>VALIDADE:</strong> {{validity}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. SERVIÇOS PROPOSTOS</h2>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Contabilidade Geral e Fiscal;</li>
            <li>Escrituração Contábil Digital (ECD);</li>
            <li>Declaração de Imposto de Renda Pessoa Jurídica (IRPJ);</li>
            <li>Declaração de Contribuição Social sobre o Lucro Líquido (CSLL);</li>
            <li>Declaração do Imposto sobre Circulação de Mercadorias e Serviços (ICMS);</li>
            <li>Consultoria Tributária;</li>
            <li>{{additionalServices}}</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. TABELA DE VALORES</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="background: #002D5B; color: white;">
                <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Serviço</th>
                <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Valor</th>
            </tr>
            <tr>
                <td style="padding: 10px; border: 1px solid #ddd;">Contabilidade Mensal</td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">R$ {{monthlyValue}}</td>
            </tr>
            <tr style="background: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>TOTAL MENSAL</strong></td>
                <td style="padding: 10px; text-align: right; border: 1px solid #ddd;"><strong>R$ {{totalMonthly}}</strong></td>
            </tr>
        </table>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. CONDIÇÕES DE PAGAMENTO</h2>
        <p style="margin: 0 0 20px 0;">{{paymentTerms}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. PRAZOS</h2>
        <p style="margin: 0 0 20px 0;">{{deadlines}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. OBSERVAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{observations}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{consultantName}}</p>
                    <p style="margin: 5px 0;">Consultor Responsável</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">Cliente</p>
                </div>
            </div>
        </div>
    </div>`,
  variables: ['clientName', 'date', 'validity', 'additionalServices', 'monthlyValue', 'totalMonthly', 'paymentTerms', 'deadlines', 'observations', 'location', 'consultantName']
};