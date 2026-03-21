export const propostaComercialAsc = {
  name: '📄 Proposta Comercial ASC',
  description: 'Template profissional para propostas de serviços de consultoria e auditoria',
  category: 'Documentos',
  html: `<div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width:600px; margin:0 auto;">
    <div style="background: linear-gradient(135deg, #002D5B 0%, #004a94 100%); padding:40px 20px; text-align:center;">
        <h1 style="color:white; margin:0; font-size:36px;">ASC</h1>
        <div style="width:60px; height:3px; background:#D4AF37; margin:15px auto;"></div>
        <h2 style="color:white; margin:0; font-size:24px;">Proposta Comercial</h2>
    </div>
    <div style="padding:40px; background:white;">
        <p>Prezado(a) <strong>{{clienteNome}}</strong>,</p>
        <p>{{introducao}}</p>
        <div style="background:#f5f5f5; border-left:4px solid #D4AF37; padding:20px; margin:30px 0;">
            <h3 style="margin:0 0 10px; color:#002D5B;">Detalhes da Proposta</h3>
            <p><strong>Serviço:</strong> {{servico}}</p>
            <p><strong>Valor:</strong> R$ {{valor}}</p>
            <p><strong>Prazo:</strong> {{prazo}}</p>
        </div>
        <p>{{corpoAdicional}}</p>
        <div style="text-align:center; margin:40px 0;">
            <a href="mailto:{{emailContato}}" style="background:#002D5B; color:white; padding:15px 30px; text-decoration:none; border-radius:4px;">Solicitar Reunião</a>
        </div>
        <div style="border-top:2px solid #D4AF37; padding-top:20px;">
            <p style="margin:0;"><strong>{{consultorNome}}</strong></p>
            <p style="margin:5px 0;">{{consultorTitulo}}</p>
            <p style="margin:5px 0;">{{empresa}}</p>
        </div>
    </div>
</div>`,
  variables: ['clienteNome', 'introducao', 'servico', 'valor', 'prazo', 'corpoAdicional', 'emailContato', 'consultorNome', 'consultorTitulo', 'empresa']
};