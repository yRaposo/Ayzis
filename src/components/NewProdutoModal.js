'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState, useEffect } from "react";
import { createProduct } from "@/service/productsService";

export default function NewProdutoModal({ isOpen, onClose }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [id, setId] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [marca, setMarca] = useState('');
    const [tipo, setTipo] = useState('');
    const [condicao, setCondicao] = useState('');
    const [preco, setPreco] = useState(0);
    const [largura, setLargura] = useState(0);
    const [altura, setAltura] = useState(0);
    const [profundidade, setProfundidade] = useState(0);
    const [peso, setPeso] = useState(0);
    const [unidade, setUnidade] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (id === '' || nome === '') {
            setIsError(true);
            setErrorType('Preencha todos os campos obrigatórios');
        } else {
            setIsError(false);

            const data = {
                id: id.toUpperCase(),
                nome: nome,
                descricao: descricao,
                marca: marca,
                tipo: tipo,
                condicao: condicao,
                preco: preco,
                largura: largura,
                altura: altura,
                profundidade: profundidade,
                peso: peso,
                unidade: unidade,
                produtosComposicao: []
            }

            createProduct(data)
                .then(() => {
                    onClose();
                    window.location.reload();
                })
                .catch((error) => {
                    setIsError(true);
                    setErrorType(error.response.data.message);
                })
        }
    }

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-[700] pt-[700]">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Novo Produto</h1>
                </div>

                <div className="mt-4">
                    <label className="text-sm">SKU *</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={id} onChange={(e) => { setId(e.target.value) }} />

                    <label className="text-sm">Nome *</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={nome} onChange={(e) => { setNome(e.target.value) }} />

                    <label className="text-sm">Descrição</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={descricao} onChange={(e) => { setDescricao(e.target.value) }} />

                    <label className="text-sm">Marca</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={marca} onChange={(e) => { setMarca(e.target.value) }} />

                    <label className="text-sm">Tipo</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={tipo} onChange={(e) => { setTipo(e.target.value) }} />

                    <label className="text-sm">Condição</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={condicao} onChange={(e) => { setCondicao(e.target.value) }} />

                    <label className="text-sm">Preço</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={preco} onChange={(e) => { setPreco(e.target.value) }} />

                    <label className="text-sm">Largura</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={largura} onChange={(e) => { setLargura(e.target.value) }} />

                    <label className="text-sm">Altura</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={altura} onChange={(e) => { setAltura(e.target.value) }} />

                    <label className="text-sm">Profundidade</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={profundidade} onChange={(e) => { setProfundidade(e.target.value) }} />

                    <label className="text-sm">Peso</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={peso} onChange={(e) => { setPeso(e.target.value) }} />

                    <label className="text-sm">Unidade</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={unidade} onChange={(e) => { setUnidade(e.target.value) }} />
                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn props={{ icon: <MdLaunch />, text: 'Salvar' }} onClick={() => handleSubmit()} />
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