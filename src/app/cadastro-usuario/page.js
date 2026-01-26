"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";

import styles from "./cadastro.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function CadastroPage() {
  const { showToast } = useSafeToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone:"",
    password: "",
    confirmPassword: "",
    imagem: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [cpfError, setCpfError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setCpfError("");

    if (!formData.nome || !formData.cpf || !formData.email || !formData.telefone || !formData.password || !formData.confirmPassword) {
      showToast("Por favor, preencha todos os campos obrigatórios.", "warning");
      return;
    }

    const cpfLimpo = (formData.cpf || "").replace(/\D/g, "");
    if (!cpf.isValid(cpfLimpo)) {
      setCpfError("CPF inválido. Por favor, verifique e tente novamente.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem. Por favor, tente novamente.");
      return;
    }

  try {
    const payload = {
      nome: formData.nome,
      cpf: formData.cpf,
      email: formData.email,
      telefone: formData.telefone,
      password: formData.password,
      imagem: formData.imagem,
      tipo: "usuario"
    };

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Erro ao cadastrar usuário.");
      return;
    }

    showToast("Cadastro realizado com sucesso!", "success");
    localStorage.setItem("usuarioLogado", JSON.stringify(data));
    setTimeout(() => {
       router.push("/perfil-usuario");
    }, 2000);

    // salva apenas o usuário logado (opcional)
    localStorage.setItem("usuarioLogado", JSON.stringify(data));

    // vai direto para o perfil
    router.push("/perfil-usuario");

  } catch (error) {
    console.error(error);
    setError("Erro de rede. Tente novamente.");
  }
};


  const formatCPF = (value) => {
    const digits = (value || "").replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  };
  const formatTelefone = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11); // Máx 11 dígitos (ex: 31999999999)

    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0,2)}) ${digits.slice(2,6)}-${digits.slice(6)}`;
    }

    // Para números com 11 dígitos (celular)
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
};

  const handleChange = (field, value) => {
    if (field === "cpf") {
      value = formatCPF(value);
    }
    if (field === "telefone"){
      value = formatTelefone(value);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    setFormData(prev => ({
      ...prev,
      imagem: reader.result // Base64 for preview
    }));
  };
  reader.readAsDataURL(file);
  setImageFile(file);
};

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Criar nova conta</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Nome:
            <input
              className={styles.input}
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
              placeholder="Seu nome completo"
              aria-label="Nome"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            CPF:
            <input
              className={styles.input}
              type="text"
              inputMode="numeric"
              value={formData.cpf}
              onChange={(e) => handleChange("cpf", e.target.value)}
              placeholder="000.000.000-00"
              aria-label="CPF"
            />
          </label>
          {cpfError && <div style={{ backgroundColor: '#ffe6e6', color: '#cc0000', fontSize: '12px', padding: '8px 12px', borderRadius: '4px', marginTop: '8px' }}>{cpfError}</div>}
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Email:
            <input
              className={styles.input}
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="seu@email.com"
              aria-label="Email"
            />
          </label>
        </div>
         <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            telefone:
            <input
             className={styles.input}
             type="tel"
             value={formData.telefone}
             onChange={(e) => handleChange("telefone",e.target.value)}
             placeholder="(35) 0000-0000"
             required
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
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="Sua senha"
              aria-label="Senha"
            />
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            Confirmar Senha:
            <input
              className={styles.input}
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirme sua senha"
              aria-label="Confirmar senha"
            />
          </label>
        </div>
        <div className={styles.uploadWrapper}>
          <label className={styles.uploadBox}>
            {formData.imagem ? (
              <img
                src={formData.imagem}
                alt="Preview"
                className={styles.uploadPreview}
              />
            ) : (
              <>
                <span className={styles.uploadIcon}>＋</span>
                <span className={styles.uploadText}>Adicionar foto de perfil</span>
              </>
            )}
        
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>

        <button className={styles.button} type="submit">Cadastrar</button>

        <div className={styles.bottomLink}>
          Já tem conta? <a href="/login-usuario">Faça login aqui</a>.
        </div>
      </form>
    </div>
  );
}
