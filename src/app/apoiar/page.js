"use client";

import styles from './apoiar.module.css';

export default function ApoiarPage() {
  const copyEmail = () => {
    navigator.clipboard.writeText('carolbazoli@gmail.com');
  };

  return (
    <main className={styles['apoiar-page']}>
      <link href="https://fonts.googleapis.com/css2?family=Baloo+Thambi+2:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
      <div className={styles.topLeftMessage}>Ajude nossos pets!</div>
      <div className={styles.topLeft2Message}>sua doação mantém nossos resgates ativos.</div>
      <div className={styles.scanText}>Escaneie para apoiar</div>
      <div className={styles['email-container']}>
        <div className={styles.scanChave}>carolbazoli@gmail.com</div>
        <button className={styles['copy-button']} onClick={copyEmail} type="button">
          Copiar Chave
        </button>
      </div>
      <div className={styles.qrImage}>
        <img src="/images/QR.png" alt="QR Code para doação" />
      </div>
      <div style={{ textAlign: 'center', padding: '2rem', minHeight: '50vh' }}></div>
      <div className={styles['dogs-image']}>
        <img src="/images/Dogs.png" alt="Dogs" />
      </div>
    </main>
  );
}
