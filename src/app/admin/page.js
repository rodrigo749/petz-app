"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!u || u.tipo !== "admin") {
      router.push("/admin/login");
      return;
    }
    setAdmin(u);
  }, [router]);

  if (!admin) return null;

  const cards = [
    {
      icon: "🐾",
      title: "Pets para Adoção",
      desc: "Cadastrar, editar e remover pets disponíveis para adoção.",
      href: "/admin/pets-adocao",
    },
    {
      icon: "🔍",
      title: "Pets Perdidos",
      desc: "Gerenciar cadastros de pets perdidos.",
      href: "/admin/pets-perdidos",
    },
    {
      icon: "📝",
      title: "Cadastrar Pet Adoção",
      desc: "Cadastrar um novo pet disponível para adoção.",
      href: "/cadastro-pet-adocao",
    },
    {
      icon: "📋",
      title: "Cadastrar Pet Perdido",
      desc: "Cadastrar um novo pet perdido.",
      href: "/cadastrar-pets-perdidos",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Painel Administrativo</h1>
        <p>Bem vindo, {admin.nome}</p>
      </div>

      <div className={styles.grid}>
        {cards.map((card, i) => (
          <Link key={i} href={card.href} className={styles.card}>
          
            <h2>{card.title}</h2>
            <p>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
