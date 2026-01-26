"use client";

import { useEffect, useState } from "react";
import PetCard from "@/components/PetCard/PetCard";
import styles from "./pets-perdidos.module.css";
import { uploadImage, savePet } from "@/lib/apiPets";

export default function PetsPerdidos() {
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // form state
  const [nome, setNome] = useState("");
  const [raca, setRaca] = useState("");
  const [genero, setGenero] = useState("");
  const [local, setLocal] = useState("");
  const [dataPerda, setDataPerda] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recompensa, setRecompensa] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function carregarPets() {
    const res = await fetch("/api/pets-perdidos");
    const data = await res.json();
    setPets(data);
  }

  useEffect(() => {
    carregarPets();
  }, []);

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // validação mínima
    if (!nome.trim() || !descricao.trim()) {
      setMessage("Por favor preencha pelo menos o nome e a descrição.");
      return;
    }

    const body = {
      nome,
      raca,
      genero,
      data: dataPerda,
      local,
      recompensa,
      descricao,
      imagem: "",
      status: "perdido",
    };

    try {
      setLoading(true);
      if (file) {
        body.imagem = await uploadImage(file);
      }
      const created = await savePet(body);
      setMessage("Pet cadastrado com sucesso!");
      // limpar formulário
      setNome("");
      setRaca("");
      setGenero("");
      setLocal("");
      setDataPerda("");
      setDescricao("");
      setRecompensa(0);
      setFile(null);
      setPreview(null);

      // refresh list
      carregarPets();
      // optionally navigate to edit page if API returned created object with id
      if (created && created.id) {
        window.location.href = `/perdidos/${created.id}`;
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles["pets-page"]}>
      <div className={styles["cards-wrapper-container"]}>
        <h1 className={styles.titulo}>Pets Perdidos</h1>

        <section className={styles["grid-pets"]}>
          {pets.length > 0 ? (
            pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} tipoPagina="perdidos" />
            ))
          ) : (
            <p>Nenhum pet perdido no momento.</p>
          )}
        </section>
      </div>
    </main>
  );
}
