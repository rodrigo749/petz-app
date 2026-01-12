"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./perfilUsuario.module.css";

export default function PerfilUsuario() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!u) {
      // if no user is logged, redirect to the appropriate login page
      router.push("/login-usuario");
      return;
    }
    setUsuario(u);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    router.push("/");
  };

  const handleDelete = () => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const filtered = usuarios.filter((u) => u.cnpj !== usuario.cnpj);
    localStorage.setItem("usuarios", JSON.stringify(filtered));
    localStorage.removeItem("usuarioLogado");
    router.push("/");
  };

  if (!usuario) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <h1 className={styles.title}>Meu Perfil</h1>
        </div>

        <div className={styles.info}>
          <div className={styles.row}>
            <strong>Nome:</strong>
            <span>{usuario.nome || usuario.razaoSocial || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Email:</strong>
            <span>{usuario.email || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>CNPJ/CPF:</strong>
            <span>{usuario.cnpj || usuario.cpf || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Telefone:</strong>
            <span>{usuario.telefone || "-"}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={handleLogout}>
            Sair
          </button>
          <button className={styles.delete} onClick={handleDelete}>
            Excluir conta
          </button>
        </div>
      </div>
    </div>
  );
}
