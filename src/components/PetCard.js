export default function PetCard({ pet }) {
  return (
    <div className="card-pet">
      
      <div className="card-image-wrapper">
        <img
          src={pet.imagem || "/images/default.png"} className="card-image" 
        />
      </div>

      {/* BLOCO BRANCO COM OS TEXTOS */}
      <div className="card-text-box">
        <h3>{pet.nome}</h3>
        <p>Raça: {pet.raca}</p>
        <p>Gênero: {pet.genero}</p>
        <p>Idade: {pet.idade}</p>
        <p>Descrição: {pet.descricao}</p>
      </div>

      <div className="icone-casa-circle">
        <img src="/images/icone-casa.png" className="icone-casa" />
      </div>

    </div>
  );
}
