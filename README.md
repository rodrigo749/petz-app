# 🐾 Petz App

Sistema web para gestão de ONGs de proteção animal, facilitando o cadastro de organizações, busca de animais perdidos, processo de adoção e muito mais.

## 📋 Sobre o Projeto

O **Petz App** é uma plataforma desenvolvida como parte do curso de Desenvolvimento de Sistemas do SENAC, com o objetivo de conectar ONGs de proteção animal, tutores que perderam seus pets e pessoas interessadas em adotar animais.

### Funcionalidades Planejadas

- 🏢 **Cadastro de ONGs**: Registro e gerenciamento de organizações de proteção animal
- 🔍 **Busca de Animais Perdidos**: Sistema para reportar e encontrar pets desaparecidos
- 🏠 **Adoção de Animais**: Plataforma para divulgar animais disponíveis para adoção
- 📱 **Interface Responsiva**: Acesso através de diferentes dispositivos

## 🚀 Tecnologias Utilizadas

Este projeto foi inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) em configuração customizável e utiliza as seguintes tecnologias:

- **[Next.js 16.0.1](https://nextjs.org/)** - Framework React para produção
- **[React 19.2.0](https://react.dev/)** - Biblioteca JavaScript para interfaces de usuário
- **[React Compiler](https://react.dev/learn/react-compiler)** - Otimização automática de performance
- **[ESLint](https://eslint.org/)** - Linter para garantir qualidade do código
- **[Geist Font](https://vercel.com/font)** - Tipografia otimizada da Vercel

### Estrutura do Projeto

```
petz-app/
├── src/
│   └── app/
│       ├── layout.js       # Layout principal da aplicação
│       ├── page.js         # Página inicial
│       ├── globals.css     # Estilos globais
│       └── favicon.ico     # Ícone da aplicação
├── public/                 # Arquivos estáticos
├── next.config.mjs        # Configuração do Next.js
├── eslint.config.mjs      # Configuração do ESLint
└── package.json           # Dependências do projeto
```

## 💻 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/gaelos7k/Desenvolvimento-de-sistemas-Senac.git
cd petz-app
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar o código

## 🎨 Personalização

Você pode começar a editar a página modificando o arquivo `src/app/page.js`. A página é atualizada automaticamente conforme você edita o arquivo.

O projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar automaticamente a família de fontes Geist.
