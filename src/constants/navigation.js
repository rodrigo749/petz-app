export const NAV_LINKS = [
  {
    id: "login",
    label: "Login ",
    href: "/login",
    subLinks: [
      { label: "Como ONG", href: "/login/ong" },
      { label: "Como Usuário", href: "/login/usuario" },
    ],
  },
  {
    id: "adocao",
    label: "Adoção ",
    href: "/adocao",
    subLinks: [
      { label: "Pets para Adoção", href: "/adocao/disponiveis" },
      { label: "Pets Adotados", href: "/adocao/adotados" },
    ],
  },
  {
    id: "perdidos",
    label: "Pets perdidos ",
    href: "/perdidos",
    subLinks: [
      { label: "Pets Perdidos", href: "/perdidos/perdidos" },
      { label: "Pets Encontrados", href: "/perdidos/encontrados" },
    ],
  },
  { id: "apoiar", label: "Apoiar", href: "/apoiar" },
];
