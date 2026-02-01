# 💱 Cotação de Moedas - API Olinda BCB

Aplicação web profissional para consulta de cotações de moedas em tempo real usando a **API Olinda do Banco Central do Brasil**. Oferece visualização de cotações atuais, análise de série histórica com gráficos interativos, conversor de moedas e exportação de dados em múltiplos formatos.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Funcionalidades Principais

### 📊 Página de Cotações
- **75+ moedas** com dados oficiais PTAX do Banco Central
- **Filtros regionais**: Américas, Europa, Ásia, África
- **Busca em tempo real** por código ou nome de moeda
- **Bandeiras de países** para identificação visual
- **Indicadores de variação** de preço

### 📈 Série Histórica
- **Gráficos interativos** com Recharts
- **Seleção de período** customizável
- **Estatísticas**: máximo, mínimo, média
- **Exportação de dados** em múltiplos formatos
- **Integração com Power BI**

### 💱 Conversor de Moedas
- Conversão entre **qualquer par de moedas**
- Baseado em **cotação de fechamento (PTAX)**
- Suporte a **Real Brasileiro (BRL)**
- Cálculo em **tempo real**

### 📥 Exportação de Dados
- **CSV** para análise em ferramentas
- **Excel (XLSX)** com formatação profissional
- **PDF** com layout imprimível
- **JSON** para Power BI

### 📚 Documentação
- Links para **Swagger** da API
- Portal de **Dados Abertos do BCB**
- Site oficial do **Banco Central**
- Histórico de cotações

## 🛠️ Tecnologias

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **React** | 19 | Framework UI |
| **TypeScript** | 5.6 | Tipagem estática |
| **Tailwind CSS** | 4 | Estilos |
| **Recharts** | 2.15 | Gráficos |
| **Vite** | 7.1 | Build tool |
| **Wouter** | 3.3 | Roteamento |
| **jsPDF** | 4.0 | Exportação PDF |
| **XLSX** | 0.18 | Exportação Excel |

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ ou pnpm 10+
- Git

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/moedas-cotacao.git
cd moedas-cotacao

# 2. Instale as dependências
pnpm install

# 3. Execute em desenvolvimento
pnpm dev

# 4. Abra no navegador
# http://localhost:3000
```

## 🚀 Build e Deploy

### Build para Produção

```bash
# Compilar React → HTML/CSS/JS estático
pnpm build

# Resultado em: dist/public/
```

### Deploy em Diferentes Plataformas

#### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist/public
```

#### GitHub Pages
```bash
pnpm build
git add dist/
git commit -m "Build: atualizar versão de produção"
git push
```

## 📁 Estrutura do Projeto

```
moedas-cotacao/
├── client/
│   ├── public/                  # Assets estáticos
│   │   ├── index.html          # HTML principal
│   │   └── images/             # Imagens
│   ├── src/
│   │   ├── pages/              # Componentes de página
│   │   │   ├── Quotes.tsx      # Cotações
│   │   │   ├── Historical.tsx  # Série histórica
│   │   │   ├── Converter.tsx   # Conversor
│   │   │   └── About.tsx       # Sobre
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── CurrencyCard.tsx
│   │   │   ├── ExportButtons.tsx
│   │   │   └── APIDocumentation.tsx
│   │   ├── hooks/              # Hooks customizados
│   │   │   └── useCurrencyQuotes.ts
│   │   ├── lib/                # Utilitários
│   │   │   ├── currencies.ts
│   │   │   └── export.ts
│   │   ├── App.tsx             # Componente raiz
│   │   ├── main.tsx            # Ponto de entrada
│   │   └── index.css           # Estilos globais
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🌐 Roteamento

A aplicação usa **Wouter** para roteamento no cliente (SPA - Single Page Application):

| Rota | Página |
|------|--------|
| `/` | Cotações em tempo real |
| `/historico` | Série histórica com gráficos |
| `/conversor` | Conversor de moedas |
| `/sobre` | Informações e documentação |

## 📚 API Olinda - Documentação

### O que é?
A API Olinda é o serviço de dados abertos do Banco Central do Brasil que fornece informações sobre cotações de moedas estrangeiras (PTAX - Preço de Fechamento).

### Características
- ✅ Dados oficiais do Banco Central
- ✅ Atualizações diárias
- ✅ 75+ moedas disponíveis
- ✅ Histórico de cotações
- ✅ API pública (sem autenticação)

### Links Úteis
- 🔗 [Swagger - Documentação Interativa](https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2)
- 🔗 [Portal de Dados Abertos BCB](https://dadosabertos.bcb.gov.br/dataset/taxas-de-cambio-todos-os-boletins-diarios)
- 🔗 [Cotações Oficiais - Site BCB](https://www.bcb.gov.br/estabilidadefinanceira/cotacoestodas)
- 🔗 [Histórico de Cotações](https://www.bcb.gov.br/estabilidadefinanceira/historicocotacoes)

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview

# Verificar tipos TypeScript
pnpm check

# Formatar código
pnpm format
```

### Adicionar Novas Páginas

1. Crie um arquivo em `client/src/pages/NovaPage.tsx`
2. Adicione a rota em `client/src/App.tsx`:
```tsx
<Route path={"/nova-rota"} component={NovaPage} />
```

### Adicionar Novos Componentes

1. Crie em `client/src/components/NovoComponente.tsx`
2. Importe e use em qualquer página

## 🎨 Design

- **Design System**: Fintech Minimalist
- **Tipografia**: Poppins (títulos) + Inter (UI) + IBM Plex Mono (números)
- **Cores**: Azul profundo (#1E3A8A), Ouro (#D4AF37), Neutros
- **Layout**: Responsivo (mobile-first)
- **Animações**: Transições suaves e hover effects elegantes

## 📊 Exportação de Dados

### CSV
Formato simples para importação em qualquer ferramenta

### Excel
Arquivo XLSX com formatação profissional e colunas ajustadas

### PDF
Relatório imprimível com header, tabelas e footer

### Power BI
JSON estruturado com metadados e estatísticas para integração

## 🔒 Segurança

- Sem armazenamento de dados sensíveis
- Sem autenticação necessária (dados públicos)
- CORS habilitado para API Olinda
- Variáveis de ambiente para configurações

## ❓ FAQ

**P: Onde estão os arquivos HTML das páginas?**
R: Não existem arquivos HTML separados. É um SPA (Single Page Application) que usa React para renderizar diferentes "páginas" dinamicamente.

**P: Como adicionar novas moedas?**
R: A lista de moedas vem da API Olinda. Basta adicionar o código em `client/src/lib/currencies.ts` se quiser filtros customizados.

**P: Posso usar sem Node.js?**
R: Sim! Após `pnpm build`, a pasta `dist/public/` contém apenas HTML/CSS/JS estático.

**P: Como fazer deploy sem Manus?**
R: Execute `pnpm build` e suba a pasta `dist/public/` para qualquer hosting estático (Vercel, Netlify, GitHub Pages, etc).

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar documentação
- Enviar pull requests

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👤 Autor

Desenvolvido com ❤️ usando React, TypeScript e dados públicos do Banco Central do Brasil.

## 📞 Suporte

Para dúvidas sobre a API Olinda, consulte:
- [Documentação Oficial BCB](https://www.bcb.gov.br)
- [Portal de Dados Abertos](https://dadosabertos.bcb.gov.br)
- [Issues do Repositório](https://github.com/seu-usuario/moedas-cotacao/issues)

---

**Última atualização**: Fevereiro 2026
