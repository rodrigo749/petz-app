export const NAV_LINKS = [
  {
    id: "login",
    label: "Entrar ",
    href: "/login-usuario",
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
];
