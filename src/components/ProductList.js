'use client';
import { useState, useEffect } from "react";
import { MdOutlineClear } from "react-icons/md";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { truncateText } from "@/utils/truncateText";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { getAllProducts, getProductById } from "@/service/productsService";
import { FaPlus } from "react-icons/fa";
import StylezedBtn from "./StylezedBtn";
import NewProdutoModal from "./NewProdutoModal";
import { TbLibraryPlus } from "react-icons/tb";
import NewProdutoMassModal from "./NewProdutoMassModal";
import CompMassModal from "./CompMassModal";

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [sku, setSku] = useState('');
    const [isInputActive, setIsInputActive] = useState(false);
    const [isempty, setIsEmpty] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [modal, setModal] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (sku === '') {
            getAllProducts(page, 10).then((response) => {
                if (Array.isArray(response)) {
                    setProducts(response);
                } else {
                    setProducts([]);
                }
                console.log(response);
            }).catch((error) => {
                console.error(error);
            })
        } else {
            setIsSearching(true);
            getProductById(sku.toUpperCase()).then((response) => {
                setProducts([response]);
                console.log(response);
            }).catch((error) => {
                console.error(error);
            }).finally(() => {
                setIsSearching(false);
            })
        }
    }, [sku, page]);

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`produtos/${encodedId}`);
    }

    const handleInputChange = (event) => {
        setSku(event.target.value);
        if (event.target.value === '') {
            setIsEmpty(true);
        } else {
            setIsEmpty(false);
        }
    }

    const handleInputFocus = () => {
        setIsInputActive(true);
    };

    const handleInputBlur = () => {
        setIsInputActive(false);
    };

    return (
        <div className="flex flex-col items-center aling-middle w-full">
            <h1 className="justify-center items-center text-4xl font-bold text-center">Busque por um produto</h1>

            <div className="flex w-full gap-5 justify-between">
                <div className="flex flex-row gap-5 w-auto">

                    <div className={`flex border-2 border-gray-300 rounded-3xl p-2 w-full mt-5 justify-around ${isInputActive ? 'border-gray-800' : 'border-gray-300'}`}>
                        <input type="text" className="w-full outline-none" placeholder="Digite o SKU do produto" value={sku} onChange={handleInputChange} onFocus={handleInputFocus}
                            onBlur={handleInputBlur} />
                        {isSearching ? (
                            <div className="text-white rounded-xl align-middle items-center justify-center">
                                <CgSpinner color="#000" size="20" className="animate-spin" />
                            </div>
                        ) : isempty ? null : (
                            <button className="text-white rounded-xl align-middle items-center" onClick={() => {
                                setSku('');
                                setIsEmpty(true);
                            }}>
                                <MdOutlineClear color="#000" size="20" />
                            </button>
                        )}
                    </div>

                    <div className="flex border-2 border-gray-300 rounded-3xl p-2 mt-5 justify-around gap-3">
                        <button onClick={() => {
                            if (page > 0) {
                                setPage(page - 1);
                            }
                        }} className="text-white rounded-xl align-middle items-center">
                            <IoMdArrowDropleft color="#000" size="20" />
                        </button>
                        <p className="text-center">{page + 1}</p>
                        <button onClick={() => {
                            setPage(page + 1);
                        }} className="text-white rounded-xl align-middle items-center">
                            <IoMdArrowDropright color="#000" size="20" />
                        </button>
                    </div>
                </div>

                <div className="flex rounded-3xl mt-5 justify-around gap-3">
                    <StylezedBtn props={{ icon: <TbLibraryPlus />, text: 'Composição por .CSV' }} onClick={() => setModal('compMass')} />
                    <StylezedBtn props={{ icon: <TbLibraryPlus />, text: 'Adição por .CSV' }} onClick={() => setModal('newMass')} />
                    <StylezedBtn props={{ icon: <FaPlus />, text: 'Novo Produto' }} onClick={() => setModal('new')} />
                </div>
            </div>

            <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-5 items-center w-full">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Preço</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Marca</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Unidade</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {products.map((product) => {
                            if (product && product.id) {
                                return (
                                    <tr key={product.id} onClick={() => handleRowClick(product.id)} className="cursor-pointer hover:bg-black hover:text-white">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium truncate hidden md:table-cell">{truncateText(product.nome, 40)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{product.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate hidden md:table-cell">R${product.preco}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate hidden md:table-cell">{product.marca}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate hidden md:table-cell">{product.unidade}</td>
                                    </tr>
                                );
                            } else {
                                console.error('Produto no formato errado:', product);
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <CompMassModal isOpen={modal === 'compMass'} onClose={() => setModal('')} />
            <NewProdutoMassModal isOpen={modal === 'newMass'} onClose={() => setModal('')} />
            <NewProdutoModal isOpen={modal === 'new'} onClose={() => setModal('')} />
        </div>
    );
}