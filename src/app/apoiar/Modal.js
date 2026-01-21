"use client";

import React from 'react';
import stylesPix from '../apoiar-pix/apoiar-pix.module.css';
import styles from './apoiar.module.css';

export default function Modal({ ong, onClose }){
  const chave = '25.313.327/0001-53';

  const copy = async () => {
    try{
      await navigator.clipboard.writeText(chave);
      alert('Chave copiada!');
    }catch(e){
      alert('Não foi possível copiar');
    }
  }

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
  <div className={styles['modal-content']}>
  <div className={stylesPix.container} style={{maxWidth: '720px', width: '90vw'}} onClick={(e)=>e.stopPropagation()}>
          <button className={stylesPix.closeBtn} onClick={onClose} aria-label="Fechar janela">×</button>
          <div className={stylesPix.qr}>
            <img src="/images/Qrcode.jpg" alt="qr" style={{width:'90%',height:'90%'}} />
          </div>
          <div className={stylesPix.keyLabel}>Se preferir, pague com a chave Pix:</div>
          <div className={stylesPix.keyBox}>
            <div className={stylesPix.keyInput}>{chave}</div>
            <button className={stylesPix.copyBtn} onClick={copy} aria-label="copiar">
              <svg width="18" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 1H4C2.895 1 2 1.895 2 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className={stylesPix.note}>Ao apoiar <strong>{ong}</strong>, você ajuda a manter o trabalho de resgate e cuidado.</div>
          <div className={stylesPix.steps}>
            <div className={stylesPix.step}>
              <div className={stylesPix.stepNum}>1</div>
              <div>Acesse o Pix no app da sua instituição financeira.</div>
            </div>
            <div className={stylesPix.step}>
              <div className={stylesPix.stepNum}>2</div>
              <div>Selecione a ONG que voce quer apoiar.</div>
            </div>
            <div className={stylesPix.step}>
              <div className={stylesPix.stepNum}>3</div>
              <div>Escaneie o QR Code ou copie a chave Pix.</div>
            </div>
            <div className={stylesPix.step}>
              <div className={stylesPix.stepNum}>4</div>
              <div>Selecione o valor, confirme e finalize a transferência.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
