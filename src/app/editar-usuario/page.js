"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPaw } from "react-icons/fa";
import styles from "./editar-usuario.module.css";
import useSafeToast from "@/components/Toast/useSafeToast";

export default function EditarUsuarioPage() {
  const { showToast } = useSafeToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    password: "",
    imagem: "",
    tipo: "usuario",
  });
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      if (u) {
        setFormData({
          nome: u.nome || u.razaoSocial || "",
          cpf: u.cpf || "",
          email: u.email || "",
          telefone: u.telefone || "",
          password: "",
          imagem: u.imagem || "",
          tipo: u.tipo || "usuario",
        });
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imagem: reader.result }));
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const logged = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
      if (!logged || !logged.id) {
        showToast('Usuário não identificado', 'warning');
        return;
      }

      const payload = { ...formData };

      const res = await fetch(`/api/users/${logged.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Erro ao salvar');
        return;
      }

      const updated = await res.json();
      localStorage.setItem('usuarioLogado', JSON.stringify(updated));
      showToast('Dados atualizados', 'success');
      setTimeout(() => router.push('/perfil-usuario'), 1000);
    } catch (err) {
      console.error(err);
      setError('Erro de rede');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Editar Usuário</h1>
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <img src="/images/patinha.png" alt="" className={styles.pawIcon} />
          </span>
          <label className={styles.fieldLabel}>
            <div className={styles.inputInner}>
              <input className={styles.input} type="text" value={formData.nome} onChange={(e) => handleChange('nome', e.target.value)} placeholder={`Nome: ${formData.nome || ''}`} />
            </div>
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <img src="/images/patinha.png" alt="" className={styles.pawIcon} />
          </span>
          <label className={styles.fieldLabel}>
            <div className={styles.inputInner}>
              <input className={styles.input} type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder={`Email: ${formData.email || ''}`} />
            </div>
          </label>
        </div>

        <div className={styles.inputWrapper}>
          <span className={styles.icon} aria-hidden>
            <FaPaw />
          </span>
          <label className={styles.fieldLabel}>
            <div className={styles.inputInner}>
              <input className={styles.input} type="tel" value={formData.telefone} onChange={(e) => handleChange('telefone', e.target.value)} placeholder={`Telefone: ${formData.telefone || ''}`} />
            </div>
          </label>
        </div>

        <div className={styles.inputRow}>
          <div className={`${styles.inputWrapper} ${styles.halfInput}`}>
            <span className={styles.icon} aria-hidden>
              <img src="/images/patinha.png" alt="" className={styles.pawIcon} />
            </span>
            <label className={styles.fieldLabel}>
              <div className={styles.inputInner}>
                <input className={styles.input} type="password" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} placeholder={`Senha: ${formData.password || ''}`} />
              </div>
            </label>
          </div>

          <div>
            <button type="button" className={styles.changePassword} onClick={() => router.push('/alterar-senha')}>Alterar Senha</button>
          </div>
        </div>

        <div className={styles.uploadWrapper}>
          <div className={styles.uploadImagem}>
            <label htmlFor="usuario-imagem">
              <div className={styles.uploadBox}>
                {formData.imagem ? (
                  <img src={formData.imagem} alt="Preview" className={styles.uploadPreview} />
                ) : (
                  <>
                    <img src="/images/iconephoto.png" className={styles.iconeAddImg} alt="Adicionar" />
                    <span className={styles.uploadText}>Adicionar imagem</span>
                  </>
                )}
              </div>
            </label>
            <input id="usuario-imagem" type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className={styles.deleteBtn} onClick={async () => {
            if (!confirm('Excluir conta?')) return;
            try {
              const logged = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
              if (!logged || !logged.id) return;
              const res = await fetch(`/api/users/${logged.id}`, { method: 'DELETE' });
              if (!res.ok) throw new Error('Erro ao excluir');
              localStorage.removeItem('usuarioLogado');
              router.push('/');
            } catch (err) { console.error(err); showToast('Erro ao excluir','error'); }
          }}>Excluir conta</button>

          <button className={styles.button} type="submit">Confirmar</button>
        </div>
      </form>
    </div>
  );
}
