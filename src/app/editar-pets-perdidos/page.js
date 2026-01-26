
import { redirect } from "next/navigation";

// Página raiz para /editar-pets-perdidos
// Redireciona o usuário para a listagem pública de perdidos.
export default function Page() {
	redirect('/perdidos');
}
