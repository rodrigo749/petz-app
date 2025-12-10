"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../editaradocao.module.css";

export default function EditarCadastroAdocao() {
  const router = useRouter();
  const { id: petId } = useParams();

  const [formData, setFormData] = useState({
    nome: "",
    raca: "",
    genero: "",
    idade: "",
    descricao: "",
    imagem: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // ========= CARREGAR DADOS DO PET =========
  useEffect(() => {
    async function carregarPet() {
      try {
        if (!petId) return;

        const res = await fetch("/api/pets");
        if (!res.ok) {
          console.error("Erro ao buscar pets:", res.status);
          return;
        }

        const data = await res.json();
        const pet = data.find((p) => String(p.id) === String(petId));

        if (!pet) {
          console.error("Pet não encontrado para o id:", petId);
          return;
        }

        setFormData({
          nome: pet.nome || "",
          raca: pet.raca || "",
          genero: pet.genero || "",
          idade: pet.idade || "",
          descricao: pet.descricao || "",
          imagem: pet.imagem || "",
        });
      } catch (error) {
        console.error("Erro ao carregar pet:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarPet();
  }, [petId]);

  // ========= HANDLERS =========

  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagem = (e) => {
    const arquivo = e.target.files[0];
    if (arquivo) setImagemFile(arquivo);
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();

    try {
      let imagemURL = formData.imagem;

      if (imagemFile) {
        const imgData = new FormData();
        imgData.append("file", imagemFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: imgData,
        });

        const uploadData = await uploadRes.json();
        imagemURL = uploadData.url;
      }

      const petAtualizado = { ...formData, imagem: imagemURL };

      await fetch(`/api/pets/${petId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(petAtualizado),
      });

      alert("Pet atualizado com sucesso!");
      router.push("/seus-pets-para-adocao");
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      alert("Erro ao salvar edição do pet.");
    }
  };

  const excluirPet = async () => {
    if (!confirm("Tem certeza que deseja excluir este pet?")) return;

    try {
      await fetch(`/api/pets/${petId}`, { method: "DELETE" });
      alert("Pet excluído com sucesso!");
      router.push("/seus-pets-para-adocao");
    } catch (error) {
      console.error("Erro ao excluir pet:", error);
      alert("Erro ao excluir pet.");
    }
  };

  // ========= RENDER =========

  if (carregando) {
    return <p style={{ color: "#fff", textAlign: "center" }}>Carregando pet...</p>;
  }

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.adocaoContainer}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.leftSide}>
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {imagemFile ? (
                  <img
                    src={URL.createObjectURL(imagemFile)}
                    alt="Pré-visualização"
                    className={styles.previewImagem}
                  />
                ) : formData.imagem ? (
                  <img
                    src={formData.imagem}
                    alt="Imagem atual"
                    className={styles.previewImagem}
                  />
                ) : (
                  <>
                    <img
                      src="/images/iconephoto.png"
                      alt="Adicionar imagem"
                      className={styles.iconeAddImg}
                    />
                    <span>Adicionar imagem</span>
                  </>
                )}
              </div>
            </label>

            <input
              type="file"
              id="pet-imagem"
              accept="image/*"
              hidden
              onChange={handleImagem}
            />
          </div>

          <div className={styles.campoDescricao}>
            <img
              src="/images/patinha.png"
              alt="patinha"
              className={styles.iconeDescricao}
            />

            <textarea
              name="descricao"
              className={styles.descricaoTextarea}
              placeholder="Descreva o pet aqui..."
              value={formData.descricao}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.rightSide}>
          <h2 className={styles.tituloCadastro}>Editar Pet para Adoção</h2>

          <form className={styles.formCadastro} onSubmit={salvarEdicao}>
            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={formData.nome}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="raca"
                placeholder="Raça"
                value={formData.raca}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="genero"
                placeholder="Gênero"
                value={formData.genero}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                name="idade"
                placeholder="Idade"
                value={formData.idade}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className={styles.botoesEdicao}>
              <button type="submit" className={styles.btnSalvar}>
                Salvar
              </button>
              <button
                type="button"
                className={styles.btnExcluir}
                onClick={excluirPet}
              >
                Excluir
              </button>
            </div>
          </form>
        </section>

      </div>
    </main>
  );
}
