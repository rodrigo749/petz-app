"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./pets-adotados.module.css";

export default function petsEcontrados() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    const res = await fetch("/api/pets");
    const data = await res.json();
     //Filtrar apenas pets para adoção
    const petsAdotados = data.filter((pet) => pet.status === "adotado");
    setPets(petsAdotados);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Pets Adotados</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))
          ) : (
            <p>Nenhum pet adotado no momento.</p>
          )}
        </section>
      </div>
    </main>
  );
}