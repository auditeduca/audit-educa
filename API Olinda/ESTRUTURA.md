# 📁 Estrutura do Projeto

```
API Olinda/                    ← Pasta principal
├── src/                       ← Código-fonte React
│   ├── pages/                 ← Páginas da aplicação
│   │   ├── Quotes.tsx         ← Cotações em tempo real
│   │   ├── Historical.tsx     ← Série histórica
│   │   ├── Converter.tsx      ← Conversor de moedas
│   │   └── About.tsx          ← Página sobre
│   ├── components/            ← Componentes reutilizáveis
│   │   ├── CurrencyCard.tsx
│   │   ├── ExportButtons.tsx
│   │   └── APIDocumentation.tsx
│   ├── hooks/                 ← Hooks customizados
│   │   └── useCurrencyQuotes.ts
│   ├── lib/                   ← Funções utilitárias
│   │   ├── currencies.ts      ← Dados de moedas
│   │   └── export.ts          ← Exportação de dados
│   ├── contexts/              ← React Contexts
│   ├── App.tsx                ← Componente raiz
│   ├── main.tsx               ← Ponto de entrada
│   └── index.css              ← Estilos globais
├── public/                    ← Assets estáticos
│   └── images/                ← Imagens
├── index.html                 ← Template HTML
├── package.json               ← Dependências
├── vite.config.ts             ← Configuração Vite
├── tsconfig.json              ← Configuração TypeScript
├── README.md                  ← Documentação
└── .gitignore                 ← Arquivos a ignorar no Git
```

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
cd "API Olinda"
pnpm install
```

### 2. Desenvolvimento Local
```bash
pnpm dev
```
Acesse: http://localhost:3000

### 3. Build para Produção
```bash
pnpm build
```
Resultado em: `dist/`

### 4. Publicar no GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/moedas-cotacao.git
git push -u origin main
```

## 📚 Documentação

- **README.md** - Documentação completa do projeto
- **PUBLICAR_NO_GITHUB.md** - Guia de publicação
- **GITHUB_DEPLOYMENT.md** - Detalhes técnicos

## 🔗 Links Úteis

- [API Olinda - Swagger](https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2)
- [Banco Central do Brasil](https://www.bcb.gov.br)
- [Portal de Dados Abertos](https://dadosabertos.bcb.gov.br)
