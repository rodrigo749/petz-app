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
    imagem: "", // aqui vamos salvar apenas o nome ou caminho da imagem
  });

  // Função para sumir o placeholder ao clicar
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  // Função para voltar o placeholder ao sair
  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  // Atualizar valores dos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Upload da imagem (apenas armazenamos o nome por enquanto)
  const handleImagem = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) {
      setFormData((prev) => ({ ...prev, imagem: arquivo.name }));
    }
  };

  // Enviar dados para /api/pets
  const salvarPet = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      alert("Pet cadastrado com sucesso!");

      // limpar formulário
      setFormData({
        nome: "",
        raca: "",
        genero: "",
        idade: "",
        descricao: "",
        imagem: "",
      });

      document.getElementById("form-cadastro-pet").reset();
    } else {
      alert("Erro ao cadastrar pet.");
    }
  };

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.cadastroWrapper}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.colEsquerda}>
          {/* Upload da imagem */}
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                <img
                  src="/images/iconephoto.png"
                  alt="Adicionar"
                  className={styles.iconeAddImg}
                />
                <span>Adicionar imagem</span>
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

          {/* Descrição */}
          <div className={styles.descricaoBox}>
            <label htmlFor="descricao-pet" className={styles.descricaoLabel}>
              Descrição:
            </label>

            <textarea
              id="descricao-pet"
              rows="8"
              className={styles.descricaoTextarea}
              name="descricao"
              placeholder="Descreva o pet aqui..."
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.colDireita}>
          <h2 className={styles.tituloCadastro}>Cadastro Pet Adoção</h2>

          <form id="form-cadastro-pet" className={styles.formCadastro} onSubmit={salvarPet}>

            {/* Nome */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            {/* Raça */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="raca"
                placeholder="Raça"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            {/* Gênero */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="genero"
                placeholder="Gênero"
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            {/* Idade */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
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
