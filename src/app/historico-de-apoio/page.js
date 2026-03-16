"use client";

import styles from "./historicoapoio.module.css";

export default function HistoricoDeApoioPage() {
  return (
    <main className={styles.page}>
      <section className={styles.container}>
        <div className={styles.headerContainer}>
          <h1 className={styles.titulo}>Histórico de Apoio</h1>
        </div>
        <div className={styles.emptyState}>Página esvaziada - conteúdo de ONGs removido.</div>
      </section>
    </main>
  );
}
