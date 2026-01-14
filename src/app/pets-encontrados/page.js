"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./pets-encontrados.module.css";

export default function PetsEncontrados() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    const res = await fetch("/api/pets-perdidos");
    const data = await res.json();
    // Filtrar apenas pets encontrados/achados (status: 'encontrado' ou 'achado')
    const encontrados = data.filter((pet) => pet.status === "encontrado" || pet.status === "achado");
    setPets(encontrados);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Pets Encontrados</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tipoPagina="encontrados" />
            ))
          ) : (
            <p>Nenhum pet encontrado no momento.</p>
          )}
        </section>
      </div>
    </main>
  );
}
