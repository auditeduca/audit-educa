import { useLocation } from 'wouter';
import { ArrowLeft, ExternalLink, BookOpen, Code2, Download } from 'lucide-react';

export default function About() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Sobre</h1>
              <p className="text-sm text-slate-500">Informações sobre a aplicação</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Application Info */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Cotação de Moedas - API Olinda</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Aplicação web profissional para consulta de cotações de moedas em tempo real usando a
            API Olinda do Banco Central do Brasil. Oferece visualização de cotações atuais, análise
            de série histórica com gráficos interativos, conversor de moedas e exportação de dados
            em múltiplos formatos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Tecnologias
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• React 19</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS 4</li>
                <li>• Recharts</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportação
              </h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• CSV</li>
                <li>• Excel (XLSX)</li>
                <li>• PDF</li>
                <li>• Power BI</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Funcionalidades
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• 75+ moedas</li>
                <li>• Filtros regionais</li>
                <li>• Série histórica</li>
                <li>• Conversor</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API Information */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Sobre a API Olinda
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-2">O que é?</h3>
              <p className="text-slate-600 leading-relaxed">
                A API Olinda é o serviço de dados abertos do Banco Central do Brasil que fornece
                informações sobre cotações de moedas estrangeiras (PTAX - Preço de Fechamento).
                Todos os dados são públicos e atualizados diariamente.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Características</h3>
              <ul className="text-slate-600 space-y-2">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Dados oficiais do Banco Central do Brasil</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Atualizações diárias de cotações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Mais de 75 moedas disponíveis</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Histórico de cotações</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>API pública - sem autenticação necessária</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-2">Cotação PTAX</h3>
              <p className="text-slate-600 leading-relaxed">
                A PTAX é a taxa de câmbio média praticada no mercado interbancário até as 16h30,
                calculada e divulgada diariamente pelo Banco Central. Representa a média das taxas
                de compra e venda de moedas estrangeiras em relação ao Real.
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Documentação Técnica</h2>

          <div className="space-y-3">
            <a
              href="https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            >
              <div>
                <h3 className="font-bold text-blue-900">Swagger - Documentação Interativa</h3>
                <p className="text-sm text-blue-700">Explore os endpoints da API com exemplos</p>
              </div>
              <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />
            </a>

            <a
              href="https://dadosabertos.bcb.gov.br/dataset/taxas-de-cambio-todos-os-boletins-diarios"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
            >
              <div>
                <h3 className="font-bold text-green-900">Portal de Dados Abertos BCB</h3>
                <p className="text-sm text-green-700">Acesse todos os dados públicos do Banco Central</p>
              </div>
              <ExternalLink className="w-5 h-5 text-green-600 flex-shrink-0" />
            </a>

            <a
              href="https://www.bcb.gov.br/estabilidadefinanceira/cotacoestodas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200"
            >
              <div>
                <h3 className="font-bold text-purple-900">Cotações Oficiais - Site BCB</h3>
                <p className="text-sm text-purple-700">Consulte cotações no site oficial do Banco Central</p>
              </div>
              <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0" />
            </a>

            <a
              href="https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
            >
              <div>
                <h3 className="font-bold text-amber-900">Histórico de Cotações</h3>
                <p className="text-sm text-amber-700">Acesse o histórico completo de cotações</p>
              </div>
              <ExternalLink className="w-5 h-5 text-amber-600 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Funcionalidades</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Página de Cotações</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>✓ Visualização de todas as moedas em tempo real</li>
                <li>✓ Filtros por região (Américas, Europa, Ásia, África)</li>
                <li>✓ Busca por código ou nome de moeda</li>
                <li>✓ Bandeiras de países</li>
                <li>✓ Indicadores de variação</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Série Histórica</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>✓ Gráficos interativos com Recharts</li>
                <li>✓ Seleção de período customizável</li>
                <li>✓ Estatísticas (máximo, mínimo, média)</li>
                <li>✓ Exportação em múltiplos formatos</li>
                <li>✓ Integração com Power BI</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Conversor</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>✓ Conversão entre qualquer par de moedas</li>
                <li>✓ Baseado em cotação de fechamento</li>
                <li>✓ Suporte a Real Brasileiro (BRL)</li>
                <li>✓ Cálculo em tempo real</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 mb-3">Exportação</h3>
              <ul className="text-slate-600 space-y-2 text-sm">
                <li>✓ CSV para análise em ferramentas</li>
                <li>✓ Excel com formatação profissional</li>
                <li>✓ PDF com layout imprimível</li>
                <li>✓ JSON para Power BI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
