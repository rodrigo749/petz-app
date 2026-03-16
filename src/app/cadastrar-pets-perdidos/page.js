'use client'

import { useState, useEffect } from "react";
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

  // ================= FOCUS/BLUR HANDLERS =================
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    if (e.target.type !== "range" && e.target.type !== "date") {
      e.target.placeholder = "";
    }
  };

  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder || "";
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

  // cleanup blob ao desmontar
  useEffect(() => {
    return () => {
      if (formData.imagemPreview && formData.imagemPreview.startsWith("blob:")) {
        try { URL.revokeObjectURL(formData.imagemPreview); } catch {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                  <>
                    <img
                      src="/images/iconephoto.png"
                      alt="Adicionar"
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
              disabled={loading}
            />
          </div>

          <div className={styles.campoDescricao}>
            <img
              src="/images/patinha.png"
              alt="patinha"
              className={styles.iconeDescricao}
            />
            <textarea
              placeholder="Descreva o pet aqui..."
              value={formData.descricao}
              onChange={(e) => handleChange("descricao", e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              className={styles.descricaoTextarea}
            />
          </div>
        </section>

        {/* COLUNA DIREITA */}
        <section className={styles.rightSide}>
          <h2 className={styles.tituloCadastro}>Cadastrar Pet Perdido</h2>

          <form className={styles.formCadastro} onSubmit={salvarPet}>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Nome"
                value={formData.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <select
                value={formData.especie}
                onChange={(e) => handleChange("especie", e.target.value)}
              >
                <option value="" disabled>Selecione a espécie</option>
                <option value="dog">Cachorro</option>
                <option value="cat">Gato</option>
                <option value="rabbit">Coelho</option>
                <option value="hamster">Hamster</option>
                <option value="cockatiel">Calopsita</option>
                <option value="parakeet">Periquito</option>
                <option value="parrot">Papagaio</option>
                <option value="turtle">Tartaruga</option>
              </select>
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Raça"
                value={formData.raca}
                onChange={(e) => handleChange("raca", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Gênero"
                value={formData.genero}
                onChange={(e) => handleChange("genero", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="text"
                placeholder="Local"
                value={formData.local}
                onChange={(e) => handleChange("local", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <div className={styles.campo}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <input
                type="date"
                value={formData.dataPerda}
                onChange={(e) => handleChange("dataPerda", e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className={styles.dateInput}
              />
              <svg 
                className={styles.calendarIcon}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>

            <div className={styles.campoRecompensa}>
              <img src="/images/patinha.png" className={styles.iconeInput} />
              <div className={styles.sliderContainer}>
                <div className={styles.sliderHeader}>
                  <span className={styles.sliderLabel}>Recompensa:</span>
                  <span className={styles.valorRecompensa}>R$ {formData.recompensa}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={formData.recompensa}
                  onChange={(e) => handleChange("recompensa", e.target.value)}
                  className={styles.slider}
                />
                <div className={styles.sliderMinMax}>
                  <span>R$ 0</span>
                  <span>R$ 1.000</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={styles.btnCadastrar}
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}
