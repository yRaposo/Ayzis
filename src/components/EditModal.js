'use client'
import { MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState, useEffect } from "react";
import { updateProduct } from "@/service/productsService";
import { RiSaveFill } from "react-icons/ri";

export default function EditModal({ isOpen, onClose, produto }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [marca, setMarca] = useState('');
    const [tipo, setTipo] = useState('');
    const [condicao, setCondicao] = useState('');
    const [preco, setPreco] = useState('');
    const [largura, setLargura] = useState('');
    const [altura, setAltura] = useState('');
    const [profundidade, setProfundidade] = useState('');
    const [peso, setPeso] = useState('');
    const [unidade, setUnidade] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        const data = {
            id: produto.id,
            nome: nome || produto.nome,
            descricao: descricao || produto.descricao,
            marca: marca || produto.marca,
            tipo: tipo || produto.tipo,
            condicao: condicao || produto.condicao,
            preco: preco || produto.preco,
            largura: largura || produto.largura,
            altura: altura || produto.altura,
            profundidade: profundidade || produto.profundidade,
            peso: peso || produto.peso,
            unidade: unidade || produto.unidade,
            composto: produto.composto,
            produtosComposicao: produto.produtosComposicao
        }

        updateProduct(data)
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
                    <h1 className="text-2xl font-bold mt-2">Editar Produto</h1>
                </div>

                <div className="mt-4">
                    <label className="text-sm">Nome</label>
                    <input type="text" placeholder={produto.nome} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={nome} onChange={(e) => { setNome(e.target.value) }} />

                    <label className="text-sm">Descrição</label>
                    <input type="text" placeholder={produto.descricao || ''} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={descricao} onChange={(e) => { setDescricao(e.target.value) }} />

                    <label className="text-sm">Marca</label>
                    <input type="text" placeholder={produto.marca} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={marca} onChange={(e) => { setMarca(e.target.value) }} />

                    <label className="text-sm">Tipo</label>
                    <input type="text" placeholder={produto.tipo} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={tipo} onChange={(e) => { setTipo(e.target.value) }} />

                    <label className="text-sm">Condição</label>
                    <input type="text" placeholder={produto.condicao} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={condicao} onChange={(e) => { setCondicao(e.target.value) }} />

                    <label className="text-sm">Preço</label>
                    <input type="number" placeholder={produto.preco} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={preco} onChange={(e) => { setPreco(e.target.value) }} />

                    <label className="text-sm">Largura</label>
                    <input type="number" placeholder={produto.largura} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={largura} onChange={(e) => { setLargura(e.target.value) }} />

                    <label className="text-sm">Altura</label>
                    <input type="number" placeholder={produto.altura} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={altura} onChange={(e) => { setAltura(e.target.value) }} />

                    <label className="text-sm">Profundidade</label>
                    <input type="number" placeholder={produto.profundidade} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={profundidade} onChange={(e) => { setProfundidade(e.target.value) }} />

                    <label className="text-sm">Peso</label>
                    <input type="number" placeholder={produto.peso} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={peso} onChange={(e) => { setPeso(e.target.value) }} />

                    <label className="text-sm">Unidade</label>
                    <input type="text" placeholder={produto.unidade} className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={unidade} onChange={(e) => { setUnidade(e.target.value) }} />
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