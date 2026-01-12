"use client";

import { useEffect, useState } from "react";
import PetCard2 from "@/components/PetCard2/PetCard2";
import styles from "./pets-perdidos2.module.css";

export default function PetsPerdidos2() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    const res = await fetch("/api/pets");
    const data = await res.json();
    // Filtrar apenas pets perdidos
    const petsPerdidos = data.filter((pet) => pet.status === "perdido");
    setPets(petsPerdidos);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Pets Perdidos</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard2 key={pet.id} pet={pet} detailsRoute="/pets-perdidos2-detalhes" />
            ))
          ) : (
            <p>Nenhum pet perdido no momento.</p>
          )}
        </section>
      </div>
    </main>
  );
}
