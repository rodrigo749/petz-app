# 🐾 Patas Perdidas

Sistema web para gestão de ONGs de proteção animal, facilitando o cadastro de organizações, busca de animais perdidos e processo de adoção.

## 📋 Sobre o Projeto

**Patas Perdidas** é uma plataforma desenvolvida como parte do curso de Desenvolvimento de Sistemas do SENAC, com o objetivo de conectar ONGs de proteção animal, tutores que perderam seus pets e pessoas interessadas em adotar animais.

### Funcionalidades Planejadas

- 👤 **Login**: Sistema de autenticação de usuários
- 🏠 **Adoção de Animais**: Plataforma para divulgar animais disponíveis para adoção
- � **Busca de Animais Perdidos**: Sistema para reportar e encontrar pets desaparecidos
- 💝 **Apoiar**: Formas de contribuir com a causa animal

## 🚀 Tecnologias Utilizadas

- **[Next.js 16.0.1](https://nextjs.org/)** - Framework React com Server Components e App Router
- **[React 19.2.0](https://react.dev/)** - Biblioteca para construção de interfaces
- **[React Compiler](https://react.dev/learn/react-compiler)** - Otimização automática de performance
- **[Lucide React](https://lucide.dev/)** - Biblioteca de ícones moderna e leve
- **[ESLint](https://eslint.org/)** - Linter para qualidade de código

### Estrutura do Projeto

```
petz-app/
├── public/
│   ├── images/
│   │   └── Logo.png         # Logo do projeto
│   └── favicon.ico          # Ícone da aplicação
├── src/
│   ├── app/
│   │   ├── layout.js        # Layout raiz com metadata
│   │   ├── page.js          # Página inicial
│   │   └── globals.css      # Estilos globais
│   ├── components/
│   │   └── Header.js        # Componente de navegação
│   ├── constants/
│   │   └── navigation.js    # Links de navegação
│   └── styles/
│       └── Header.module.css # Estilos do Header
├── next.config.mjs          # Configuração do Next.js
├── eslint.config.mjs        # Configuração do ESLint
└── package.json             # Dependências do projeto
```

## 💻 Como Executar

### Pré-requisitos

- Node.js 18+ 
- npm, yarn, pnpm ou bun

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/rodrigo749/petz-app.git
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

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento com Turbopack
- `npm run build` - Build de produção
- `npm start` - Servidor de produção
- `npm run lint` - Análise de código com ESLint

## 🎨 Componentes

### Header

Componente de navegação responsivo com:
- **Desktop**: Menu horizontal com links estilizados
- **Mobile**: Menu hambúrguer com drawer lateral (desliza da direita)
- **Logo**: Otimizada com Next.js Image
- **Hover effects**: Animações suaves em dourado (#ffd700)

### Navegação

Links configurados em `src/constants/navigation.js`:
- Login (`/login`)
- Adoção (`/adocao`)
- Pets perdidos (`/perdidos`)
- Apoiar (`/apoiar`)

## 📱 Responsividade

- **Desktop (1024px+)**: Menu horizontal completo
- **Tablet (768px-1023px)**: Menu hambúrguer com logo reduzida
- **Mobile (<768px)**: Menu lateral otimizado para touch
