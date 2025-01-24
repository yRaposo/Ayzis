import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CgSpinner } from "react-icons/cg"; // Importa ícones da biblioteca react-icons

// Define o componente funcional AuthStatus
export default function AuthStatus({ isError, token, code }) {
    // Verifica se há um erro
    if (isError) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p>Erro ao validar seus dados</p>
                <FaExclamationCircle className="text-red-500" size={32} /> {/* Ícone de erro */}
            </div>
        );
    } 
    // Verifica se o token está presente
    else if (token) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p>Dados Validados com Sucesso</p>
                <FaCheckCircle className="text-green-500" size={32} /> {/* Ícone de sucesso */}
            </div>
        );
    } 
    // Verifica se o código de validação está presente
    else if (code) {
        return (
            <div className="flex flex-col items-center gap-4">
                <p>Validando seus dados</p>
                <CgSpinner className="animate-spin" size={32} /> {/* Ícone de carregamento */}
            </div>
        );
    } 
    // Caso nenhuma das condições anteriores seja atendida
    else {
        return (
            <div className="flex flex-col items-center gap-4">
                <p>Redirencionando</p>
                <CgSpinner className="animate-spin" size={32} /> {/* Ícone de carregamento */}
            </div>
        );
    }
}
