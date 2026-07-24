Você é um desenvolvedor Full Stack especialista em React, Vite, TypeScript, Tailwind CSS e implantação na Vercel.

Sua tarefa é transformar este design do Figma em um projeto COMPLETO, profissional e pronto para produção.

O projeto NÃO pode depender do ambiente Figma Make.

O resultado precisa funcionar em qualquer computador utilizando apenas Node.js.

==========================================================
OBJETIVO
==========================================================

Gerar um projeto React + Vite completo que possa ser:

✓ aberto no VS Code

✓ executado com

npm install

npm run dev

✓ compilado com

npm run build

✓ gerar corretamente a pasta dist

✓ enviado ao GitHub

✓ implantado diretamente na Vercel

SEM QUALQUER MODIFICAÇÃO.

==========================================================
NÃO UTILIZAR
==========================================================

É proibido utilizar qualquer dependência exclusiva do Figma.

Não utilizar:

.figma

siteConfiguration

Figma Make APIs

plugins internos

imports privados

arquivos ocultos

configurações internas

vite plugins exclusivos

qualquer import relacionado ao Figma

Não utilizar caminhos absolutos.

Não utilizar bibliotecas experimentais.

==========================================================
TECNOLOGIAS
==========================================================

Utilizar apenas:

React 18

Vite

TypeScript

Tailwind CSS

React Router DOM

Lucide React (caso existam ícones)

Nenhuma outra dependência desnecessária.

==========================================================
ESTRUTURA
==========================================================

Gerar exatamente:

/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── hooks/
│   │
│   ├── utils/
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── index.html
├── .gitignore
├── README.md
├── vercel.json
└── LICENSE

==========================================================
PACKAGE.JSON
==========================================================

Criar corretamente.

Scripts obrigatórios:

"scripts": {

"dev":"vite",

"build":"vite build",

"preview":"vite preview"

}

==========================================================
VITE.CONFIG.TS
==========================================================

Gerar apenas:

import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

export default defineConfig({

plugins:[react()]

});

Não adicionar nenhuma configuração do Figma.

==========================================================
INDEX.HTML
==========================================================

Gerar apenas:

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8"/>

<meta name="viewport"

content="width=device-width, initial-scale=1.0"/>

<title>Aplicação</title>

</head>

<body>

<div id="root"></div>

<script type="module" src="/src/main.tsx"></script>

</body>

</html>

==========================================================
MAIN.TSX
==========================================================

Criar corretamente utilizando:

ReactDOM.createRoot()

StrictMode

BrowserRouter

==========================================================
APP
==========================================================

Toda a interface deve ficar dentro de App.tsx e componentes.

Nunca utilizar código oculto.

==========================================================
TAILWIND
==========================================================

Utilizar Tailwind CSS corretamente.

Todas as classes devem ser padrão.

==========================================================
COMPONENTES
==========================================================

Criar componentes reutilizáveis.

Separar:

Header

Footer

Sidebar

Botões

Inputs

Cards

Modal

Calendário

Formulários

Listagens

==========================================================
IMAGENS
==========================================================

Todas as imagens devem ficar em:

src/assets

ou

public

Nunca utilizar links internos do Figma.

==========================================================
ROTAS
==========================================================

Caso existam telas:

/

/login

/cadastro

/agenda

/perfil

/configuracoes

Utilizar React Router DOM.

==========================================================
RESPONSIVIDADE
==========================================================

Desktop

Notebook

Tablet

Celular

==========================================================
ACESSIBILIDADE
==========================================================

Adicionar:

labels

aria-label

alt

tabIndex

focus

==========================================================
PERFORMANCE
==========================================================

Lazy loading quando necessário.

Evitar código duplicado.

==========================================================
VERCEL
==========================================================

Gerar automaticamente:

vercel.json

com:

{

"rewrites":[

{

"source":"/(.*)",

"destination":"/index.html"

}

]

}

==========================================================
README
==========================================================

Criar README contendo:

Como instalar

Como executar

Como gerar build

Como implantar na Vercel

Como implantar no GitHub

==========================================================
VALIDAÇÃO FINAL
==========================================================

Antes de finalizar execute mentalmente a validação:

✓ npm install

✓ npm run dev

✓ npm run build

✓ geração da pasta dist

✓ npm run preview

Verifique que NÃO existe nenhuma referência para:

.figma

siteConfiguration

Figma Make

plugins internos

imports privados

arquivos ocultos

configurações exclusivas

Se existir qualquer referência ao Figma, substitua automaticamente por código React/Vite padrão.

==========================================================
RESULTADO
==========================================================

Entregar um projeto COMPLETO contendo TODOS os arquivos.

Não omitir nenhuma pasta.

Não omitir nenhum arquivo.

Não resumir código.

Não utilizar placeholders.

Não utilizar comentários dizendo "implementar depois".

Todos os componentes devem estar finalizados.

O projeto precisa estar pronto para:

GitHub

Vercel

Netlify

sem necessidade de qualquer alteração adicional.