'use client'
import { MdArrowBackIos, MdClose } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";
import { deleteVenda } from "@/service/vendasService";
import { useRouter } from "next/navigation";

export default function DeleteVendaModal({ isOpen, onClose, id }) {
    const router = useRouter();
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        deleteVenda(id)
            .then(() => {
                router.push('/database/vendas');
                onClose();
            })
            .catch((error) => {
                setIsError(true);
                setErrorType(error.response.data.message);
            })
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Deletar Venda</h1>
                </div>

                <div className="mt-4">
                    <p>Você tem certeza que deseja deletar esta venda?</p>
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: <TbTrashXFilled />, text: 'Deletar' }} onClick={() => handleSubmit()} />
                </div>

                <div className="mt-4">
                    {isError && (
                        <div className="bg-red-200 text-red-800 p-2 rounded-xl">
                            {errorType}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}