'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./perdidos.module.css";

export default function CadastrarPerdidos() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: "",
    especie: "",
    raca: "",
    genero: "",
    local: "",
    dataPerda: "",
    descricao: "",
    recompensa: 0,
    imagemPreview: "",
  });

  const [imagemFile, setImagemFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const getBaseUrl = () =>
    (process.env.NEXT_PUBLIC_PETZ_API_URL ||
      `http://localhost:${process.env.PORT || 3000}`)
      .trim()
      .replace(/\/$/, "");

  // ================= UPLOAD =================
  const uploadImage = async (file) => {
    const baseUrl = getBaseUrl();
    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      body: fd,
    });

    if (!res.ok) throw new Error("Erro no upload");

    const data = await res.json();
    return data.url;
  };

  // ================= IMAGEM =================
  const handleImagem = async (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    const maxMB = 5;
    if (arquivo.size > maxMB * 1024 * 1024) {
      alert(`Imagem maior que ${maxMB}MB`);
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      alert("Arquivo inválido");
      return;
    }

    setImagemFile(arquivo);

    // preview local imediato
    const previewUrl = URL.createObjectURL(arquivo);

    setFormData((prev) => ({
      ...prev,
      imagemPreview: previewUrl,
    }));
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // ================= SALVAR PET =================
  const salvarPet = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      let finalImageUrl = "/images/semfoto.jpg";

      // upload se tiver imagem
      if (imagemFile) {
        finalImageUrl = await uploadImage(imagemFile);
      }

      const payload = {
        name: formData.nome.trim(),
        species: formData.especie,
        breed: formData.raca || null,
        gender: formData.genero || null,
        dateLost: formData.dataPerda || null,
        location: formData.local || null,
        reward: Number(formData.recompensa) || 0,
        description: formData.descricao || null,
        image: finalImageUrl,
        status: "lost",
        userId: 1,
      };

      const res = await fetch(`${getBaseUrl()}/api/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao cadastrar pet");
      }

      alert("Pet cadastrado com sucesso!");

      // limpar formulário
      setFormData({
        nome: "",
        especie: "",
        raca: "",
        genero: "",
        local: "",
        dataPerda: "",
        descricao: "",
        recompensa: 0,
        imagemPreview: "",
      });

      setImagemFile(null);

      router.push("/meus-pets-perdidos");

    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar pet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.cadastroPetContainer}>
      <div className={styles.adocaoContainer}>

        {/* COLUNA ESQUERDA */}
        <section className={styles.leftSide}>
          <div className={styles.uploadImagem}>
            <label htmlFor="pet-imagem">
              <div className={styles.uploadBox}>
                {formData.imagemPreview ? (
                  <img
                    src={formData.imagemPreview}
                    alt="Preview"
                    className={styles.previewImagem}
                  />
                ) : (
                  <span>Adicionar imagem</span>
                )}
              </div>
            </label>

            <input
              type="file"
              id="pet-imagem"
              accept="image/*"
              hidden
              onChange={handleImagem}
              disabled={loading}
            />
          </div>

          <textarea
            placeholder="Descreva o pet aqui..."
            value={formData.descricao}
            onChange={(e) => handleChange("descricao", e.target.value)}
            className={styles.descricaoTextarea}
          />
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.rightSide}>
          <h2 className={styles.tituloCadastro}>Cadastrar Pet Perdido</h2>

          <form className={styles.formCadastro} onSubmit={salvarPet}>

            <input
              type="text"
              placeholder="Nome"
              value={formData.nome}
              onChange={(e) => handleChange("nome", e.target.value)}
            />

            <select
              value={formData.especie}
              onChange={(e) => handleChange("especie", e.target.value)}
            >
              <option value="">Selecione a espécie</option>
              <option value="dog">Cachorro</option>
              <option value="cat">Gato</option>
              <option value="rabbit">Coelho</option>
              <option value="guinea-pig">Porquinho-da-índia</option>
              <option value="hamster">Hamster</option>
              <option value="chinchila">Chinchila</option>
              <option value="ferret">Furão</option>
              <option value="cockatiel">Calopsita</option>
              <option value="parakeet">Periquito</option>
              <option value="parrot">Papagaio</option>
              <option value="turtle">Tartaruga</option>
            </select>

            <input
              type="text"
              placeholder="Raça"
              value={formData.raca}
              onChange={(e) => handleChange("raca", e.target.value)}
            />

            <input
              type="text"
              placeholder="Gênero"
              value={formData.genero}
              onChange={(e) => handleChange("genero", e.target.value)}
            />

            <input
              type="text"
              placeholder="Local"
              value={formData.local}
              onChange={(e) => handleChange("local", e.target.value)}
            />

            <input
              type="date"
              value={formData.dataPerda}
              onChange={(e) => handleChange("dataPerda", e.target.value)}
            />

            <div>
              <label>Recompensa: R$ {formData.recompensa}</label>
              <input
                type="range"
                min="0"
                max="100000"
                value={formData.recompensa}
                onChange={(e) => handleChange("recompensa", e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}