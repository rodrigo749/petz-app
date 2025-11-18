"use client";

import "@/styles/adocao.css";


export default function CadastroAdocao() {

  // Função para sumir o placeholder ao clicar
  const handleFocus = (e) => {
    e.target.dataset.placeholder = e.target.placeholder;
    e.target.placeholder = "";
  };

  // Função para voltar o placeholder ao sair
  const handleBlur = (e) => {
    e.target.placeholder = e.target.dataset.placeholder;
  };

  return (
    <main className="cadastro-pet-container">
      <div className="cadastro-wrapper">

        {/* COLUNA ESQUERDA */}
        <section className="col-esquerda">

          {/* Upload da imagem */}
          <div className="upload-imagem">
            <label htmlFor="pet-imagem">
            <div className="upload-box">
              <img src="/iconephoto.png" alt="Adicionar" className="icone-add-img" />
              <span>Adicionar imagem</span>
            </div>

            </label>
            <input type="file" id="pet-imagem" accept="image/*" hidden />
          </div>

          {/* Descrição */}
          <div className="descricao-box">
            <label htmlFor="descricao-pet" className="descricao-label">
              Descrição:
            </label>

            <textarea
              id="descricao-pet"
              rows="8"
              className="descricao-textarea"
              placeholder="Descreva o pet aqui..."
              onFocus={handleFocus}
              onBlur={handleBlur}
            ></textarea>
          </div>

        </section>

        {/* COLUNA DIREITA */}
        <section className="col-direita">
          <h2 className="titulo-cadastro">Cadastro Pet Adoção</h2>

          <form id="form-cadastro-pet" className="form-cadastro">

            {/* Nome */}
            <div className="campo">
              <img src="/patinha.png" className="icone-input" alt="patinha" />
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Raça */}
            <div className="campo">
              <img src="/patinha.png" className="icone-input" alt="patinha" />
              <input
                type="text"
                name="raca"
                placeholder="Raça"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Gênero */}
            <div className="campo">
              <img src="/patinha.png" className="icone-input" alt="patinha" />
              <input
                type="text"
                name="genero"
                placeholder="Gênero"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            {/* Idade */}
            <div className="campo">
              <img src="/patinha.png" className="icone-input" alt="patinha" />
              <input
                type="text"
                name="idade"
                placeholder="Idade"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </div>

            <button type="submit" className="btn-cadastrar">
              Cadastrar
            </button>

          </form>
        </section>

      </div>
    </main>
  );
}
