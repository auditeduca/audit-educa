import { ExternalLink, BookOpen, Code2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function APIDocumentation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Documentação da API</h3>
            <p className="text-sm text-slate-500">Banco Central do Brasil - PTAX</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          {isOpen ? '−' : '+'}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          {/* About API */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              Sobre a API Olinda
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              A API Olinda é o serviço de dados abertos do Banco Central do Brasil que fornece
              informações sobre cotações de moedas estrangeiras (PTAX). Os dados são atualizados
              diariamente e representam as médias das taxas de compra e venda praticadas no
              mercado interbancário.
            </p>
          </div>

          {/* Key Information */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-green-600" />
              Informações Técnicas
            </h4>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm font-mono">
              <div>
                <span className="text-slate-500">Base URL:</span>
                <br />
                <span className="text-slate-900">
                  https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata
                </span>
              </div>
              <div>
                <span className="text-slate-500">Formato:</span>
                <br />
                <span className="text-slate-900">JSON, XML, CSV</span>
              </div>
              <div>
                <span className="text-slate-500">Autenticação:</span>
                <br />
                <span className="text-slate-900">Não requerida (API pública)</span>
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-2">Endpoints Principais</h4>
            <div className="space-y-2 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="font-mono text-slate-900 mb-1">
                  /Moedas
                </p>
                <p className="text-slate-600">Lista todas as moedas disponíveis</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="font-mono text-slate-900 mb-1">
                  /CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)
                </p>
                <p className="text-slate-600">Cotação de uma moeda em uma data específica</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="font-mono text-slate-900 mb-1">
                  /CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)
                </p>
                <p className="text-slate-600">Cotações de uma moeda em um período</p>
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Links Úteis</h4>
            <div className="space-y-2">
              <a
                href="https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Swagger - Documentação Interativa
              </a>

              <a
                href="https://dadosabertos.bcb.gov.br/dataset/taxas-de-cambio-todos-os-boletins-diarios"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-green-600 font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Portal de Dados Abertos BCB
              </a>

              <a
                href="https://www.bcb.gov.br/estabilidadefinanceira/cotacoestodas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-purple-600 font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Cotações Oficiais - Site BCB
              </a>

              <a
                href="https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-amber-600 font-semibold"
              >
                <ExternalLink className="w-4 h-4" />
                Histórico de Cotações
              </a>
            </div>
          </div>

          {/* Data Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>ℹ️ Informação Importante:</strong> Os dados de cotação são atualizados
              diariamente pelo Banco Central do Brasil. A cotação PTAX (Preço de Fechamento)
              representa a média das taxas de compra e venda praticadas no mercado interbancário
              até as 16h30.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
