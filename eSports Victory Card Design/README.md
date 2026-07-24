# Squadron Victory Card

Arte profissional de eSports para Instagram (1080×1350) com campos dinâmicos editáveis e download em PNG.

## Instalação

```bash
npm install
```

## Executar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

## Gerar build de produção

```bash
npm run build
```

A pasta `dist/` será gerada pronta para deploy.

## Preview do build

```bash
npm run preview
```

## Deploy na Vercel

1. Envie o projeto para um repositório no GitHub.
2. Acesse https://vercel.com e importe o repositório.
3. A Vercel detecta automaticamente o Vite. Clique em **Deploy**.
4. O arquivo `vercel.json` já está configurado para SPA (React Router).

## Deploy no GitHub Pages (alternativa)

```bash
npm run build
# faça upload da pasta dist/ para o branch gh-pages
```

## Estrutura

```
src/
  assets/       → imagens (sqd.jpg etc.)
  components/   → componentes reutilizáveis
  pages/        → páginas (se usar rotas)
  hooks/        → hooks customizados
  utils/        → funções utilitárias
  App.tsx       → componente principal
  main.tsx      → entry point
  index.css     → estilos globais + Tailwind
```
