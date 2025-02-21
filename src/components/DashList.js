'use client';
import { useState, useEffect, useCallback } from "react";
import { MdOutlineClear } from "react-icons/md";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { truncateText } from "@/utils/truncateText";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { getPaginProducts, getProductById } from "@/service/productsService";
import { FaPlus } from "react-icons/fa";
import StylezedBtn from "./StylezedBtn";
import NewProdutoModal from "./NewProdutoModal";
import { TbLibraryPlus } from "react-icons/tb";
import NewProdutoMassModal from "./NewProdutoMassModal";
import CompMassModal from "./CompMassModal";
import { getAllInfo, getInfoById, getInfoByProduto } from "@/service/dashboardService";
import Product from "./Product";

export default function DashList() {
    const [products, setProducts] = useState([]);
    const [infoMes, setInfoMes] = useState([]);
    const [page, setPage] = useState(0);
    const [sku, setSku] = useState('');
    const [isInputActive, setIsInputActive] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [modal, setModal] = useState('');
    const router = useRouter();

    const fetchInfo = useCallback(async () => {
        try {
            const infoResponses = sku === '' ? await getAllInfo() : await getInfoByProduto(sku);
            const organizedData = {};

            infoResponses.forEach(info => {
                const sku = info.produto.id;
                const monthYear = info.monthYear.substring(0, 7); // "YYYY-MM"

                if (!organizedData[sku]) {
                    organizedData[sku] = {};
                }

                organizedData[sku][monthYear] = info.total !== null ? info.total : 0;
            });

            setInfoMes(organizedData);
            console.log(organizedData);
        } catch (error) {
            console.error(error);
        }
    }, [sku]);

    useEffect(() => {
        fetchInfo();
    }, [fetchInfo]);

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`dashboard/${encodedId}`);
    };

    const handleInputChange = (event) => {
        setSku(event.target.value);
        setIsEmpty(event.target.value === '');
    };

    const handleInputFocus = () => {
        setIsInputActive(true);
    };

    const handleInputBlur = () => {
        setIsInputActive(false);
    };

    const renderTableHeader = () => {
        const months = new Set();
        Object.values(infoMes).forEach(data => {
            Object.keys(data).forEach(month => months.add(month));
        });

        const sortedMonths = Array.from(months).sort();

        return (
            <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                {sortedMonths.map(month => (
                    <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{month}</th>
                ))}
            </tr>
        );
    };

    const renderTableRows = () => {
        const sortedSkus = Object.keys(infoMes).sort();

        return sortedSkus.map(sku => (
            <tr key={sku} onClick={() => handleRowClick(sku)} className="cursor-pointer hover:bg-black hover:text-white">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{sku}</td>
                {Object.keys(infoMes[sku]).sort().map(month => (
                    <td key={month} className="px-6 py-4 whitespace-nowrap text-sm">{infoMes[sku][month]}</td>
                ))}
            </tr>
        ));
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
                        ) : isEmpty ? null : (
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

            </div>

            <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-5 items-center w-full overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        {renderTableHeader()}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-300">
                        {renderTableRows()}
                    </tbody>
                </table>
            </div>

        </div>
    );
}