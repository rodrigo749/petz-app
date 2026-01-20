"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './apoiar-pix.module.css';

export default function ApoiarPixPage(){
  const search = useSearchParams();
  const [ong, setOng] = useState(() => search.get('ong') || 'ONG');
  const chave = '25.313.327/0001-53';

  // update ong state whenever the search params change
  useEffect(()=>{
    const value = search.get('ong') || 'ONG';
    setOng(value);
  }, [String(search)]);

  const copy = async () => {
    try{
      await navigator.clipboard.writeText(chave);
      alert('Chave copiada!');
    }catch(e){
      alert('Não foi possível copiar');
    }
  }

  return (
    <div className={styles['pix-page']}>
      <div className={styles.container}>
           <div className={styles.qr}>
             <img src="/images/Qrcode.jpg" alt="qr" style={{width:'90%',height:'90%'}} />
           </div>
           
        <div className={styles.keyLabel}>Se preferir, pague com a chave Pix:</div>
        <div className={styles.keyBox}>
          <div className={styles.keyInput}>{chave}</div>
          <button className={styles.copyBtn} onClick={copy} aria-label="copiar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 1H4C2.895 1 2 1.895 2 3V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="8" y="5" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 13H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.note}>Ao apoiar <strong>{ong}</strong>, você ajuda a manter o trabalho de resgate e cuidado.</div>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNum}>1</div>
            <div>Acesse o Pix no app da sua instituição financeira.</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}></div>
            <div>Selecione a ONG na qualghjgjghjghjgj quer apoiar</div>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNum}>3</div>
            <div>Escaneie o QR kllkjklçjkjjk copie a chave Pix.</div>
          </div>
          <div className={styles.step}>
            <div>Selecione o aaasadsadasvalor, cosadasdasdasdasnfirme e finalize a transferênciaafdgddfdffsdfsdf.</div>
          </div>
        </div>

      </div>
    </div>
  )
}
