"use client";

import { useState } from "react";
import styles from "./encontrados.module.css";

export default function Encontrados() {

  const [recompensa, setRecompensa] = useState(0);

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.cadastroWrapper}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.colEsquerda}>

          {/* UPLOAD */}
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                <img src="/images/iconephoto.png" className={styles.iconeAddImg} />
                <span>Adicionar imagem</span>
              </div>
            </label>
            <input type="file" id="pet-imagem" hidden accept="image/*" />
          </div>

          {/* DESCRIÇÃO */}
          <div className={styles.descricaoBox}>
            <label className={styles.descLabel}>
              <img src="/images/patinha01.png" className={styles.descIcon} />
              Descrição:
            </label>

            <textarea
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              rows="8"
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.colDireita}>
          <div className={styles.tituloArea}>
            <h2 className={styles.tituloCadastro}>Editar Pet Perdido</h2>
            <img src="/images/homepet.png" className={styles.iconHome} />
          </div>

          <form className={styles.formCadastro}>

            {/* Campo padrão */}
            {["Nome", "Raça", "Gênero", "Local", "Data"].map((campo) => (
              <div className={styles.campo} key={campo}>
                <img src="/images/patinha01.png" className={styles.iconeInput} />
                <input
                  type="text"
                  placeholder={campo + ":"}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </div>
            ))}

            {/* SLIDER RECOMPENSA */}
            <div className={styles.recompensaBox}>
              <div className={styles.recompensaWrapper}>
                <div className={styles.recompensaLabelWrapper}>
                  <label className={styles.recompensaLabel}>Recompensa</label>
                </div>
                <div className={styles.recompensaRow}>
                  <img src="/images/patinha01.png" className={styles.iconeRecompensa} />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={recompensa}
                    onChange={(e) => setRecompensa(e.target.value)}
                    className={styles.slider}
                  />
                  <span className={styles.valorRecompensa}>R$ {recompensa}</span>
                </div>
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button type="button" className={styles.btnEditar}>Editar</button>
              <button type="button" className={styles.btnExcluir}>Excluir</button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
