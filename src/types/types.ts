/**
 * types.ts - Definições de tipos TypeScript para componente sobreNos
 * Garante type safety em todo o projeto
 */

// ============================================
// METADATA & SEO
// ============================================
export interface SeoMetadata {
  privacyPolicyUrl: string;
  termsOfServiceUrl: string;
  dataProcessorEmail: string;
}

export interface PageMeta {
  lastUpdated: string;
  publishedDate: string;
  version: string;
}

// ============================================
// LGPD COMPLIANCE
// ============================================
export interface LGPDConfig {
  consentText: string;
  dataRetention: string;
  purposes: string[];
  rights: string;
}

// ============================================
// CONTENT SECTIONS
// ============================================
export interface HistoricoData {
  titulo: string;
  texto: string;
  impactos: ImpactoItem[];
}

export interface ImpactoItem {
  value: string;
  label: string;
}

export interface MissaoVisaoItem {
  titulo: string;
  texto: string;
}

export interface ValorItem {
  nome: string;
  desc: string;
  icon: string;
}

export interface FAQItem {
  pergunta: string;
  resposta: string;
}

// ============================================
// FORM & SUGGESTIONS
// ============================================
export interface SugestoesConfig {
  titulo: string;
  descricao: string;
  placeholder: string;
  maxLength: number;
  minLength: number;
  successMessage: string;
  errorMessage: string;
  validationMessages: ValidationMessages;
}

export interface ValidationMessages {
  empty: string;
  tooShort: string;
  tooLong: string;
  requiresConsent: string;
}

// ============================================
// DATA ROOT
// ============================================
export interface SobreNosData {
  titulo: string;
  meta: PageMeta;
  seo: SeoMetadata;
  lgpd: LGPDConfig;
  historia: HistoricoData;
  missao: MissaoVisaoItem;
  visao: MissaoVisaoItem;
  valores: ValorItem[];
  faq: FAQItem[];
  sugestoes: SugestoesConfig;
}

// ============================================
// COMPONENT STATE
// ============================================
export interface SobreNosState {
  toastMessage: string | null;
  sugText: string;
  sugStatus: 'idle' | 'loading' | 'sent' | 'error';
  mobileMenuOpen: boolean;
  consentChecked: boolean;
}

export interface ToastMessage {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// ============================================
// CHARACTER COUNTER
// ============================================
export interface CharacterCountState {
  current: number;
  max: number;
  percentage: number;
  status: 'ok' | 'warning' | 'error';
  remainingChars: number;
}

// ============================================
// FORM VALIDATION
// ============================================
export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  customValidator?: (value: string) => boolean;
}

export interface FieldError {
  field: string;
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
}

export interface FormValidationState {
  isValid: boolean;
  errors: FieldError[];
  touched: Record<string, boolean>;
}

// ============================================
// API RESPONSE
// ============================================
export interface SendSuggestionPayload {
  text: string;
  consent: boolean;
  timestamp: string;
  userAgent?: string;
}

export interface SendSuggestionResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
}

// ============================================
// BREADCRUMB
// ============================================
export interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: string;
}

// ============================================
// STRUCTURED DATA (JSON-LD)
// ============================================
export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: {
    '@type': string;
    position: number;
    name: string;
    item: string;
  }[];
}

export interface AboutPageSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  isPartOf: {
    '@type': string;
    name: string;
    url: string;
  };
}

export interface FAQPageSchema {
  '@context': string;
  '@type': string;
  mainEntity: {
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }[];
}

export interface ArticleSchema {
  '@context': string;
  '@type': string;
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  author: {
    '@type': string;
    name: string;
  };
  publisher: {
    '@type': string;
    name: string;
  };
}
