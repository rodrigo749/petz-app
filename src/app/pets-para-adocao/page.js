"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./petsparaadocao.module.css";

export default function PetsParaAdocao() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    const res = await fetch("/api/pets");
    const data = await res.json();
    
    // Filtrar apenas pets para adoção
    const petsAdocao = data.filter((pet) => pet.status === "adocao");
    setPets(petsAdocao);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Pets para Adoção</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                tipoPagina="publica" 
              />
            ))
          ) : (
            <p>Nenhum pet disponível para adoção no momento.</p>
          )}
        </section>
      </div>
    </main>
  );
}
