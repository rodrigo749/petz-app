"use client";

import { useState } from "react";
import ModalPet from "@/components/ModalPet/ModalPet";
import styles from "@/app/pets-para-adocao/petsparaadocao.module.css";

export default function PetCard({ pet }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles["card-pet"]}>
        
        <div className={styles["card-image-wrapper"]}>
          <img
            src={pet.imagem || "/images/default.png"}
            alt={pet.nome}
            className={styles["card-image"]}
          />
        </div>

        <div className={styles["content-column"]}>
          <div className={styles["card-text-box"]}>
            <h3>{pet.nome}</h3>
            <p>Raça: {pet.raca}</p>
            <p>Gênero: {pet.genero}</p>
            <p>Idade: {pet.idade}</p>
            <p>Descrição: {pet.descricao}</p>
          </div>

          <button className={styles["btn-adotar"]} onClick={() => setOpen(true)}>
            Adotar
          </button>
        </div>

      </div>

      {open && <ModalPet pet={pet} onClose={() => setOpen(false)} />}
    </>
  );
}
