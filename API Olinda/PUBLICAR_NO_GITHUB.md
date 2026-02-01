# 📤 Como Publicar no GitHub

## 🏗️ Estrutura Simplificada

```
moedas-cotacao/
├── src/                    ← Código-fonte React
├── public/                 ← Imagens e assets
├── index.html              ← Arquivo HTML principal
├── package.json            ← Dependências
├── vite.config.ts          ← Configuração build
├── tsconfig.json           ← Configuração TypeScript
└── README.md               ← Documentação
```

**Tudo em uma única pasta raiz!** Sem `client/` aninhada.

---

## 🚀 Opção 1: Publicar via Painel Manus (Mais Fácil)

1. Clique em **"Publish"** no painel superior direito
2. Selecione **"GitHub"**
3. Autorize o acesso
4. Escolha ou crie um repositório
5. ✅ Pronto!

---

## 🚀 Opção 2: Publicar Manualmente

### Passo 1: Criar Repositório no GitHub

1. Acesse [https://github.com/new](https://github.com/new)
2. Nome: `moedas-cotacao`
3. Descrição: `Aplicação de cotação de moedas com API Olinda do Banco Central`
4. Selecione **Public** (para que fique acessível)
5. **NÃO** inicialize com README
6. Clique em **Create repository**

### Passo 2: Configurar Git Localmente

```bash
# Abra o terminal na pasta do projeto
cd /home/ubuntu/moedas-cotacao

# Configure seu usuário Git (se não tiver feito)
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"

# Adicione o repositório remoto
git remote add origin https://github.com/SEU_USUARIO/moedas-cotacao.git

# Verifique se funcionou
git remote -v
```

### Passo 3: Fazer Commit Inicial

```bash
# Adicione todos os arquivos
git add .

# Crie o commit
git commit -m "Initial commit: Aplicação de cotação de moedas com API Olinda"

# Envie para GitHub
git push -u origin main
```

### Passo 4: Pronto! 🎉

Seu repositório está no GitHub! Acesse:
```
https://github.com/SEU_USUARIO/moedas-cotacao
```

---

## 📦 O que Será Enviado para GitHub

✅ **Será enviado:**
- `src/` - Código-fonte React
- `public/` - Imagens e assets
- `package.json` - Dependências
- `README.md` - Documentação
- `vite.config.ts` - Configuração
- `tsconfig.json` - Configuração TypeScript
- `.gitignore` - Arquivos a ignorar

❌ **NÃO será enviado (ignorado):**
- `node_modules/` - Instalado via `pnpm install`
- `dist/` - Gerado via `pnpm build`
- `.env` - Variáveis sensíveis
- `.DS_Store` - Arquivos do macOS

---

## 🌐 Deploy Após Publicar no GitHub

Depois de publicar no GitHub, você pode fazer deploy em:

### Vercel (Recomendado para React)

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy automático
vercel
```

Selecione o repositório e pronto! Seu site estará em:
```
https://moedas-cotacao.vercel.app
```

### Netlify

```bash
# Instale Netlify CLI
npm i -g netlify-cli

# Build local
pnpm build

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. Vá para **Settings** → **Pages**
2. Em "Source", selecione **"Deploy from a branch"**
3. Escolha branch **"main"** e pasta **"dist"**
4. Clique em **Save**

Seu site estará em:
```
https://seu-usuario.github.io/moedas-cotacao/
```

---

## 📝 Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar dependências
pnpm install

# Iniciar servidor local
pnpm dev

# Abrir em http://localhost:3000
```

### Build para Produção

```bash
# Compilar React → HTML/CSS/JS estático
pnpm build

# Resultado em: dist/
```

### Atualizar GitHub

```bash
# Após fazer alterações locais
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 🔗 Links Importantes

- 📚 [Documentação da API Olinda](https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/swagger-ui2)
- 🏦 [Banco Central do Brasil](https://www.bcb.gov.br)
- 📊 [Portal de Dados Abertos](https://dadosabertos.bcb.gov.br)

---

## ❓ Dúvidas?

**P: Preciso de autenticação para a API?**
R: Não! A API Olinda é pública e não requer autenticação.

**P: Posso usar outro hosting?**
R: Sim! Qualquer hosting que suporte Node.js ou arquivos estáticos funciona.

**P: Como atualizar o site após publicar?**
R: Faça `git push` e o site será atualizado automaticamente (dependendo do hosting).

---

**Pronto para publicar? Comece com a Opção 1 (Painel Manus) - é mais fácil! 🚀**
