"use client";

import styles from "./ModalPet.module.css";

export default function ModalPet({ pet, onClose }) {
  function handleBackgroundClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
<div className={styles.overlay} onClick={handleBackgroundClick}>
  <div className={styles.modal}>

    <div className={styles.modalContent}>

      {/* LADO ESQUERDO - IMAGEM */}
      <div className={styles.imageBox}>
        <img src={pet.imagem || "/images/default.png"} alt={pet.nome} />
        <h2 className={styles.petName}>{pet.nome}</h2>
      </div>

      {/* LADO DIREITO - CAIXA AZUL */}
      <div className={styles.infoBox}>

      <img
        src="/images/patinhabranca.png"
        alt="patinha"
        className={styles.pawIcon}
      />

      <div className={styles.infoColumns}>

        <div className={styles.infoGroup}>
          <p><strong>Raça:</strong> {pet.raca}</p>
          <p><strong>Gênero:</strong> {pet.genero}</p>
          <p><strong>Idade:</strong> {pet.idade}</p>
        </div>

        <div className={styles.respEndGroup}> 
          <p><strong>Responsável:</strong> {pet.responsavel}</p>
          <p><strong>Endereço:</strong> {pet.endereco}</p>
        </div>
      </div>  

        {/* DESCRIÇÃO */}
        <div className={styles.descriptionBox}>
          <p className={styles.descLabel}>Descrição:</p>
          <p className={styles.descText}>{pet.descricao}</p>
        </div>

        {/* BOTÃO */}
        <button className={styles.contactBtn}>Contatar ONG</button>

      </div>
    </div>
  </div>
</div>

  );
}
