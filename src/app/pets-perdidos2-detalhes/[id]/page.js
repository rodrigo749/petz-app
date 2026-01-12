"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../detalhes.module.css";

export default function PetPerdidoDetalhes({ params }) {
  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function carregarPet() {
      try {
        const res = await fetch("/api/pets");
        if (!res.ok) throw new Error("Erro ao carregar dados");
        
        const pets = await res.json();
        const petEncontrado = pets.find((p) => p.id === parseInt(params.id));
        
        if (!petEncontrado) {
          setError("Pet não encontrado");
          return;
        }
        
        setPet(petEncontrado);
      } catch (err) {
        console.error("Erro:", err);
        setError("Erro ao carregar dados do pet");
      } finally {
        setIsLoading(false);
      }
    }

    carregarPet();
  }, [params.id]);

  if (isLoading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.errorBox}>
          <h2>{error}</h2>
          <Link href="/pets-perdidos2" className={styles.btnVoltar}>
            ← Voltar para Pets Perdidos
          </Link>
        </div>
      </main>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <main className={styles.container}>
      <div className={styles.petDetailsCard}>
        {/* COLUNA ESQUERDA - IMAGEM E NOME */}
        <section className={styles.leftSection}>
          <div className={styles.imageBox}>
            <img
              src={pet.imagem || "/images/semfoto.jpg"}
              alt={pet.nome}
              className={styles.imagemPet}
            />
          </div>
          <h1 className={styles.nomePet}>{pet.nome}</h1>
        </section>

        {/* COLUNA DIREITA - INFORMAÇÕES */}
        <section className={styles.rightSectionWrapper}>
          <div className={styles.rightSection}>
            <div className={styles.settingsIcon}>⚙️</div>
            <div className={styles.headerInfo}>
              <h2 className={styles.racaPet}>Raça: {pet.raca || "Pug"}</h2>
              <div className={styles.statusBadge}>Atualizado há 2 semanas</div>
              <div className={styles.recompensaBadge}>
                💰 Recompensa: R$ {pet.recompensa || 100}
              </div>
            </div>

            <div className={styles.infoContainer}>
              <div className={styles.infoRow}>
                <span className={styles.label}>Gênero:</span>
                <span className={styles.value}>{pet.genero || "Macho"}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Última localização:</span>
                <span className={styles.value}>{pet.local || "Centro"}</span>
              </div>

              <div className={styles.infoRow}>
                <span className={styles.label}>Última localização:</span>
                <span className={styles.value}>{pet.local || "Centro"}</span>
              </div>
            </div>

            {/* DESCRIÇÃO */}
            <div className={styles.descricaoBox}>
              <label className={styles.descLabel}>Descrição:</label>
              <div className={styles.descricaoContainer}>
                <div className={styles.descricaoArea}>
                  {pet.descricao ||
                    "Cão dende pelo nome de Zé Zeus tem pelagem curta e um sinal na cara e doci e marrno"}
                </div>
              </div>
            </div>

            {/* BOTÃO CONTATO */}
            <button className={styles.btnContato}>Contatar Dono</button>
          </div>
        </section>
      </div>
    </main>
  );
}
