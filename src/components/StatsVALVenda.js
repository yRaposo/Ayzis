import { useEffect, useState, useCallback } from "react";
import { MdOutlineClear } from "react-icons/md";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CgSpinner } from "react-icons/cg";
import { getSomaVendasPorProdutos } from "@/service/estatisticasService";
import { RiFileExcel2Line } from "react-icons/ri";
import StylezedBtn from "./StylezedBtn";
import ExportVALModal from "./ExportVALModal";

export default function StatsVALVenda() {
    const [somaValoresVendas, setSomaValoresVendas] = useState({});
    const [sku, setSku] = useState('');
    const [isInputActive, setIsInputActive] = useState(false);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(0);
    const [modal, setModal] = useState('');
    const router = useRouter();

    const fetchData = useCallback(async () => {
        setIsSearching(true);
        const data = await getSomaVendasPorProdutos();
        setSomaValoresVendas(data || {});
        setIsSearching(false);
        console.log(data);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Extrai todos os meses presentes nos dados
    const allMonths = Array.from(
        new Set(
            Object.values(somaValoresVendas)
                .flatMap(prodData =>
                    Object.keys(prodData)
                        .filter(key => key.endsWith("_valor"))
                        .map(key => key.replace("_valor", ""))
                )
        )
    ).sort();

    // Filtra produtos pelo SKU digitado
    const filteredEntries = Object.entries(somaValoresVendas).filter(([produtoId]) =>
        sku === "" ? true : produtoId.toLowerCase().includes(sku.toLowerCase())
    );

    // Paginação (10 por página)
    const pageSize = 10;
    const paginatedEntries = filteredEntries.slice(page * pageSize, (page + 1) * pageSize);

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`Produto/${encodedId}`);
    };

    const handleInputChange = (event) => {
        setSku(event.target.value);
        setIsEmpty(event.target.value === '');
        setPage(0); // volta para primeira página ao buscar
    };

    const handleInputFocus = () => setIsInputActive(true);
    const handleInputBlur = () => setIsInputActive(false);

    const exportData = () => {
        setModal('export');
    };

    return (
        <div className="flex flex-col items-center align-middle w-full">
            <h1 className="justify-center items-center text-4xl font-bold text-center">Soma de valores mensais por produto</h1>
            <div className="flex w-full gap-5 justify-between">
                <div className="flex flex-row gap-5 w-auto">
                    <div className={`flex border-2 border-gray-300 rounded-3xl p-2 w-full mt-5 justify-around ${isInputActive ? 'border-gray-800' : 'border-gray-300'}`}>
                        <input
                            type="text"
                            className="w-full outline-none"
                            placeholder="Digite o SKU do produto"
                            value={sku}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />
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
                            if (page > 0) setPage(page - 1);
                        }} className="text-white rounded-xl align-middle items-center">
                            <IoMdArrowDropleft color="#000" size="20" />
                        </button>
                        <p className="text-center">{page + 1}</p>
                        <button onClick={() => {
                            if ((page + 1) * pageSize < filteredEntries.length) setPage(page + 1);
                        }} className="text-white rounded-xl align-middle items-center">
                            <IoMdArrowDropright color="#000" size="20" />
                        </button>
                    </div>
                </div>
                <div className="flex rounded-3xl mt-5 justify-around gap-3">
                    <StylezedBtn
                        props={{
                            icon: filteredEntries.length === 0 ? <CgSpinner className="text-black animate-spin" /> : <RiFileExcel2Line />,
                            text: 'Exportar para Excel'
                        }}
                        onClick={exportData}
                        disable={filteredEntries.length === 0}
                    />
                </div>
            </div>
            <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-5 items-center w-full overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                {allMonths.map(month => (
                                    <th key={month} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{month}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {paginatedEntries.map(([produtoId, prodData]) => (
                                <tr key={produtoId} onClick={() => handleRowClick(produtoId)} className="cursor-pointer hover:bg-black hover:text-white">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{produtoId}</td>
                                    {allMonths.map(month => (
                                        <td key={month} className="px-6 py-4 whitespace-nowrap text-sm">
                                            {prodData[`${month}_valor`] !== undefined
                                                ? prodData[`${month}_valor`].toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                                                : "R$ 0,00"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ExportVALModal isOpen={modal === 'export'} onClose={() => setModal('')} data={filteredEntries.reduce((acc, [produtoId, prodData]) => {
                acc[produtoId] = prodData;
                return acc;
            }, {})} />
        </div>
    );
}