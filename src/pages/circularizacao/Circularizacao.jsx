// src/pages/circularizacao/Circularizacao.jsx
import React, { useState, useEffect } from 'react';
import Step1Setup from './components/Step1Setup';
import Step2Tipo from './components/Step2Tipo';
import Step3Textos from './components/Step3Textos';
import Step4Produtos from './components/Step4Produtos';
import Step5Dados from './components/Step5Dados';
import Step6Design from './components/Step6Design';
import Step7Destinatarios from './components/Step7Destinatarios';
import Step8Exportar from './components/Step8Exportar';
import ProgressBar from './components/ProgressBar';
import StepSidebar from './components/StepSidebar';
import { buildLetter } from '../../libs/letterBuilder';

const STORAGE_KEY = 'circularizacao_wizard';

export default function Circularizacao() {
  const [step, setStep] = useState(1);
  const [showStepsSidebar, setShowStepsSidebar] = useState(true);
  const [currentSection, setCurrentSection] = useState(null);

  const [formData, setFormData] = useState({
    lang: 'pt',
    mc: false,
    sTypes: [],
    selTpl: 'bank_std',
    customBody: '',
    bP: {},
    empresas: [{ nome: '', cnpj: '' }],
    firma: '',
    crc: '',
    tel: '',
    cep: '',
    fend: '',
    fcid: '',
    fuf: '',
    femails: '',
    db: '',
    dr: '',
    sign: [{ nome: '', cargo: '', doc: '' }],
    design: {
      accent: '#0C1B33',
      font: 'DM Sans',
      fontSize: 12,
      lineHeight: 1.6,
      headerStyle: 'solid',
      logoPosition: 'left',
      logoSize: 60,
      showTable: true,
      showConfidential: true,
      showNBC: true,
      logo: null,
    },
    recs: [],
    rf: { nome: '', empresa: '', email: '', saldo: '', end: '', cnpj: '' },
    filterTipo: '',
    ltrs: [],
    ed: {},
    ai: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
        if (parsed.step) setStep(parsed.step);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...formData, step }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData, step]);

  const updateFormData = (updates) => setFormData(prev => ({ ...prev, ...updates }));

  const nextStep = () => setStep(prev => Math.min(prev + 1, 8));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Setup lang={formData.lang} setLang={(lang) => updateFormData({ lang })} mc={formData.mc} setMC={(mc) => updateFormData({ mc })} onNext={nextStep} showToast={() => {}} />;
      case 2:
        return <Step2Tipo sTypes={formData.sTypes} setST={(sTypes) => updateFormData({ sTypes })} onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <Step3Textos sTypes={formData.sTypes} selTpl={formData.selTpl} setSelTpl={(selTpl) => updateFormData({ selTpl })} customBody={formData.customBody} setCustomBody={(customBody) => updateFormData({ customBody })} lang={formData.lang} buildL={buildLetter} onNext={nextStep} onBack={prevStep} showToast={() => {}} currentSection={currentSection} setCurrentSection={setCurrentSection} />;
      case 4:
        return <Step4Produtos bP={formData.bP} setBP={(bP) => updateFormData({ bP })} onNext={nextStep} onBack={prevStep} showToast={() => {}} />;
      case 5:
        return <Step5Dados empresas={formData.empresas} setEmpresas={(empresas) => updateFormData({ empresas })} firma={formData.firma} setFirma={(firma) => updateFormData({ firma })} crc={formData.crc} setCrc={(crc) => updateFormData({ crc })} tel={formData.tel} setTel={(tel) => updateFormData({ tel })} cep={formData.cep} setCep={(cep) => updateFormData({ cep })} fend={formData.fend} setFend={(fend) => updateFormData({ fend })} fcid={formData.fcid} setFcid={(fcid) => updateFormData({ fcid })} fuf={formData.fuf} setFuf={(fuf) => updateFormData({ fuf })} femails={formData.femails} setFemails={(femails) => updateFormData({ femails })} db={formData.db} setDb={(db) => updateFormData({ db })} dr={formData.dr} setDr={(dr) => updateFormData({ dr })} sign={formData.sign} setSign={(sign) => updateFormData({ sign })} onNext={nextStep} onBack={prevStep} />;
      case 6:
        return <Step6Design bP={formData.bP} setBP={(bP) => updateFormData({ bP })} sTypes={formData.sTypes} buildL={buildLetter} onNext={nextStep} onBack={prevStep} showToast={() => {}} currentSection={currentSection} setCurrentSection={setCurrentSection} />;
      case 7:
        return <Step7Destinatarios recs={formData.recs} setRecs={(recs) => updateFormData({ recs })} rf={formData.rf} setRf={(rf) => updateFormData({ rf })} allowsValue={formData.sTypes.includes('clientes')} sTypes={formData.sTypes} genAll={() => {}} onNext={nextStep} onBack={prevStep} showToast={() => {}} />;
      case 8:
        return <Step8Exportar ltrs={formData.ltrs} ed={formData.ed} setEd={(ed) => updateFormData({ ed })} ai={formData.ai} setAi={(ai) => updateFormData({ ai })} filterTipo={formData.filterTipo} setFilterTipo={(filterTipo) => updateFormData({ filterTipo })} sTypes={formData.sTypes} xWordLote={() => {}} xWordSingle={() => {}} xExcelLote={() => {}} xPrintAll={() => {}} xControl={() => {}} eRef={null} onBack={prevStep} currentSection={currentSection} setCurrentSection={setCurrentSection} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProgressBar currentStep={step} totalSteps={8} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          <StepSidebar
            show={showStepsSidebar}
            onToggle={() => setShowStepsSidebar(!showStepsSidebar)}
            currentStep={step}
          />
          <div className={`flex-1 transition-all duration-300 ${showStepsSidebar ? 'lg:ml-0' : ''}`}>
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}