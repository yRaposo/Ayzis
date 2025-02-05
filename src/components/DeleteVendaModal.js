'use client'
import { MdArrowBackIos, MdClose } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";
import { deleteVenda } from "@/service/vendasService";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

export default function DeleteVendaModal({ isOpen, onClose, id }) {
    const router = useRouter();
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = () => {
        setLoading(true);
        deleteVenda(id)
            .then(() => {
                router.push('/database/vendas');
                onClose();
            })
            .catch((error) => {
                setIsError(true);
                setErrorType(error.response.data.message);
            }).finally(() => {
                setConfirmDelete(false);
                setLoading(false);
            });
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Deletar Venda</h1>
                </div>

                <div className="mt-4">
                    <p className="text-lg">Ao excluir esta venda:</p>
                    <div className="mt-2 border-l-4 border-red-500 p-2 rounded-r-xl bg-red-50">
                        <p className="font-semibold">• Esta ação é irreversível.</p>
                    </div>
                    <p className="mt-4 font-bold text-lg">Você tem certeza que deseja excluir esta venda?</p>
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={() => {
                        setConfirmDelete(false);
                        onClose()
                        }} />
                    {confirmDelete ? (
                        <StylezedBtn props={{ icon:  isProcessing ? <CgSpinner/> : <TbTrashXFilled />, text: 'Excluir', color: 'red' }} onClick={handleSubmit} />
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