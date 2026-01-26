export const NAV_LINKS = [
  {
    id: "login",
    label: "Entrar ",
    href: "#",
    subLinks: [
      { label: "ONG", href: "/login-ong" },
      { label: "Usuário", href: "/login-usuario" },
    ],
  },
  {
    id: "adocao",
    label: "Adoção ",
    href: "/adocao",
    subLinks: [
      { label: "Pets para Adoção", href: "/pets-para-adocao" },
      { label: "Pets Adotados", href: "/pets-adotados" },
    ],
  },
  {
    id: "perdidos",
    label: "Pets-perdidos ",
    href: "/pets-perdidos",
    subLinks: [
  { label: "Pets Perdidos", href: "/pets-perdidos" },
  { label: "Pets Encontrados", href: "/pets-encontrados" },
    ],
  },
  { id: "apoiar", label: "Apoiar", href: "/apoiar" },


  // 🔽 NOVO MENU PERFIL
  {
    id: "perfil",
    label: "Perfil",
    href: "#",
    subLinks: [
      { label: "Editar perfil", href: "/editar-perfil-usuario" },
      { label: "Meus pets para adoção", href: "/seus-pets-para-adocao" },
      { label: "Histórico de apoio", href: "/historico-de-apoio" },
      { label: "Sair", href: "/logout" },
    ],
  },
];
