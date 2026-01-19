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
      {/* BOTÃO DE FECHAR */}
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>

      

      {/* LADO ESQUERDO - IMAGEM */}
      <div className={styles.imageBox}>
        <img src={pet.imagem || "/images/default.png"} alt={pet.nome} />
        <h2 className={styles.petName}>{pet.nome}</h2>
      </div>

      {/* LADO DIREITO - CAIXA AZUL */}
      <div className={styles.infoBox}>

      {/* área superior com texto de atualização e badge de recompensa */}
      <div className={styles.topMeta}>
        <div className={styles.updatedText}>{pet.atualizado || pet.atualizadoEm || 'Atualizado há 2 semanas'}</div>

        {pet.recompensa && Number(pet.recompensa) > 0 && (
          <div className={styles.rewardBadge} role="status" aria-label={`Recompensa ${pet.recompensa} reais`}>
            {/* ícone moeda (esquerda) com wrapper para bolinha */}
            <span className={styles.coinWrapper} aria-hidden>
              <svg className={styles.coin} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#1f7a2c" fontFamily="Arial">$</text>
              </svg>
            </span>

            <span className={styles.rewardText}>Recompensa R$ {pet.recompensa}</span>

            {/* ícone moeda (direita) com wrapper para bolinha */}
            <span className={styles.coinWrapper} aria-hidden>
              <svg className={styles.coin} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#1f7a2c" fontFamily="Arial">$</text>
              </svg>
            </span>
          </div>
        )}
      </div>

      {/* ícone de patinha no canto (ajustado) */}
      <img
        src="/images/patinha.png"
        alt="patinha"
        className={styles.pawIcon}
      />

      <div className={styles.infoColumns}>

        <div className={styles.infoGroup}>
          <p><strong>Raça:</strong> {pet.raca}</p>
          <p><strong>Gênero:</strong> {pet.genero}</p>
          <p><strong>Local:</strong> {pet.local}</p>
          <p><strong>Data:</strong> {pet.data || '-'}</p>
        </div>

        <div className={styles.respEndGroup}> 
          <p><strong>Recompensa:</strong> {pet.recompensa}</p>
        </div>
      </div>  

        {/* DESCRIÇÃO */}
        <div className={styles.descriptionBox}>
          <p className={styles.descLabel}>Descrição:</p>
          <p className={styles.descText}>{pet.descricao}</p>
        </div>

        {/* BOTÃO */}
        <button className={styles.contactBtn}>Contatar dono</button>

      </div>
    </div>
  </div>
</div>

  );
}
