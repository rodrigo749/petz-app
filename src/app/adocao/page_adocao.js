"use client";

import styles from "./adocao.module.css";

export default function CadastroAdocao() {

  // Função para sumir o placeholder ao clicar
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  // Função para voltar o placeholder ao sair
  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
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
              <img src="/images/iconephoto.png" alt="Adicionar" className={styles.iconeAddImg} />
              <span>Adicionar imagem</span>
            </div>

            </label>
            <input type="file" id="pet-imagem" accept="image/*" hidden />
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
              placeholder="Descreva o pet aqui..."
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </div>

        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.colDireita}>
          <h2 className={styles.tituloCadastro}>Cadastro Pet Adoção</h2>

          <form id="form-cadastro-pet" className={styles.formCadastro}>

            {/* Nome */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="nome"
                placeholder="Nome:"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Raça */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="raca"
                placeholder="Raça:"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Gênero */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="genero"
                placeholder="Gênero:"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Idade */}
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} alt="patinha" />
              <input
                type="text"
                name="idade"
                placeholder="Idade:"
                onFocus={handleFocus}
                onBlur={handleBlur}
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