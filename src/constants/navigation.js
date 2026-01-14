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
      { label: "Pets Adotados", href: "Pets Adotados" },
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
];
