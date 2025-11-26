"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard";
import "../../styles/petsAdocao.css";

export default function PetsParaAdocao() {
  const [pets, setPets] = useState([]);

  async function carregarPets() {
    const res = await fetch("/api/pets");
    const data = await res.json();
    setPets(data);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  return (
    <main className="pets-container">
      <h1 className="titulo">Pets para Adoção</h1>

      <section className="grid-pets">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </section>
    </main>
  );
}
