"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw, FaEye, FaEyeSlash } from "react-icons/fa";
import styles from "../../login-usuario/login.module.css";

// Credenciais do admin — em produção devem vir do backend
const ADMIN_EMAIL = "admin@petz.com";
const ADMIN_PASSWORD = "admin123";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 0,
        nome: "Administrador",
        email: ADMIN_EMAIL,
        tipo: "admin",
        imagem: "",
      };
      localStorage.setItem("usuarioLogado", JSON.stringify(adminUser));
      window.dispatchEvent(new Event("auth-changed"));
      router.push("/admin");
    } else {
      setError("E-mail ou senha do administrador incorretos.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Painel Administrativo</h1>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            E-mail:
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="admin@petz.com"
              autoComplete="username"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Senha:
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Digite a senha"
              autoComplete="current-password"
            />
          </label>
          <button
            type="button"
            className={styles.togglePassword}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button className={styles.button} type="submit">
          Entrar como Admin
        </button>
      </form>
    </div>
  );
}
