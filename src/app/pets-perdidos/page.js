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
    const res = await fetch("/api/pets");
    const data = await res.json();
    // Filtrar apenas pets perdidos
    const petsPerdidos = data.filter((pet) => pet.status === "perdido");
    setPets(petsPerdidos);
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

        <div style={{ marginBottom: 16 }}>
          <button onClick={() => setShowForm((s) => !s)} className={styles.btnCadastrar}>
            {showForm ? "Voltar à lista" : "Cadastrar pet perdido"}
          </button>
        </div>

        {showForm ? (
          <section>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nome</label>
                <input value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
              <div>
                <label>Raça</label>
                <input value={raca} onChange={(e) => setRaca(e.target.value)} />
              </div>
              <div>
                <label>Gênero</label>
                <input value={genero} onChange={(e) => setGenero(e.target.value)} />
              </div>
              <div>
                <label>Local</label>
                <input value={local} onChange={(e) => setLocal(e.target.value)} />
              </div>
              <div>
                <label>Data da perda</label>
                <input type="date" value={dataPerda} onChange={(e) => setDataPerda(e.target.value)} />
              </div>
              <div>
                <label>Descrição</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
              </div>
              <div>
                <label>Recompensa</label>
                <input type="number" value={recompensa} onChange={(e) => setRecompensa(Number(e.target.value))} />
              </div>
              <div>
                <label>Imagem</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="preview" style={{ maxWidth: 180, marginTop: 8 }} />}
              </div>

              <div style={{ marginTop: 12 }}>
                <button type="submit" className={styles.btnCadastrar} disabled={loading}>{loading ? 'Salvando...' : 'Cadastrar'}</button>
              </div>

              {message && (
                <div style={{ marginTop: 12, color: message.includes('sucesso') ? 'green' : 'red' }}>{message}</div>
              )}
            </form>
          </section>
        ) : (
          <section className={styles["grid-pets"]}>
            {pets.length > 0 ? (
              pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))
            ) : (
              <p>Nenhum pet perdido no momento.</p>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
