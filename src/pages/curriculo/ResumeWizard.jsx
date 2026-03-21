import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Plus, Trash2, Download, FileText, 
  CheckCircle, Palette, User, Activity, Briefcase, GraduationCap,
  Award, Globe, Zap
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProgressBar from '../../components/ui/ProgressBar';
import SectionHeader from '../../components/ui/SectionHeader';
import FormField from '../../components/forms/FormField';
import TemplateSelector from './components/TemplateSelector';
import ColorPicker from './components/ColorPicker';
import ResumePreview from './components/ResumePreview';

// Schema do currículo
const resumeSchema = {
  sections: [
    {
      sectionId: "personal",
      sectionTitle: "Dados Pessoais",
      badge: "Identidade",
      icon: "User",
      fields: [
        { id: "full_name", label: "Nome Completo", type: "text", placeholder: "Ex: João Silva", required: true },
        { id: "email", label: "E-mail Profissional", type: "email", placeholder: "joao@email.com", required: true },
        { id: "phone", label: "Telemóvel / WhatsApp", type: "tel", placeholder: "+351 912 345 678", required: true },
        { id: "location", label: "Localidade (Cidade, País)", type: "text", placeholder: "Lisboa, Portugal", required: true },
        { id: "professional_license", label: "Cédula Profissional / Registro", type: "text", placeholder: "Ex: Ordem dos Contabilistas 12345", required: false },
        { id: "has_photo", label: "Incluir Foto no Currículo?", type: "checkbox", defaultValue: false }
      ]
    },
    {
      sectionId: "professional_summary",
      sectionTitle: "Resumo Profissional",
      badge: "Bio",
      icon: "Activity",
      fields: [
        { id: "summary_text", label: "Sua Biografia Profissional", type: "textarea", placeholder: "Fale sobre sua experiência, competências e objetivos profissionais...", required: true }
      ]
    },
    {
      sectionId: "experience",
      sectionTitle: "Experiência Profissional",
      badge: "Carreira",
      icon: "Briefcase",
      type: "dynamic_list",
      itemTemplate: [
        { id: "company", label: "Empresa / Organização", type: "text", required: true },
        { id: "position", label: "Cargo", type: "text", required: true },
        { id: "start_date", label: "Início", type: "month", required: true },
        { id: "end_date", label: "Fim", type: "month", required: false },
        { id: "description", label: "Atividades e Conquistas", type: "textarea", required: true }
      ]
    },
    {
      sectionId: "education",
      sectionTitle: "Formação Académica",
      badge: "Academia",
      icon: "GraduationCap",
      type: "dynamic_list",
      itemTemplate: [
        { id: "institution", label: "Instituição", type: "text", required: true },
        { id: "degree", label: "Curso / Especialização", type: "text", required: true },
        { id: "completion_year", label: "Ano Conclusão", type: "number", required: true }
      ]
    },
    {
      sectionId: "skills",
      sectionTitle: "Competências e Habilidades",
      badge: "Skills",
      icon: "Zap",
      type: "dynamic_list",
      itemTemplate: [
        { id: "skill_name", label: "Competência", type: "text", required: true },
        { id: "proficiency", label: "Nível de Proficiência", type: "select", required: true, options: ["Básico", "Intermediário", "Avançado", "Especialista"] }
      ]
    },
    {
      sectionId: "certifications",
      sectionTitle: "Certificações e Prêmios",
      badge: "Certs",
      icon: "Award",
      type: "dynamic_list",
      itemTemplate: [
        { id: "cert_name", label: "Certificação / Prêmio", type: "text", required: true },
        { id: "issuer", label: "Entidade Emissora", type: "text", required: true },
        { id: "cert_year", label: "Ano", type: "number", required: true }
      ]
    },
    {
      sectionId: "languages",
      sectionTitle: "Idiomas",
      badge: "Línguas",
      icon: "Globe",
      type: "dynamic_list",
      itemTemplate: [
        { id: "language", label: "Idioma", type: "text", required: true },
        { id: "proficiency", label: "Nível de Proficiência", type: "select", required: true, options: ["Básico", "Intermediário", "Avançado", "Nativo"] }
      ]
    }
  ]
};

// Mapeamento de ícones (para uso com o componente SectionHeader)
import * as Icons from 'lucide-react';
function Icon({ name, className }) {
  const LucideIcon = Icons[name] || Icons.HelpCircle;
  return <LucideIcon className={className} />;
}

export default function ResumeWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customColor, setCustomColor] = useState('#1D4ED8');

  // Inicializar template padrão
  useEffect(() => {
    setSelectedTemplate({
      id: 'modern',
      name: 'Moderno Auditor',
      color: '#1D4ED8',
      font: 'sans',
      desc: 'Layout limpo e dinâmico'
    });
  }, []);

  // Carregar dados salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('audit_educa_resume_data');
    if (saved) setFormData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('audit_educa_resume_data', JSON.stringify(formData));
  }, [formData]);

  const totalSteps = 2 + resumeSchema.sections.length + 1; // template + seções + final

  const updateField = (sectionId, fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [fieldId]: value }
    }));
  };

  const addListItem = (sectionId) => {
    const section = resumeSchema.sections.find(s => s.sectionId === sectionId);
    const newItem = {};
    section.itemTemplate.forEach(f => newItem[f.id] = "");
    setFormData(prev => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), newItem]
    }));
  };

  const updateListItem = (sectionId, index, fieldId, value) => {
    const newList = [...(formData[sectionId] || [])];
    newList[index][fieldId] = value;
    setFormData(prev => ({ ...prev, [sectionId]: newList }));
  };

  const removeListItem = (sectionId, index) => {
    const newList = [...(formData[sectionId] || [])];
    newList.splice(index, 1);
    setFormData(prev => ({ ...prev, [sectionId]: newList }));
  };

  // ========== FUNÇÕES DE EXPORTAÇÃO ==========
  const generateResumeHTML = () => {
    const personal = formData.personal || {};
    const summary = formData.professional_summary || {};
    const experience = formData.experience || [];
    const education = formData.education || [];
    const skills = formData.skills || [];
    const certifications = formData.certifications || [];
    const languages = formData.languages || [];

    const fontFamily = selectedTemplate.font === 'serif' ? 'Georgia, serif' : 'Inter, sans-serif';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Currículo - ${personal.full_name || 'Sem nome'}</title>
        <style>
          body {
            font-family: ${fontFamily};
            margin: 0;
            padding: 2cm;
            color: #1e293b;
            line-height: 1.5;
          }
          .header {
            border-bottom: 2px solid ${customColor};
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: start;
          }
          .name {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0 0 0.5rem 0;
          }
          .location {
            color: ${customColor};
            font-size: 1.2rem;
            font-weight: 500;
          }
          .contact {
            font-size: 0.9rem;
            color: #64748b;
            margin-top: 0.5rem;
          }
          .section-title {
            font-size: 1.1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: ${customColor};
            margin: 2rem 0 1rem 0;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 0.5rem;
          }
          .job, .edu, .skill, .cert, .lang {
            margin-bottom: 1.5rem;
          }
          .job-header, .edu-header {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
          }
          .company, .institution {
            color: #0f172a;
          }
          .date {
            color: #64748b;
            font-size: 0.9rem;
          }
          .description {
            margin-top: 0.5rem;
            color: #334155;
            font-size: 0.95rem;
            white-space: pre-wrap;
          }
          .skills-grid, .languages-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .skill-item, .lang-item {
            background: #f8fafc;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            border: 1px solid #e2e8f0;
          }
          .skill-name, .lang-name {
            font-weight: 600;
          }
          .skill-level, .lang-level {
            font-size: 0.85rem;
            color: ${customColor};
          }
          .cert-item, .lang-item {
            margin-bottom: 1rem;
          }
          .footer-note {
            margin-top: 3rem;
            text-align: center;
            font-size: 0.8rem;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 1rem;
          }
          @media print {
            body { padding: 1.5cm; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="name">${personal.full_name || 'Nome Completo'}</h1>
            <div class="location">${personal.location || ''}</div>
            <div class="contact">
              ${personal.email ? `<div>✉️ ${personal.email}</div>` : ''}
              ${personal.phone ? `<div>📞 ${personal.phone}</div>` : ''}
            </div>
          </div>
          ${personal.professional_license ? `<div style="background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 2rem; font-size:0.8rem; font-weight:bold;">${personal.professional_license}</div>` : ''}
        </div>

        ${summary.summary_text ? `
          <div>
            <h2 class="section-title">Resumo Profissional</h2>
            <p style="white-space: pre-wrap;">${summary.summary_text}</p>
          </div>
        ` : ''}

        ${experience.length > 0 ? `
          <div>
            <h2 class="section-title">Experiência Profissional</h2>
            ${experience.map(exp => `
              <div class="job">
                <div class="job-header">
                  <span class="company">${exp.position} — ${exp.company}</span>
                  <span class="date">${exp.start_date} – ${exp.end_date || 'Presente'}</span>
                </div>
                <div class="description">${exp.description}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education.length > 0 ? `
          <div>
            <h2 class="section-title">Formação Académica</h2>
            ${education.map(edu => `
              <div class="edu">
                <div class="job-header">
                  <span class="institution">${edu.degree} — ${edu.institution}</span>
                  <span class="date">${edu.completion_year}</span>
                </div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills.length > 0 ? `
          <div>
            <h2 class="section-title">Competências</h2>
            <div class="skills-grid">
              ${skills.map(skill => `
                <div class="skill-item">
                  <div class="skill-name">${skill.skill_name}</div>
                  <div class="skill-level">${skill.proficiency}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${certifications.length > 0 ? `
          <div>
            <h2 class="section-title">Certificações</h2>
            ${certifications.map(cert => `
              <div class="cert-item">
                <strong>${cert.cert_name}</strong> – ${cert.issuer} (${cert.cert_year})
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${languages.length > 0 ? `
          <div>
            <h2 class="section-title">Idiomas</h2>
            <div class="languages-grid">
              ${languages.map(lang => `
                <div class="lang-item">
                  <div class="lang-name">${lang.language}</div>
                  <div class="lang-level">${lang.proficiency}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div class="footer-note">
          Gerado por Audit Educa – Plataforma Técnica de Auditoria
        </div>
      </body>
      </html>
    `;
  };

  const handleExportPDF = () => {
    const html = generateResumeHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } else {
      alert('Por favor, permita pop-ups para exportar o PDF.');
    }
  };

  const handleExportWord = () => {
    const html = generateResumeHTML();
    const blob = new Blob([html], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `curriculo_${formData.personal?.full_name?.replace(/\s+/g, '_') || 'audit_educa'}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Renderização das seções dinâmicas
  const renderSectionFields = (section) => {
    const isList = section.type === 'dynamic_list';
    const data = formData[section.sectionId] || (isList ? [] : {});

    if (isList) {
      return (
        <div className="space-y-6">
          {data.map((item, idx) => (
            <div key={idx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 relative group">
              <button 
                onClick={() => removeListItem(section.sectionId, idx)}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.itemTemplate.map(f => (
                  <FormField key={f.id} label={f.label} required={f.required} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
                    {f.type === 'textarea' ? (
                      <textarea 
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-28 text-sm"
                        value={item[f.id] || ""}
                        onChange={(e) => updateListItem(section.sectionId, idx, f.id, e.target.value)}
                      />
                    ) : f.type === 'select' ? (
                      <select 
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        value={item[f.id] || ""}
                        onChange={(e) => updateListItem(section.sectionId, idx, f.id, e.target.value)}
                      >
                        <option value="">Selecione...</option>
                        {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : (
                      <input 
                        type={f.type}
                        className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                        value={item[f.id] || ""}
                        onChange={(e) => updateListItem(section.sectionId, idx, f.id, e.target.value)}
                      />
                    )}
                  </FormField>
                ))}
              </div>
            </div>
          ))}
          <button 
            onClick={() => addListItem(section.sectionId)}
            className="w-full p-6 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold"
          >
            <Plus className="w-5 h-5" /> Adicionar {section.sectionTitle}
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {section.fields.map(f => (
          <FormField key={f.id} label={f.label} required={f.required} className={f.type === 'textarea' ? 'md:col-span-2' : ''}>
            {f.type === 'textarea' ? (
              <textarea 
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-32 text-sm"
                placeholder={f.placeholder}
                value={formData[section.sectionId]?.[f.id] || ""}
                onChange={(e) => updateField(section.sectionId, f.id, e.target.value)}
              />
            ) : f.type === 'checkbox' ? (
              <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-100">
                <input 
                  type="checkbox"
                  checked={formData[section.sectionId]?.[f.id] || false}
                  onChange={(e) => updateField(section.sectionId, f.id, e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600"
                />
                <span className="text-sm font-medium text-slate-600">{f.placeholder || 'Ativar opção'}</span>
              </label>
            ) : (
              <input 
                type={f.type}
                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder={f.placeholder}
                value={formData[section.sectionId]?.[f.id] || ""}
                onChange={(e) => updateField(section.sectionId, f.id, e.target.value)}
              />
            )}
          </FormField>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-grow pt-6">
        {/* Barra de Progresso */}
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <ProgressBar progress={(step / (totalSteps - 1)) * 100} />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Lado Esquerdo: Formulário */}
            <div className="flex-1">
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
                
                {/* Passo 1: Template */}
                {step === 1 && selectedTemplate && (
                  <>
                    <TemplateSelector 
                      selectedTemplate={selectedTemplate} 
                      onSelect={(t) => { setSelectedTemplate(t); setCustomColor(t.color); }} 
                    />
                    <ColorPicker selectedColor={customColor} onChange={setCustomColor} />
                  </>
                )}

                {/* Passos das Seções */}
                {step > 1 && step < totalSteps - 1 && (
                  (() => {
                    const section = resumeSchema.sections[step - 2];
                    if (!section) return null;
                    return (
                      <div className="animate-in slide-in-from-right-10 duration-500">
                        <SectionHeader 
                          icon={() => <Icon name={section.icon} className="w-4 h-4" />} 
                          title={section.sectionTitle} 
                          badge={section.badge} 
                        />
                        {renderSectionFields(section)}
                      </div>
                    );
                  })()
                )}

                {/* Passo Final */}
                {step === totalSteps - 1 && (
                  <div className="text-center py-10 animate-in zoom-in-95 duration-500">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-6">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Currículo Finalizado!</h2>
                    <p className="text-slate-600 mb-10 max-w-md mx-auto">Seu documento está pronto para ser exportado.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={handleExportPDF}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                      >
                        <Download className="w-5 h-5" /> Exportar PDF
                      </button>
                      <button 
                        onClick={handleExportWord}
                        className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                      >
                        <FileText className="w-5 h-5" /> Exportar Word
                      </button>
                    </div>
                  </div>
                )}

                {/* Navegação */}
                <div className="mt-12 flex justify-between items-center border-t border-slate-100 pt-8">
                  <button 
                    onClick={() => {
                      if (step === 1) window.location.href = '/curriculo';
                      else setStep(prev => prev - 1);
                    }}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> {step === 1 ? 'Sair' : 'Anterior'}
                  </button>
                  {step < totalSteps - 1 && (
                    <button 
                      onClick={() => setStep(prev => prev + 1)}
                      className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                      Próximo <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lado Direito: Preview */}
            {selectedTemplate && (
              <div className="lg:w-[450px] hidden lg:block">
                <ResumePreview 
                  template={selectedTemplate} 
                  color={customColor} 
                  formData={formData} 
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}