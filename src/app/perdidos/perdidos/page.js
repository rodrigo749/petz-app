"use client";

import { useEffect, useState } from "react";
import styles from "../perdidos.module.css";
import { FaImage } from 'react-icons/fa';

const exemplos = [
  { id: 1, nome: "Pintadinho", raca: "vira-lata", genero: "Macho", rua: "Rua das Flores, 12", imagem: "/images/cachorro-pagina-principal.png" },
  { id: 2, nome: "Spiker", raca: "vira-lata", genero: "Macho", rua: "Av. Brasil, 45", imagem: "/images/cachorro-pagina-principal 2.png" },
  { id: 3, nome: "Pom Pom", raca: "vira-lata", genero: "Macho", rua: "Rua do Mercado, 7", imagem: "/images/Logo.png" },
  { id: 4, nome: "Tom", raca: "Viralata", genero: "Macho", rua: "Rua Alegria, 22", imagem: "/images/cachorro-pagina-principal.png" },
  { id: 5, nome: "Max", raca: "Golden", genero: "Fêmea", rua: "Rua Bela Vista, 95", imagem: "/images/cachorro-pagina-principal 2.png" },
  { id: 6, nome: "Spike", raca: "Viralata", genero: "Fêmea", rua: "Rua D, 15", imagem: "/images/Logo.png" },
  { id: 7, nome: "Frajola", raca: "Viralata", genero: "Macho", rua: "Av. João, 120", imagem: "/images/cachorro-pagina-principal.png" },
  { id: 8, nome: "Luna", raca: "Viralata", genero: "Macho", rua: "Rua Primavera, 9", imagem: "/images/cachorro-pagina-principal 2.png" },
  { id: 9, nome: "Bob", raca: "Rottweiler", genero: "Macho", rua: "Rua São Paulo, 33", imagem: "/images/Logo.png" },
  { id: 10, nome: "Mimi", raca: "Siamês", genero: "Fêmea", rua: "Rua dos Pinheiros, 58", imagem: "/images/cachorro-pagina-principal.png" },
  { id: 11, nome: "Nina", raca: "Poodle", genero: "Fêmea", rua: "Rua do Sol, 11", imagem: "/images/cachorro-pagina-principal 2.png" },
  { id: 12, nome: "Toto", raca: "Bulldog", genero: "Macho", rua: "Praça Central, 1", imagem: "/images/Logo.png" }
];

export default function PetsPerdidosPage() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('petsPerdidos') || 'null');
      if (Array.isArray(stored) && stored.length) {
        setPets(stored);
      } else {
        setPets(exemplos);
      }
    } catch (e) {
      setPets(exemplos);
    }
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
  <h2 className={styles.title}>Pets Perdidos</h2>
        <div className={styles.grid}>
          {pets.map(p => (
            <article className={styles.card} key={p.id}>
              <div className={styles.photoIcon} aria-hidden>
                <FaImage className={styles.photoSvg} />
              </div>
              <div className={styles.info}>
                <h3 className={styles.name}>{p.nome}</h3>
                <p>Raça: {p.raca}</p>
                <p>Gênero: {p.genero}</p>
                <p>Rua: {p.rua}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
