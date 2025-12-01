import styles from "@/app/pets-para-adocao/petsparaadocao.module.css";

export default function PetCard({ pet }) {
  return (
    <div className={styles["card-pet"]}>
      
      <div className={styles["card-image-wrapper"]}>
        <img
          src={pet.imagem || "/images/default.png"} className={styles["card-image"]} 
        />
      </div>

      {/* BLOCO BRANCO COM OS TEXTOS */}
      <div className={styles["card-text-box"]}>
        <h3>{pet.nome}</h3>
        <p>Raça: {pet.raca}</p>
        <p>Gênero: {pet.genero}</p>
        <p>Idade: {pet.idade}</p>
        <p>Descrição: {pet.descricao}</p>
      </div>

      <div className={styles["icone-casa-circle"]}>
        <img src="/images/icone-casa.png" className={styles["icone-casa"]} />
      </div>

    </div>
  );
}
