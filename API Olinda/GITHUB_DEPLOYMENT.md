# 📚 Guia de Publicação no GitHub e Estrutura do Projeto

## 🏗️ Estrutura do Projeto

Este é um projeto **React + TypeScript** que é compilado para HTML/CSS/JavaScript estático. As "páginas" são componentes React, não arquivos HTML individuais.

### Estrutura de Diretórios

```
moedas-cotacao/
├── client/                          # Frontend React
│   ├── public/                      # Arquivos estáticos (imagens, favicon, etc)
│   │   ├── index.html              # HTML principal (gerado automaticamente)
│   │   └── images/                 # Imagens da aplicação
│   ├── src/
│   │   ├── pages/                  # Componentes de página
│   │   │   ├── Quotes.tsx          # Página de cotações
│   │   │   ├── Historical.tsx      # Página de série histórica
│   │   │   ├── Converter.tsx       # Página de conversor
│   │   │   ├── About.tsx           # Página sobre
│   │   │   └── NotFound.tsx        # Página 404
│   │   ├── components/             # Componentes reutilizáveis
│   │   │   ├── CurrencyCard.tsx
│   │   │   ├── ExportButtons.tsx
│   │   │   └── APIDocumentation.tsx
│   │   ├── hooks/                  # Hooks customizados
│   │   │   └── useCurrencyQuotes.ts
│   │   ├── lib/                    # Funções utilitárias
│   │   │   ├── currencies.ts       # Dados de moedas
│   │   │   └── export.ts           # Funções de exportação
│   │   ├── contexts/               # React Contexts
│   │   ├── App.tsx                 # Componente raiz com rotas
│   │   ├── main.tsx                # Ponto de entrada
│   │   └── index.css               # Estilos globais
│   └── index.html                  # Template HTML
├── server/                          # Backend (não usado em web-static)
├── shared/                          # Tipos compartilhados
├── package.json                     # Dependências
├── tsconfig.json                    # Configuração TypeScript
├── tailwind.config.js               # Configuração Tailwind
├── vite.config.ts                   # Configuração Vite (build tool)
└── README.md                        # Documentação
```

## 🔄 Como Funciona a Compilação

1. **Desenvolvimento**: `pnpm dev` - Executa servidor local com hot reload
2. **Build**: `pnpm build` - Compila React → HTML/CSS/JS estático
3. **Resultado**: Pasta `dist/public/` contém arquivos estáticos prontos para deploy

## 📤 Como Publicar no GitHub

### Opção 1: Usar o Painel Manus (Recomendado)

1. Clique no botão **"Publish"** no painel de controle Manus
2. Selecione **"GitHub"** como destino
3. Autorize o acesso ao GitHub
4. Escolha o repositório ou crie um novo
5. Pronto! O código será enviado automaticamente

### Opção 2: Publicar Manualmente via GitHub

#### Passo 1: Criar Repositório no GitHub

```bash
# 1. Acesse https://github.com/new
# 2. Crie um novo repositório chamado "moedas-cotacao"
# 3. NÃO inicialize com README (vamos fazer isso localmente)
```

#### Passo 2: Clonar e Configurar Localmente

```bash
# Clone o repositório vazio
git clone https://github.com/SEU_USUARIO/moedas-cotacao.git
cd moedas-cotacao

# Copie todos os arquivos do projeto Manus para cá
# (Você pode baixar os arquivos do painel Manus)
```

#### Passo 3: Fazer Commit Inicial

```bash
git add .
git commit -m "Initial commit: Aplicação de cotação de moedas com API Olinda"
git push -u origin main
```

#### Passo 4: Configurar GitHub Pages (Opcional - para deploy automático)

Se quiser que o site fique acessível em `https://seu-usuario.github.io/moedas-cotacao/`:

1. Vá para **Settings** → **Pages**
2. Em "Source", selecione **"Deploy from a branch"**
3. Escolha branch **"main"** e pasta **"dist"**
4. Clique em **Save**

## 📁 Arquivos Importantes para GitHub

### Arquivos que DEVEM estar no repositório:

```
✅ client/src/          - Código-fonte React
✅ client/public/       - Assets estáticos
✅ package.json         - Dependências
✅ tsconfig.json        - Configuração TypeScript
✅ vite.config.ts       - Configuração build
✅ README.md            - Documentação
✅ .gitignore           - Arquivos a ignorar
```

### Arquivos que NÃO devem estar (adicione ao `.gitignore`):

```
❌ node_modules/        - Instalado via pnpm install
❌ dist/                - Gerado via pnpm build
❌ .env                 - Variáveis sensíveis
❌ .DS_Store            - Arquivos do macOS
```

## 🔧 Arquivo `.gitignore` Recomendado

```
# Dependencies
node_modules/
pnpm-lock.yaml
yarn.lock
package-lock.json

# Build output
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
```

## 📝 README.md Recomendado para GitHub

```markdown
# Cotação de Moedas - API Olinda BCB

Aplicação web profissional para consulta de cotações de moedas em tempo real usando a API Olinda do Banco Central do Brasil.

## 🚀 Funcionalidades

- **Cotações em Tempo Real**: 75+ moedas com dados oficiais PTAX
- **Filtros Regionais**: Américas, Europa, Ásia, África
- **Série Histórica**: Gráficos interativos com Recharts
- **Conversor**: Converta entre qualquer par de moedas
- **Exportação**: CSV, Excel, PDF, Power BI

## 🛠️ Tecnologias

- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- Vite (build tool)
- API Olinda do Banco Central

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Executar em desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview do build
pnpm preview
```

## 📚 Documentação da API

- [Swagger - Documentação Interativa](https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2)
- [Portal de Dados Abertos BCB](https://dadosabertos.bcb.gov.br/dataset/taxas-de-cambio-todos-os-boletins-diarios)
- [Cotações Oficiais - Site BCB](https://www.bcb.gov.br/estabilidadefinanceira/cotacoestodas)

## 📄 Licença

MIT
```

## 🌐 Estrutura de Roteamento (SPA - Single Page Application)

A aplicação usa **Wouter** para roteamento no cliente:

```
/                    → Página de Cotações
/historico           → Série Histórica
/conversor           → Conversor de Moedas
/sobre               → Página Sobre
/404                 → Página não encontrada
```

**Importante**: Não existem arquivos HTML separados para cada página. Tudo é um único `index.html` que carrega React, que renderiza a página correta baseado na URL.

## 🚀 Deploy em Diferentes Plataformas

### Vercel (Recomendado para React)
```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Instale Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist/public
```

### GitHub Pages
```bash
# Build
pnpm build

# Commit e push
git add dist/
git commit -m "Build: atualizar versão de produção"
git push
```

## ❓ Perguntas Frequentes

**P: Onde estão os arquivos HTML das páginas?**
R: Não existem arquivos HTML separados. A aplicação é um SPA (Single Page Application) que usa React para renderizar diferentes "páginas" dinamicamente.

**P: Como adicionar novas páginas?**
R: Crie um novo arquivo em `client/src/pages/NovaPage.tsx`, adicione a rota em `App.tsx`, e pronto!

**P: Posso usar sem Node.js?**
R: Sim! Após fazer `pnpm build`, a pasta `dist/public/` contém apenas HTML/CSS/JS estático que pode ser servido por qualquer servidor web.

**P: Como fazer deploy sem Manus?**
R: Faça `pnpm build`, depois suba a pasta `dist/public/` para qualquer hosting estático (Vercel, Netlify, GitHub Pages, etc).

## 📞 Suporte

Para dúvidas sobre a API Olinda, consulte:
- [Documentação Oficial BCB](https://www.bcb.gov.br)
- [Portal de Dados Abertos](https://dadosabertos.bcb.gov.br)
