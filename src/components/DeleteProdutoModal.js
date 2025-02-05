'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";
import StylezedBtn from "./StylezedBtn";
import { useState, useEffect } from "react";
import { deleteProduct } from "@/service/productsService";
import { useRouter } from "next/navigation";

export default function DeleteProdutoModal({ isOpen, onClose, id }) {
    const router = useRouter();
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        deleteProduct(id)
            .then(() => {
                router.push('/database/produtos');
                onClose();
            })
            .catch((error) => {
                setIsError(true);
                setErrorType(error.response.data.message);
            }).finally(() => {
                setConfirmDelete(false);
            });
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Deletar Produto</h1>
                </div>

                <div className="mt-4">
                    <p className="text-lg">Ao excluir este produto:</p>
                    <div className="mt-2 border-l-4 border-red-500 p-2 rounded-r-xl bg-red-50">
                        <p>• Você perderá todas as vendas relacionadas.</p>
                        <p>• Todos os seus vínculos serão perdidos, mas os componentes não serão excluídos.</p>
                        <p className="font-semibold">• Esta ação é irreversível.</p>
                    </div>
                    <p className="mt-4 font-bold text-lg">Você tem certeza que deseja excluir este produto?</p>
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={() => {
                        setConfirmDelete(false);
                        onClose()
                        }} />
                    {confirmDelete ? (
                        <StylezedBtn props={{ icon: <TbTrashXFilled />, text: 'Excluir', color: 'red' }} onClick={handleSubmit} />
                    ) : (
                        <StylezedBtn props={{ icon: <TbTrashXFilled />, text: 'Sim, tenho certeza', color: 'red' }} onClick={() => setConfirmDelete(true)} />
                    )}
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