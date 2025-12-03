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

          {/* IMAGEM GRANDE */}
          <div className={styles.imageBox}>
            <img src={pet.imagem || "/images/default.png"} alt={pet.nome} />
            <h2 className={styles.petName}>{pet.nome}</h2>
            
          </div>

          {/* INFORMAÇÕES */}
          <div className={styles.infoBox}>
            <p><strong>Raça:</strong> {pet.raca}</p>
            <p><strong>Gênero:</strong> {pet.genero}</p>
            <p><strong>Idade:</strong> {pet.idade}</p>
            <p><strong>Descrição:</strong> {pet.descricao}</p>

            <button className={styles.contactBtn}>
              Contatar ONG
            </button>
          </div>

        </div>

        

      </div>
    </div>
  );
}
