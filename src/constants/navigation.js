export const NAV_LINKS = [
  {
    id: "login",
    label: "Entrar ",
    href: "#",
    subLinks: [
      { label: "ONG", href: "/login-ong" },
      { label: "Usuário", href: "/login" },
    ],
  },
  {
    id: "adocao",
    label: "Adoção ",
    href: "/adocao",
    subLinks: [
      { label: "Pets para Adoção", href: "/adocao" },
      { label: "Pets Adotados", href: "/adocao/adotados" },
    ],
  },
  {
    id: "perdidos",
    label: "Pets perdidos ",
    href: "/perdidos",
    subLinks: [
      { label: "Pets Perdidos", href: "/perdidos" },
      { label: "Pets Encontrados", href: "/encontrados" },
    ],
  },
  { id: "apoiar", label: "Apoiar", href: "/apoiar" },
];
