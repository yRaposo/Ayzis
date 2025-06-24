'use client';
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { MdFilterAlt, MdOutlineClear } from "react-icons/md";
import { useState, useEffect, useContext } from "react";
import { getAllVendas, getVendaByData, getVendaById, getVendaByMes, getVendasByProduto, getVendasByProdutoMes } from "@/service/vendasService";
import { truncateText } from "@/utils/truncateText";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { FaPlus } from "react-icons/fa";
import StylezedBtn from "./StylezedBtn";
import NewProdutoModal from "./NewProdutoModal";
import NewVendaModal from "./NewVendasModal";
import { TbLibraryPlus } from "react-icons/tb";
import VendaMassModal from "./VendaMassModal";

export default function VendasList() {
    const [vendas, setVendas] = useState([]);
    const [page, setPage] = useState(0);
    const [sku, setSku] = useState('');
    const [date, setDate] = useState('');
    const [isInputActive, setIsInputActive] = useState(false);
    const [isempty, setIsEmpty] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [modal, setModal] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Se ambos date e sku estão preenchidos, busca por produto e mês
        if (date && sku) {
            setIsSearching(true);
            getVendasByProdutoMes(sku.toUpperCase(), date).then((response) => {
                if (Array.isArray(response) && response.length > 0) {
                    setVendas(response);
                } else if (response && response.id) {
                    setVendas([response]);
                } else {
                    setVendas([]);
                }
                setIsSearching(false);
            }).catch((error) => {
                console.error(error);
                setVendas([]);
                setIsSearching(false);
            });
        }
        // Se apenas date está preenchido, filtra vendas por data
        else if (date) {
            setIsSearching(true);
            getVendaByMes(date).then((response) => {
                if (Array.isArray(response) && response.length > 0) {
                    setVendas(response);
                } else if (response && response.id) {
                    setVendas([response]);
                } else {
                    setVendas([]);
                }
                setIsSearching(false);
            }).catch((error) => {
                console.error(error);
                setVendas([]);
                setIsSearching(false);
            });
        }
        // Se sku está vazio, busca todas as vendas paginadas
        else if (sku === '') {
            getAllVendas(page, 10).then((response) => {
                if (Array.isArray(response)) {
                    setVendas(response);
                } else {
                    setVendas([]);
                }
            }).catch((error) => {
                console.error(error);
            });
        }
        // Se apenas sku está preenchido, busca por produto ou id
        else {
            setIsSearching(true);
            getVendasByProduto(sku.toUpperCase()).then((response) => {
                if (Array.isArray(response) && response.length > 0) {
                    setVendas(response);
                } else {
                    // Se não encontrou pelo SKU, tenta buscar pelo ID da venda
                    getVendaById(sku).then((venda) => {
                        if (venda && venda.id) {
                            setVendas([venda]);
                        } else {
                            setVendas([]);
                        }
                    }).catch((error) => {
                        console.error(error);
                        setVendas([]);
                    }).finally(() => {
                        setIsSearching(false);
                    });
                    return;
                }
                setIsSearching(false);
            }).catch((error) => {
                console.error(error);
                setIsSearching(false);
            });
        }
    }, [sku, page, date]);

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`vendas/${encodedId}`);
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
            <h1 className="justify-center items-center text-4xl font-bold text-center">Busque por vendas</h1>

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

                    <div className="flex border-2 border-gray-300 rounded-3xl py-2 px-4 mt-5 justify-around gap-3">
                        <input
                            type="month"
                            className="outline-none"
                            value={date}
                            onChange={e => {
                                setDate(e.target.value);
                                setPage(0);
                            }}
                        />
                        {date ? (
                            <button
                                className="text-white rounded-xl align-middle items-center"
                                onClick={() => {
                                    setDate('');
                                    setPage(0);
                                }}
                                title="Limpar"
                            >
                                <MdOutlineClear color="#000" size="20" />
                            </button>
                        ) : null}
                    </div>
                </div>

                <div className="flex rounded-3xl mt-5 justify-around gap-3">
                    <StylezedBtn props={{ icon: <TbLibraryPlus />, text: 'Adição por .CSV' }} onClick={() => setModal('newMass')} />
                    <StylezedBtn props={{ icon: <FaPlus />, text: 'Nova Venda' }} onClick={() => setModal('new')} />
                </div>
            </div>

            <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-5 items-center w-full">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Venda</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {vendas?.map((venda) => {
                            if (venda && venda.id) {
                                return (
                                    <tr key={venda.id} onClick={() => handleRowClick(venda.id)} className="cursor-pointer hover:bg-black hover:text-white">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.dataVenda}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.status}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.quantidade}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">R${venda.valorTotal}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{truncateText(venda.produto.id, 40)}</td>
                                    </tr>
                                );
                            } else {
                                console.error('Venda no formato errado:', venda);
                                return null;
                            }
                        })}
                    </tbody>
                </table>
            </div>
            <VendaMassModal isOpen={modal === 'newMass'} onClose={() => setModal('')} />
            <NewVendaModal isOpen={modal === 'new'} onClose={() => setModal('')} />
        </div>
    );
}