'use client'
import { MdArrowBackIos, MdLaunch, MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState, useEffect, useCallback } from "react";
import { createVenda } from "@/service/vendasService";
import { getPaginProducts, getProductById } from "@/service/productsService";
import { CgSpinner } from "react-icons/cg";

export default function NewVendaModal({ isOpen, onClose }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [idVenda, setIdVenda] = useState('');
    const [dataVenda, setDataVenda] = useState('');
    const [status, setStatus] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [produto, setProduto] = useState(null);
    const [search, setSearch] = useState('');
    const [searchIsActive, setSearchIsActive] = useState(false);
    const [products, setProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchProduct = useCallback(async () => {
        try {
            if (search === '') {
                const response = await getPaginProducts(0, 3);
                setProducts(response);
            } else {
                setIsSearching(true);
                const response = await getProductById(search);
                setProducts([response]);
            }
        } catch (error) {
            console.error(error);
            setErrorType('Erro ao buscar produto');
            setIsError(true);
        } finally {
            setIsSearching(false);
        }
    }, [search]);

    useEffect(() => {
        searchProduct();
    }, [searchProduct]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!idVenda || !dataVenda || !status || !quantidade || !valorTotal || !produto) {
            setIsError(true);
            setErrorType('Preencha todos os campos obrigatórios');
        } else {
            setIsError(false);

            const data = {
                id: idVenda,
                dataVenda,
                status,
                quantidade,
                valorTotal,
                produto
            };

            console.log(data);

            createVenda(data)
                .then(() => {
                    onClose();
                    
                })
                .catch((error) => {
                    setIsError(true);
                    setErrorType(error.response.data.message);
                });
        }
    };

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full md:pt-[700] pt-[700]">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Nova Venda</h1>
                </div>

                <div className="mt-4">
                    <label className="text-sm">ID da Venda *</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={idVenda} onChange={(e) => { setIdVenda(e.target.value) }} />

                    <label className="text-sm">Data da Venda *</label>
                    <input type="date" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={dataVenda} onChange={(e) => { setDataVenda(e.target.value) }} />

                    <label className="text-sm">Status *</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={status} onChange={(e) => { setStatus(e.target.value) }} />

                    <label className="text-sm">Quantidade *</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={quantidade} onChange={(e) => { setQuantidade(e.target.value) }} />

                    <label className="text-sm">Produto ID *</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={produto?.id || ''} onChange={(e) => { setSearch(e.target.value) }} onFocus={() => setSearchIsActive(true)} />

                    {search !== '' || searchIsActive && (
                        <div className="absolute right-auto mt-2 w-56 md:w-96 mx-2 bg-white border border-gray-300 rounded-md shadow-lg" onMouseOver={() => setSearchIsActive(true)} onMouseLeave={() => setSearchIsActive(false)}>
                            {isSearching ? (
                                <div className="flex justify-center items-center p-2">
                                    <CgSpinner color="#000" size="20" className="animate-spin" />
                                </div>
                            ) : (
                                products.map((item, index) => (
                                    <button key={index} className="flex flex-row justify-between items-center border-b border-gray-300 p-2 text-black hover:bg-black hover:text-white cursor-pointer gap-4" onClick={() => {
                                        setProduto(item);
                                        setValorTotal(item.preco * quantidade);
                                        setSearchIsActive(false);
                                    }}>
                                        <h1 className="font-bold">{item?.id}</h1>
                                        <p className="text-sm font-light">{item?.nome}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    <label className="text-sm">Valor Total *</label>
                    <input type="number" className="w-full p-2 mt-2 mb-4 border border-gray-300 rounded-full" value={valorTotal} onChange={(e) => { setValorTotal(e.target.value) }} />

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
    );
}
