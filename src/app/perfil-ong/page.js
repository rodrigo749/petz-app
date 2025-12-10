"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./perfilOng.module.css";

export default function PerfilOng() {
  const router = useRouter();
  const [ong, setOng] = useState(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    if (!u || u.tipo !== "ong") {
      // if no ONG is logged, redirect to the appropriate login page
      router.push("/login-ong");
      return;
    }
    setOng(u);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    router.push("/");
  };

  const handleDelete = () => {
    const ongs = JSON.parse(localStorage.getItem("ongs") || "[]");
    const filtered = ongs.filter((o) => o.cnpj !== ong.cnpj);
    localStorage.setItem("ongs", JSON.stringify(filtered));
    localStorage.removeItem("usuarioLogado");
    router.push("/");
  };

  if (!ong) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <h1 className={styles.title}>Perfil da ONG</h1>
        </div>

        <div className={styles.info}>
          <div className={styles.row}>
            <strong>Nome da ONG:</strong>
            <span>{ong.nome || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Email:</strong>
            <span>{ong.email || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>CNPJ:</strong>
            <span>{ong.cnpj || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Telefone:</strong>
            <span>{ong.telefone || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Celular:</strong>
            <span>{ong.celular || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Endereço:</strong>
            <span>
              {ong.rua || "-"}, {ong.numero || "-"} {ong.complemento && `- ${ong.complemento}`}
            </span>
          </div>
          <div className={styles.row}>
            <strong>Cidade:</strong>
            <span>
              {ong.cidade || "-"}, {ong.estado || "-"}
            </span>
          </div>
          <div className={styles.row}>
            <strong>CEP:</strong>
            <span>{ong.cep || "-"}</span>
          </div>
          <div className={styles.row}>
            <strong>Horário de Funcionamento:</strong>
            <span>
              {ong.HorarioFunc1 || "-"} até {ong.HorarioFunc2 || "-"}
            </span>
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
