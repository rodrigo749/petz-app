"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import styles from "./cadastro.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function CadastroPage() {
  const { showToast } = useSafeToast();
  const router = useRouter();

  // Estados
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    password: "",
    confirmPassword: "",
    imagemPreview: "" // Separamos o preview da URL final
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false); // Novo estado de Loading
  const [fieldErrors, setFieldErrors] = useState({}); // Erros específicos por campo

  // Helper para URL da API
  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL || "http://localhost:5000").trim().replace(/\/$/, "");

  // --- Função de Upload Simplificada e Robusta ---
  const uploadImage = async (file) => {
    const baseUrl = getBaseUrl();
    const fd = new FormData();
    
    // ATENÇÃO: Verifique no seu Backend (Multer) se o campo esperado é 'file'
    fd.append("file", file);

    
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || `Erro no upload (${res.status})`);
    }

    // Retorna a URL segura
    return data.url || data.path || data.fileUrl || "";
  };

  // --- Handlers ---
  const handleChange = (field, value) => {
    // Formatação em tempo real
    if (field === "cpf") {
      value = value.replace(/\D/g, "").replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4").slice(0, 14);
    }
    if (field === "telefone") {
      value = value.replace(/\D/g, "").slice(0, 11);
      if (value.length > 2) value = `(${value.slice(0,2)}) ${value.slice(2)}`;
      if (value.length > 7) value = `${value.slice(0,9)}-${value.slice(9)}`;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpa o erro do campo quando o usuário digita
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tamanho (ex: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("A imagem deve ter no máximo 5MB.", "warning");
      return;
    }

    setImageFile(file);
    // Cria URL temporária (muito mais leve que Base64)
    const objectUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, imagemPreview: objectUrl }));
  };

  // Limpa a URL do objeto para evitar vazamento de memória
  useEffect(() => {
    return () => {
      if (formData.imagemPreview) URL.revokeObjectURL(formData.imagemPreview);
    };
  }, [formData.imagemPreview]);

  // --- Submit Principal ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({}); // Limpa erros anteriores

    // 1. Validação Local
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    if (!cpfValidator.isValid(cpfLimpo)) {
      setFieldErrors(prev => ({ ...prev, cpf: "CPF inválido." }));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setFieldErrors(prev => ({ ...prev, password: "Mínimo 6 caracteres." }));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "As senhas não coincidem." }));
      setLoading(false);
      return;
    }

    try {
      let finalImageUrl = "";

      // 2. Upload da Imagem (se existir)
      if (imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch (uploadErr) {
          console.error(uploadErr);
          showToast("Erro ao enviar imagem. Verifique o servidor.", "error");
          setLoading(false);
          return; // Para aqui se a imagem for obrigatória ou o upload falhar
        }
      }

      // 3. Cadastro do Usuário
      const baseUrl = getBaseUrl();
      const payload = {
        nome: formData.nome,
        cpf: formData.cpf, // ou cpfLimpo, dependendo de como o banco espera
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password,
        imagem: finalImageUrl,
        tipo: "usuario"
      };

      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Sucesso: armazena token/usuário e vai para o perfil do usuário
      const respData = await res.json().catch(() => ({}))

      // Se o backend retornou token, armazena
      if (respData.token) {
        localStorage.setItem('token', respData.token)
      }
      // Armazena objeto de usuário (ajuste chave conforme seu backend)
      localStorage.setItem('usuarioLogado', JSON.stringify(respData.user || respData))

      showToast('Cadastro realizado com sucesso!', 'success')

      // Redireciona para o perfil do usuário
      setTimeout(() => router.push('/perfil-usuario'), 900)

    } catch (err) {
      console.error("Erro geral:", err);
      showToast("Erro de conexão com o servidor. O backend está ligado?", "error");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Criar nova conta</h1>
        
        {/* Campo NOME */}
        <div className={styles.inputWrapper}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>Nome:
            <input className={styles.input} type="text" required value={formData.nome} onChange={(e) => handleChange("nome", e.target.value)} placeholder="Nome completo" />
          </label>
        </div>

        {/* Campo CPF */}
        <div className={styles.inputWrapper} style={fieldErrors.cpf ? {borderColor: 'red'} : {}}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>CPF:
            <input className={styles.input} type="text" inputMode="numeric" required value={formData.cpf} onChange={(e) => handleChange("cpf", e.target.value)} placeholder="000.000.000-00" />
          </label>
        </div>
        {fieldErrors.cpf && <span className={styles.errorText}>{fieldErrors.cpf}</span>}

        {/* Campo EMAIL */}
        <div className={styles.inputWrapper} style={fieldErrors.email ? {borderColor: 'red'} : {}}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>Email:
            <input className={styles.input} type="email" required value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="seu@email.com" />
          </label>
        </div>
        {fieldErrors.email && <span className={styles.errorText}>{fieldErrors.email}</span>}

        {/* Campo TELEFONE */}
        <div className={styles.inputWrapper}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>Telefone:
            <input className={styles.input} type="tel" required value={formData.telefone} onChange={(e) => handleChange("telefone", e.target.value)} placeholder="(XX) 00000-0000" />
          </label>
        </div>

        {/* Campo SENHA */}
        <div className={styles.inputWrapper} style={fieldErrors.password ? {borderColor: 'red'} : {}}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>Senha:
            <input className={styles.input} type="password" required value={formData.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="Mínimo 6 dígitos" />
          </label>
        </div>
        {fieldErrors.password && <span className={styles.errorText}>{fieldErrors.password}</span>}

        {/* Campo CONFIRMAR SENHA */}
        <div className={styles.inputWrapper} style={fieldErrors.confirmPassword ? {borderColor: 'red'} : {}}>
          <span className={styles.icon}><FaPaw /></span>
          <label className={styles.fieldLabel}>Confirmar:
            <input className={styles.input} type="password" required value={formData.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} placeholder="Repita a senha" />
          </label>
        </div>
        {fieldErrors.confirmPassword && <span className={styles.errorText}>{fieldErrors.confirmPassword}</span>}

        {/* UPLOAD IMAGEM */}
        <div className={styles.uploadWrapper}>
          <label className={styles.uploadBox}>
            {formData.imagemPreview ? (
              <img src={formData.imagemPreview} alt="Preview" className={styles.uploadPreview} />
            ) : (
              <>
                <span className={styles.uploadIcon}>＋</span>
                <span className={styles.uploadText}>Foto de perfil</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} hidden disabled={loading} />
          </label>
        </div>

        {/* BOTÃO COM LOADING */}
        <button 
          className={styles.button} 
          type="submit" 
          disabled={loading}
          style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>

        <div className={styles.bottomLink}>
          Já tem conta? <a href="/login-usuario">Faça login aqui</a>.
        </div>
      </form>
    </div>
  );
}