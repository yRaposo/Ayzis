'use client'
import { MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState } from "react";
import { updateVenda } from "@/service/vendasService";
import { RiSaveFill } from "react-icons/ri";

export default function EditVendaModal({ isOpen, onClose, venda }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [dataVenda, setDataVenda] = useState('');
    const [status, setStatus] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [produto, setProduto] = useState(venda.produto);

    if (!isOpen) return null;

    const handleSubmit = () => {
        const data = {
            id: venda.id,
            dataVenda: dataVenda || venda.dataVenda,
            status: status || venda.status,
            quantidade: quantidade || venda.quantidade,
            valorTotal: valorTotal || venda.valorTotal,
            produto: produto
        }

        updateVenda(data)
            .then(() => {
                onClose();
                window.location.reload();
            })
            .catch((error) => {
                setIsError(true);
                setErrorType(error.response.data.message);
            })
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-[700] pt-[700]">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Editar Venda</h1>
                </div>

                <div className="mt-4">
                    <label className="text-sm">Data da Venda</label>
                    <input type="date" placeholder={venda.dataVenda} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={dataVenda} onChange={(e) => { setDataVenda(e.target.value) }} />

                    <label className="text-sm">Status</label>
                    <input type="text" placeholder={venda.status} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={status} onChange={(e) => { setStatus(e.target.value) }} />

                    <label className="text-sm">Quantidade</label>
                    <input type="number" placeholder={venda.quantidade} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={quantidade} onChange={(e) => { setQuantidade(e.target.value) }} />

                    <label className="text-sm">Valor Total</label>
                    <input type="number" placeholder={venda.valorTotal} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={valorTotal} onChange={(e) => { setValorTotal(e.target.value) }} />
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: <RiSaveFill />, text: 'Salvar' }} onClick={() => handleSubmit()} />
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
