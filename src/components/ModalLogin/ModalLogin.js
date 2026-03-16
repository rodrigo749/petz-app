"use client";

import { useRouter } from "next/navigation";
import styles from "./ModalLogin.module.css";

export default function ModalLogin({ onClose }) {
  const router = useRouter();

  function handleBackgroundClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleRedirect() {
    onClose();
    router.push("/login-usuario");
  }

  return (
    <div className={styles.overlay} onClick={handleBackgroundClick}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>

        <div className={styles.iconWrapper}>
          <img src="/images/patinha.png" alt="patinha" className={styles.pawIcon} />
        </div>

        <h2 className={styles.title}>Faça login ou registre-se</h2>
        <p className={styles.message}>
          Você precisa estar logado para contatar o dono do pet.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnLogin} onClick={handleRedirect}>
            Ir para o Login
          </button>
          <button className={styles.btnCancel} onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
