import { redirect } from 'next/navigation';

export default function Page() {
  // Redireciona para a rota funcional de adoção
  redirect('/pets-para-adocao');
}
