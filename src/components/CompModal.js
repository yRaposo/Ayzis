'use client'
import { MdClose } from "react-icons/md";
import StylezedBtn from "./StylezedBtn";
import { useState, useEffect, useCallback } from "react";
import { getPaginProducts, getProductById } from "@/service/productsService";
import { patchComponent, deleteComponent, getComponentByProduct, postComponent } from "@/service/componentsService";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";

export default function CompModal({ isOpen, onClose, product, router }) {
    const [comp, setComp] = useState([]);
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [search, setSearch] = useState('');
    const [searchIsActive, setSearchIsActive] = useState(false);
    const [products, setProducts] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const getComponents = useCallback(async () => {
        try {
            const response = await getComponentByProduct(product?.id?.toUpperCase());
            setComp(response);
        } catch (error) {
            console.error(error);
            setErrorType('Erro ao buscar componentes');
            setIsError(true);
        }
    }, [product]);

    useEffect(() => {
        getComponents();
    }, [getComponents]);

    const searchProduct = useCallback(async () => {
        try {
            if (search === '') {
                const response = await getPaginProducts(0, 3);
                setProducts(response);
            } else {
                setIsSearching(true);
                const response = await getProductById(search.toUpperCase());
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
        if (isOpen) {
            getComponents();
        }
    }, [isOpen, getComponents]);

    useEffect(() => {
        searchProduct();
    }, [searchProduct]);

    const hamdlerDeleteComponent = async (id) => {
        setIsDeleting(true);
        await deleteComponent(id.toUpperCase()).then(() => {
            getComponents();
            setIsError(false);
            setErrorType('');
        }).catch((error) => {
            console.error(error);
            setErrorType('Erro ao deletar componente');
            setIsError(true);
        }).finally(() => {
            setIsDeleting(false);
        });
    }

    const handleAddComponent = async (produtoComponente, quantidade) => {
        setIsAdding(true);
        await postComponent(product.id.toUpperCase(), produtoComponente.toUpperCase(), quantidade).then(() => {
            getComponents();
            setIsError(false);
            setErrorType('');
        }).catch((error) => {
            console.error(error);
            setErrorType('Erro ao adicionar componente');
            setIsError(true);
        }).finally(() => {
            setSearch('');
            setSearchIsActive(false);
            setIsAdding(false);
        });
    }

    const handleQuantityComponent = async (componentId, productId, quantidade) => {
        await patchComponent(componentId, product.id.toUpperCase(), productId.toUpperCase(), quantidade).then(() => {
            setIsError(false);
            setErrorType('');
        }).catch((error) => {
            console.error(error);
            setErrorType('Erro ao atualizar quantidade do componente');
            setIsError(true);
        });
    }

    if (!isOpen) return null;

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Editar Componentes</h1>
                </div>

                <div className="mt-4">
                    {comp && (
                        <div className="grid grid-cols-1 gap-2">
                            <div className="grid grid-cols-3 gap-4 border-gray-300 px-4">
                                <label className="text-md font-bold">Componente</label>
                                <label className="text-md font-bold">Quantidade</label>
                                <label className="text-md font-bold">Ações</label>
                            </div>
                            {comp.map((item, index) => (
                                <div key={index} className="grid grid-cols-3 gap-4 border-gray-300 px-2">
                                    <div className="flex justify-center align-middle items-center border border-gray-300 rounded-full py-2">
                                        <span className="">{item.produtoComponente.id}</span>
                                    </div>
                                    <input type="number" className="flex justify-center border px-4 py-2 border-gray-300 rounded-full" value={item.quantidade} onChange={(e) => {
                                        const newComp = comp.map((c, i) => {
                                            if (i === index) {
                                                c.quantidade = e.target.value;
                                            }
                                            return c;
                                        });
                                        handleQuantityComponent(item.id, item.produtoComponente.id, e.target.value);
                                        setComp(newComp);
                                    }} />

                                    <div className="flex justify-start">
                                        <button className="p-3 border border-black rounded-full bg-white text-black hover:bg-black hover:text-white" onClick={() => {
                                            hamdlerDeleteComponent(item.id);
                                        }} >
                                            {isDeleting ? (
                                                <CgSpinner color="#000" className="animate-spin" />
                                            ) : (
                                                <MdClose />
                                            )}
                                        </button>

                                    </div>
                                </div>
                            ))}
                            {isAdding && (
                                <div className="grid grid-cols-3 gap-4 px-2">
                                    <div className="flex bg-gray-300 rounded-full py-2 animate-pulse">
                                    </div>
                                    <div type="number" className="flex justify-center border px-4 py-2 bg-gray-300 rounded-full animate-pulse"
                                    ></div>

                                    <div className="flex justify-start">
                                        <div className="p-3 border rounded-full bg-gray-300 animate-pulse">
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col justify-start mt-4 w-full px-2">
                        <label className="text-md font-bold">Adicionar Componente</label>
                        <input type="text" className="flex w-full justify-center border px-4 py-2 border-gray-300 rounded-full" value={search} placeholder="Digite o SKU do produto" onChange={(e) => setSearch(e.target.value.toUpperCase())} onFocus={() => setSearchIsActive(true)} />
                    </div>
                    {search !== '' || searchIsActive && (
                        <div className="absolute right-auto mt-2 w-56 md:w-96 mx-2 bg-white border border-gray-300 rounded-md shadow-lg" onMouseOver={() => setSearchIsActive(true)} onMouseLeave={() => setSearchIsActive(false)}>
                            {isSearching ? (
                                <div className="flex justify-center items-center p-2">
                                    <CgSpinner color="#000" size="20" className="animate-spin" />
                                </div>
                            ) : (
                                products.map((item, index) => (
                                    <button key={index} className="flex flex-row justify-between items-center border-b border-gray-300 p-2 text-black hover:bg-black hover:text-white cursor-pointer gap-4" onClick={() => {
                                        if (comp.find(c => c.produtoComponente.id === item.id)) {
                                            setIsError(true);
                                            setErrorType('Componente já adicionado');
                                            return;
                                        } else if (item.id === product.id) {
                                            setIsError(true);
                                            setErrorType('Produto não pode ser adicionado a si mesmo');
                                            return;
                                        }
                                        handleAddComponent(item.id, 1);
                                    }}>
                                        <h1 className="font-bold">{item?.id}</h1>
                                        <p className="text-sm font-light">{item?.nome}</p>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                </div>

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Fechar' }} onClick={() => {
                        setIsSearching(false);
                        onClose();
                        setErrorType('');
                        setIsError(false);
                        setSearch('');
                        getComponents();
                        router.refresh();
                    }} />
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