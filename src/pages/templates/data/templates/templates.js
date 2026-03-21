// src/pages/templates/data/templates.js

export const TEMPLATES = {
  'email-signature': {
    name: '📧 Assinatura de E-mail',
    description: 'Template profissional para assinatura de e-mails',
    category: 'Comunicação',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0; padding: 20px; background-color: #ffffff; border-top: 4px solid #D4AF37;">
        <div style="padding: 20px 0; border-bottom: 1px solid #eeeeee;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #002D5B;">{{name}}</p>
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #D4AF37; text-transform: uppercase;">{{title}}</p>
            <div style="font-size: 11px; color: #666666; line-height: 1.5;">
                <p style="margin: 0;">{{company}}</p>
                <p style="margin: 5px 0;">{{phone}}</p>
                <p style="margin: 5px 0;"><a href="mailto:{{email}}" style="color: #002D5B; text-decoration: none;">{{email}}</a></p>
            </div>
        </div>
    </div>`,
    variables: ['name', 'title', 'company', 'phone', 'email']
  },
  'proposal': {
    name: '📄 Proposta Comercial',
    description: 'Template de proposta para envio por e-mail',
    category: 'Documentos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0; padding: 40px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 4px solid #D4AF37;">
            <h2 style="margin: 0; color: #002D5B; font-size: 22px; font-weight: 700;">PROPOSTA COMERCIAL</h2>
        </div>
        <p style="margin: 0 0 20px 0; color: #444444;">Prezado Sr. <strong>{{clientName}}</strong>,</p>
        <p style="margin: 0 0 20px 0; color: #444444;">Submetemos à vossa apreciação a proposta referente aos serviços de <strong>{{serviceDescription}}</strong>.</p>
        <div style="background-color: #fdfaf0; border-left: 4px solid #D4AF37; padding: 20px; margin: 25px 0; border-radius: 2px;">
            <p style="margin: 0 0 10px 0; color: #002D5B; font-weight: bold; font-size: 14px; text-transform: uppercase;">METODOLOGIA:</p>
            <p style="margin: 0; color: #555555; font-size: 13px;">{{methodology}}</p>
        </div>
        <p style="margin: 0 0 30px 0; color: #444444; font-size: 14px;">Estamos à disposição para discutir o cronograma de implementação.</p>
    </div>`,
    variables: ['clientName', 'serviceDescription', 'methodology']
  },
  'business-card-print': {
    name: '🎫 Cartão de Visitas (Impressão)',
    description: 'Cartão profissional para impressão - 90x50mm',
    category: 'Materiais',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 90mm; height: 50mm; padding: 5mm; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; display: flex; align-items: center; justify-content: space-between;">
        <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">{{name}}</p>
            <p style="margin: 5px 0; font-size: 11px; color: #D4AF37;">{{title}}</p>
            <p style="margin: 5px 0; font-size: 10px;">{{phone}}</p>
            <p style="margin: 5px 0; font-size: 10px;">{{email}}</p>
        </div>
        <div style="width: 1px; height: 30mm; background-color: #D4AF37; margin: 0 10px;"></div>
    </div>`,
    variables: ['name', 'title', 'phone', 'email']
  },
  'business-card-virtual': {
    name: '💼 Cartão de Visitas Virtual',
    description: 'Cartão digital para compartilhamento online',
    category: 'Digital',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; border-radius: 12px; text-align: center;">
        <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">{{name}}</h1>
        <p style="margin: 0 0 20px 0; font-size: 14px; color: #D4AF37;">{{title}}</p>
        <div style="margin: 30px 0; padding: 20px 0; border-top: 1px solid rgba(212, 175, 55, 0.3); border-bottom: 1px solid rgba(212, 175, 55, 0.3);">
            <p style="margin: 5px 0; font-size: 12px;">{{phone}}</p>
            <p style="margin: 5px 0; font-size: 12px;">{{email}}</p>
            <p style="margin: 5px 0; font-size: 12px;">{{website}}</p>
        </div>
        <p style="margin: 20px 0 0 0; font-size: 11px; opacity: 0.8;">{{company}}</p>
    </div>`,
    variables: ['name', 'title', 'phone', 'email', 'website', 'company']
  },
  'letterhead': {
    name: '📋 Papel Timbrado',
    description: 'Template de papel timbrado para documentos',
    category: 'Documentos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; min-height: 297mm; padding: 20mm; background-color: #ffffff; position: relative;">
        <div style="border-top: 4px solid #D4AF37; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px; font-weight: bold;">{{companyName}}</h1>
            <p style="margin: 5px 0; color: #666666; font-size: 12px;">{{address}}</p>
            <p style="margin: 5px 0; color: #666666; font-size: 12px;">{{phone}} | {{email}}</p>
        </div>
        <div style="min-height: 200mm; color: #333333; line-height: 1.6;">
            <p>{{content}}</p>
        </div>
        <div style="position: absolute; bottom: 20mm; left: 20mm; right: 20mm; border-top: 1px solid #D4AF37; padding-top: 10px; font-size: 10px; color: #666666; text-align: center;">
            {{footerText}}
        </div>
    </div>`,
    variables: ['companyName', 'address', 'phone', 'email', 'content', 'footerText']
  },
  'report-cover': {
    name: '📊 Capa de Relatório',
    description: 'Capa profissional para relatórios',
    category: 'Documentos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; width: 100%; height: 100vh; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px;">
        <div style="margin-bottom: 60px;">
            <h1 style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold;">{{reportTitle}}</h1>
            <p style="margin: 0; font-size: 18px; color: #D4AF37;">{{reportSubtitle}}</p>
        </div>
        <div style="margin-bottom: 60px; flex: 1; display: flex; align-items: center; justify-content: center;">
            <!-- Espaço para imagem ou conteúdo -->
        </div>
        <div style="font-size: 14px;">
            <p style="margin: 5px 0;">{{author}}</p>
            <p style="margin: 5px 0;">{{date}}</p>
            <p style="margin: 5px 0; color: #D4AF37;">{{company}}</p>
        </div>
    </div>`,
    variables: ['reportTitle', 'reportSubtitle', 'author', 'date', 'company']
  },
  'nda': {
    name: '🔒 NDA - Acordo de Confidencialidade',
    description: 'Acordo de Não Divulgação profissional',
    category: 'Contratos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">ACORDO DE NÃO DIVULGAÇÃO</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Confidentiality Agreement</p>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>ENTRE:</strong></p>
        <p style="margin: 0 0 20px 0;">{{disclosingParty}}, pessoa {{personType}} domiciliada em {{address}}, doravante denominada <strong>"DIVULGADORA"</strong></p>
        
        <p style="margin: 0 0 20px 0;"><strong>E:</strong></p>
        <p style="margin: 0 0 20px 0;">{{receivingParty}}, pessoa {{receiverType}} domiciliada em {{receiverAddress}}, doravante denominada <strong>"RECEPTORA"</strong></p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. OBJETO</h2>
        <p style="margin: 0 0 20px 0;">O presente Acordo tem por objetivo estabelecer as condições e obrigações das partes quanto ao tratamento de informações confidenciais a serem compartilhadas entre elas.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. INFORMAÇÕES CONFIDENCIAIS</h2>
        <p style="margin: 0 0 20px 0;">Consideram-se informações confidenciais todos os dados, documentos, projetos e informações que a DIVULGADORA compartilhar com a RECEPTORA, sejam eles em formato físico ou digital.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. OBRIGAÇÕES DA RECEPTORA</h2>
        <p style="margin: 0 0 20px 0;">A RECEPTORA se compromete a:</p>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Manter sigilo absoluto sobre as informações confidenciais;</li>
            <li>Utilizar as informações exclusivamente para o propósito acordado;</li>
            <li>Não divulgar as informações a terceiros sem consentimento prévio;</li>
            <li>Implementar medidas de segurança adequadas.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. VIGÊNCIA</h2>
        <p style="margin: 0 0 20px 0;">Este acordo vigerá por {{duration}} a partir da data de assinatura.</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{disclosingParty}}</p>
                    <p style="margin: 5px 0;">DIVULGADORA</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{receivingParty}}</p>
                    <p style="margin: 5px 0;">RECEPTORA</p>
                </div>
            </div>
        </div>
    </div>`,
    variables: ['disclosingParty', 'personType', 'address', 'receivingParty', 'receiverType', 'receiverAddress', 'duration', 'location', 'date']
  },
  'service-contract': {
    name: '📝 Contrato de Prestação de Serviço',
    description: 'Contrato profissional para serviços',
    category: 'Contratos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">CONTRATO DE PRESTAÇÃO DE SERVIÇO</h1>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>CONTRATANTE:</strong> {{clientName}}</p>
        <p style="margin: 0 0 20px 0;"><strong>CONTRATADA:</strong> {{companyName}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. DO OBJETO</h2>
        <p style="margin: 0 0 20px 0;">A CONTRATADA se compromete a prestar os seguintes serviços:</p>
        <p style="margin: 0 0 20px 0;">{{serviceDescription}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. DO VALOR E CONDIÇÕES DE PAGAMENTO</h2>
        <p style="margin: 0 0 20px 0;"><strong>Valor Total:</strong> R$ {{totalValue}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Forma de Pagamento:</strong> {{paymentMethod}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Prazo de Pagamento:</strong> {{paymentTerms}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. DO PRAZO DE EXECUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">Os serviços serão executados no período de {{startDate}} a {{endDate}}.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. DAS OBRIGAÇÕES DA CONTRATADA</h2>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Executar os serviços com profissionalismo e qualidade;</li>
            <li>Cumprir os prazos estabelecidos;</li>
            <li>Manter sigilo sobre informações confidenciais;</li>
            <li>Responsabilizar-se por danos causados por negligência.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. DA RESCISÃO</h2>
        <p style="margin: 0 0 20px 0;">Este contrato poderá ser rescindido a qualquer momento mediante notificação prévia de {{terminationNotice}} dias.</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">CONTRATANTE</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{companyName}}</p>
                    <p style="margin: 5px 0;">CONTRATADA</p>
                </div>
            </div>
        </div>
    </div>`,
    variables: ['clientName', 'companyName', 'serviceDescription', 'totalValue', 'paymentMethod', 'paymentTerms', 'startDate', 'endDate', 'terminationNotice', 'location', 'date']
  },
  'audit-report': {
    name: '🔍 Relatório de Auditoria Financeira',
    description: 'Relatório profissional de auditoria',
    category: 'Relatórios',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">RELATÓRIO DE AUDITORIA FINANCEIRA</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Exercício: {{fiscalYear}}</p>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INTRODUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">Este relatório apresenta os resultados da auditoria financeira realizada na <strong>{{companyName}}</strong> referente ao exercício de {{fiscalYear}}.</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. ESCOPO DA AUDITORIA</h2>
        <p style="margin: 0 0 20px 0;">{{auditScope}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. PROCEDIMENTOS EXECUTADOS</h2>
        <ul style="margin: 0 0 20px 0; padding-left: 20px;">
            <li>Análise de demonstrações financeiras;</li>
            <li>Verificação de controles internos;</li>
            <li>Teste de transações e saldos;</li>
            <li>Avaliação de conformidade regulatória.</li>
        </ul>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ACHADOS E OBSERVAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{findings}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. CONCLUSÕES</h2>
        <p style="margin: 0 0 20px 0;">{{conclusions}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. RECOMENDAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{auditorName}}</p>
                    <p style="margin: 5px 0;">Auditor Responsável</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{clientName}}</p>
                    <p style="margin: 5px 0;">Representante da Empresa</p>
                </div>
            </div>
        </div>
    </div>`,
    variables: ['fiscalYear', 'companyName', 'auditScope', 'findings', 'conclusions', 'recommendations', 'location', 'date', 'auditorName', 'clientName']
  },
  'final-report': {
    name: '📑 Relatório Final de Consultoria',
    description: 'Relatório completo de consultoria',
    category: 'Relatórios',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">RELATÓRIO FINAL DE CONSULTORIA</h1>
            <p style="margin: 10px 0 0 0; color: #666;">Projeto: {{projectName}}</p>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. RESUMO EXECUTIVO</h2>
        <p style="margin: 0 0 20px 0;">{{executiveSummary}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. OBJETIVOS DO PROJETO</h2>
        <p style="margin: 0 0 20px 0;">{{projectObjectives}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. METODOLOGIA APLICADA</h2>
        <p style="margin: 0 0 20px 0;">{{methodology}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ATIVIDADES REALIZADAS</h2>
        <p style="margin: 0 0 20px 0;">{{activitiesPerformed}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RESULTADOS OBTIDOS</h2>
        <p style="margin: 0 0 20px 0;">{{results}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. RECOMENDAÇÕES E PRÓXIMOS PASSOS</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">7. CONCLUSÕES</h2>
        <p style="margin: 0 0 20px 0;">{{conclusions}}</p>
        
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
                    <p style="margin: 5px 0;">Representante do Cliente</p>
                </div>
            </div>
        </div>
    </div>`,
    variables: ['projectName', 'executiveSummary', 'projectObjectives', 'methodology', 'activitiesPerformed', 'results', 'recommendations', 'conclusions', 'location', 'date', 'consultantName', 'clientName']
  },
  'presentation': {
    name: '🎯 Apresentação/PPT',
    description: 'Template de apresentação em HTML',
    category: 'Apresentações',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); color: white; padding: 60px 40px; text-align: center; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;">
        <h1 style="margin: 0 0 20px 0; font-size: 48px; font-weight: bold;">{{presentationTitle}}</h1>
        <p style="margin: 0 0 40px 0; font-size: 24px; color: #D4AF37;">{{presentationSubtitle}}</p>
        
        <div style="margin-top: 60px; padding: 40px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; backdrop-filter: blur(10px);">
            <h2 style="margin: 0 0 20px 0; font-size: 28px;">Agenda</h2>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin: 10px 0; font-size: 18px;">• {{topic1}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic2}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic3}}</li>
                <li style="margin: 10px 0; font-size: 18px;">• {{topic4}}</li>
            </ul>
        </div>
        
        <div style="margin-top: 60px; font-size: 16px; opacity: 0.8;">
            <p style="margin: 5px 0;">{{presenterName}} | {{presenterTitle}}</p>
            <p style="margin: 5px 0;">{{companyName}}</p>
            <p style="margin: 5px 0;">{{date}}</p>
        </div>
    </div>`,
    variables: ['presentationTitle', 'presentationSubtitle', 'topic1', 'topic2', 'topic3', 'topic4', 'presenterName', 'presenterTitle', 'companyName', 'date']
  },
  'accounting-proposal': {
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
  },
  'project-charter': {
    name: '🎯 Termo de Abertura de Projeto',
    description: 'Documento de abertura formal de projeto',
    category: 'Projetos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">TERMO DE ABERTURA DE PROJETO</h1>
        </div>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INFORMAÇÕES DO PROJETO</h2>
        <p style="margin: 0 0 10px 0;"><strong>Nome do Projeto:</strong> {{projectName}}</p>
        <p style="margin: 0 0 10px 0;"><strong>Gerente de Projeto:</strong> {{projectManager}}</p>
        <p style="margin: 0 0 10px 0;"><strong>Patrocinador:</strong> {{sponsor}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Data de Início:</strong> {{startDate}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. JUSTIFICATIVA</h2>
        <p style="margin: 0 0 20px 0;">{{justification}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. OBJETIVOS</h2>
        <p style="margin: 0 0 20px 0;">{{objectives}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. ESCOPO</h2>
        <p style="margin: 0 0 20px 0;">{{scope}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RESTRIÇÕES E PREMISSAS</h2>
        <p style="margin: 0 0 10px 0;"><strong>Restrições:</strong></p>
        <p style="margin: 0 0 10px 0;">{{constraints}}</p>
        <p style="margin: 0 0 20px 0;"><strong>Premissas:</strong></p>
        <p style="margin: 0 0 20px 0;">{{assumptions}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">6. ORÇAMENTO ESTIMADO</h2>
        <p style="margin: 0 0 20px 0;">R$ {{budget}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">7. CRONOGRAMA</h2>
        <p style="margin: 0 0 20px 0;">{{schedule}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{projectManager}}</p>
                    <p style="margin: 5px 0;">Gerente de Projeto</p>
                </div>
                <div>
                    <p style="margin: 0 0 50px 0;">_____________________________</p>
                    <p style="margin: 0; font-weight: bold;">{{sponsor}}</p>
                    <p style="margin: 5px 0;">Patrocinador</p>
                </div>
            </div>
        </div>
    </div>`,
    variables: ['projectName', 'projectManager', 'sponsor', 'startDate', 'justification', 'objectives', 'scope', 'constraints', 'assumptions', 'budget', 'schedule', 'location', 'date']
  },
  'technical-opinion': {
    name: '📋 Parecer Técnico',
    description: 'Parecer técnico profissional',
    category: 'Documentos',
    html: `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #D4AF37; padding-bottom: 20px;">
            <h1 style="margin: 0; color: #002D5B; font-size: 24px;">PARECER TÉCNICO</h1>
        </div>
        
        <p style="margin: 0 0 20px 0;"><strong>SOLICITANTE:</strong> {{requester}}</p>
        <p style="margin: 0 0 20px 0;"><strong>ASSUNTO:</strong> {{subject}}</p>
        <p style="margin: 0 0 20px 0;"><strong>DATA:</strong> {{date}}</p>
        <p style="margin: 0 0 20px 0;"><strong>PARECER Nº:</strong> {{opinionNumber}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">1. INTRODUÇÃO</h2>
        <p style="margin: 0 0 20px 0;">{{introduction}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">2. ANÁLISE TÉCNICA</h2>
        <p style="margin: 0 0 20px 0;">{{technicalAnalysis}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">3. CONSIDERAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{considerations}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">4. CONCLUSÃO</h2>
        <p style="margin: 0 0 20px 0;">{{conclusion}}</p>
        
        <h2 style="color: #002D5B; font-size: 16px; margin-top: 30px; margin-bottom: 15px;">5. RECOMENDAÇÕES</h2>
        <p style="margin: 0 0 20px 0;">{{recommendations}}</p>
        
        <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #D4AF37;">
            <p style="margin: 0 0 40px 0;">Local e data: {{location}}, {{date}}</p>
            <div>
                <p style="margin: 0 0 50px 0;">_____________________________</p>
                <p style="margin: 0; font-weight: bold;">{{expertName}}</p>
                <p style="margin: 5px 0;">{{expertTitle}}</p>
                <p style="margin: 5px 0;">{{expertCredentials}}</p>
            </div>
        </div>
    </div>`,
    variables: ['requester', 'subject', 'date', 'opinionNumber', 'introduction', 'technicalAnalysis', 'considerations', 'conclusion', 'recommendations', 'location', 'expertName', 'expertTitle', 'expertCredentials']
  },

  // NOVO TEMPLATE - PROPOSTA COMERCIAL ASC
  'proposta-comercial-asc': {
    name: '📄 Proposta Comercial ASC',
    description: 'Template profissional para propostas de serviços de consultoria e auditoria',
    category: 'Documentos',
    html: `<div style="width:100%; background-color:#f0f2f5; padding:30px 0; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <table style="max-width:600px; margin:0 auto; background-color:#ffffff; border-spacing:0; border-radius:8px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1); position:relative;" cellpadding="0" cellspacing="0" border="0">
            <!-- Detalhe Superior -->
            <tr><td style="height:6px; background:linear-gradient(90deg, #002D5B 0%, #004a94 100%);"></td></tr>
            
            <!-- Cabeçalho Compacto -->
            <tr>
                <td style="background-color:#ffffff; padding:15px 20px; text-align:center; border-bottom:4px solid #D4AF37;">
                    <img src="{{logoUrl}}" alt="{{empresa}}" style="max-width:160px; height:auto; display:block; margin:0 auto;" class="logo-img">
                </td>
            </tr>

            <!-- Conteúdo da Proposta -->
            <tr>
                <td style="padding:40px 40px 20px 40px; line-height:1.8; background-image:linear-gradient(135deg, #ffffff 85%, #f9f9f9 85%);">
                    <div style="display:inline-block; width:40px; height:4px; background-color:#D4AF37; margin-bottom:15px;"></div>
                    <h2 style="color:#002D5B; font-size:22px; margin:0 0 20px 0; font-weight:700; letter-spacing:-0.5px; text-transform:uppercase;">Proposta Comercial</h2>
                    
                    <div style="font-size:15px; color:#444444;">
                        <p>Prezado Sr. <strong>{{clienteNome}}</strong>,</p>
                        
                        <p>Submetemos à vossa apreciação a proposta da <strong>{{empresaConsultora}}</strong> referente aos serviços de assessoria técnica para elaboração de demonstrações financeiras da <strong>{{empresaCliente}}</strong>.</p>
                        
                        <p>{{introducao}}</p>
                    </div>

                    <!-- Destaques Metodologia -->
                    <div style="background-color:#fdfaf0; border-left:4px solid #D4AF37; padding:20px; margin:25px 0; border-radius:2px;">
                        <span style="color:#002D5B; font-weight:bold; font-size:14px; display:block; margin-bottom:10px; text-transform:uppercase;">Metodologia Estratégica ASC:</span>
                        <ul style="margin:0; padding-left:20px; font-size:13px; color:#555555;">
                            {{#each metodologiaItens}}
                            <li>{{this}}</li>
                            {{/each}}
                        </ul>
                    </div>

                    <p style="font-size:14px; color:#444444;">{{corpoAdicional}}</p>

                    <!-- CTA -->
                    <div style="text-align:center; margin:30px 0;">
                        <a href="mailto:{{emailContato}}" style="background-color:#002D5B; color:#ffffff !important; padding:16px 32px; text-decoration:none; border-radius:2px; font-weight:bold; font-size:12px; display:inline-block; letter-spacing:1.5px; text-transform:uppercase; border:1px solid #002D5B;">Solicitar Reunião de Alinhamento</a>
                    </div>
                </td>
            </tr>

            <!-- Assinatura -->
            <tr>
                <td style="margin-top:30px; padding:25px 40px; background-color:#fdfdfd; border-top:1px solid #eeeeee;">
                    <table style="width:100%; border-spacing:0;">
                        <tr>
                            <td align="left" valign="middle">
                                <p style="font-size:18px; font-weight:bold; color:#002D5B; margin:0;">{{consultorNome}}</p>
                                <p style="color:#D4AF37; font-size:13px; font-weight:bold; margin:2px 0 10px 0; text-transform:uppercase;">{{consultorTitulo}}</p>
                                <div style="color:#666666; font-size:11px; line-height:1.5;">
                                    <strong>{{empresaConsultora}}</strong><br>
                                    {{endereco}}<br>
                                    {{cidade}} | CEP {{cep}}<br>
                                    Tel: {{telefone}}<br>
                                    <a href="mailto:{{emailConsultor}}" style="color:#002D5B; text-decoration:none;">{{emailConsultor}}</a>
                                </div>
                            </td>
                            <td align="right" valign="middle" style="width:110px;">
                                <img src="{{fotoConsultor}}" alt="{{consultorNome}}" style="width:90px; height:90px; border-radius:50%; border:2px solid #D4AF37; display:block; object-fit:cover;">
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Rodapé Profissional -->
            <tr>
                <td style="padding:30px; text-align:center; font-size:10px; color:#ffffff; background-color:#002D5B;">
                    <div style="background-color:#D4AF37; color:#ffffff; font-size:9px; padding:4px 10px; display:inline-block; margin-bottom:15px; font-weight:bold; border-radius:2px;">VALIDADE DA PROPOSTA: {{dataValidade}}</div>
                    <p style="margin:0; letter-spacing:1.5px; font-weight:bold; text-transform:uppercase;">{{empresaConsultora}}</p>
                    <p style="margin:10px 0 0; opacity:0.7; line-height:1.4; font-size:9px; text-align:justify; padding:0 40px;">
                        <strong>AVISO DE CONFIDENCIALIDADE:</strong> Esta mensagem e seus anexos são destinados exclusivamente ao destinatário. Se você não for o destinatário pretendido, qualquer uso, divulgação ou cópia é proibido.
                    </p>
                </td>
            </tr>
        </table>
    </div>`,
    variables: [
        'logoUrl',
        'empresa',
        'clienteNome',
        'empresaConsultora',
        'empresaCliente',
        'introducao',
        'metodologiaItens',      // array JSON
        'corpoAdicional',
        'emailContato',
        'consultorNome',
        'consultorTitulo',
        'endereco',
        'cidade',
        'cep',
        'telefone',
        'emailConsultor',
        'fotoConsultor',
        'dataValidade'
    ]
  }
};