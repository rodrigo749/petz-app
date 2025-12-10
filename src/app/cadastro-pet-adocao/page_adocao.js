"use client";

import { useState } from "react";
import styles from "./adocao.module.css";

export default function CadastroAdocao() {
  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    genero: "",
    idade: "",
    descricao: "",
  });

  const [imagemFile, setImagemFile] = useState(null);

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagem = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) setImagemFile(arquivo);
  };

  const salvarPet = async (e) => {
    e.preventDefault();

    let imagemURL = "/images/semfoto.jpg";

    if (imagemFile) {
      const imgData = new FormData();
      imgData.append("file", imagemFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: imgData,
      });

      const uploadData = await uploadRes.json();
      imagemURL = uploadData.url;
    }

    const novoPet = { ...formData, imagem: imagemURL };

    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novoPet),
    });

    if (res.ok) {
      alert("Pet cadastrado com sucesso!");
      window.location.reload();
    } else {
      alert("Erro ao cadastrar pet.");
    }
  };

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.adocaoContainer}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.leftSide}>
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {imagemFile ? (
    <img
      src={URL.createObjectURL(imagemFile)}
      alt="Pré-visualização"
      className={styles.previewImagem}
    />
  ) : (
    <>
      <img
        src="/images/iconephoto.png"
        alt="Adicionar"
        className={styles.iconeAddImg}
      />
      <span>Adicionar imagem</span>
    </>
  )}
              </div>
            </label>

            <input
              type="file"
              id="pet-imagem"
              accept="image/*"
              hidden
              onChange={handleImagem}
            />
          </div>

            <div className={styles.campoDescricao}>
            <img
              src="/images/patinha.png"
              alt="patinha"
              className={styles.iconeDescricao}
            />

            <textarea
              name="descricao"
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            ></textarea>
            </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.rightSide}>
          <h2 className={styles.tituloCadastro}>Cadastro Pet Adoção</h2>

          <form className={styles.formCadastro} onSubmit={salvarPet}>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="raca"
                placeholder="Raça"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="genero"
                placeholder="Gênero"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="idade"
                placeholder="Idade"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className={styles.btnCadastrar}>
              Cadastrar
            </button>
          </form>
        </section>

      </div>
    </main>
  );
}
