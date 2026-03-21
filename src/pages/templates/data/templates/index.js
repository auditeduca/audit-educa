import { emailSignature } from './email-signature';
import { proposal } from './proposal';
import { businessCardPrint } from './business-card-print';
import { businessCardVirtual } from './business-card-virtual';
import { letterhead } from './letterhead';
import { reportCover } from './report-cover';
import { nda } from './nda';
import { serviceContract } from './service-contract';
import { auditReport } from './audit-report';
import { finalReport } from './final-report';
import { presentation } from './presentation';
import { accountingProposal } from './accounting-proposal';
import { projectCharter } from './project-charter';
import { technicalOpinion } from './technical-opinion';
import { propostaComercialAsc } from './proposta-comercial-asc';
import { propostaMotherson } from './proposta-motherson';

export const TEMPLATES = {
  'email-signature': emailSignature,
  'proposal': proposal,
  'business-card-print': businessCardPrint,
  'business-card-virtual': businessCardVirtual,
  'letterhead': letterhead,
  'report-cover': reportCover,
  'nda': nda,
  'service-contract': serviceContract,
  'audit-report': auditReport,
  'final-report': finalReport,
  'presentation': presentation,
  'accounting-proposal': accountingProposal,
  'project-charter': projectCharter,
  'technical-opinion': technicalOpinion,
  'proposta-comercial-asc': propostaComercialAsc,
  'proposta-motherson': propostaMotherson,
};