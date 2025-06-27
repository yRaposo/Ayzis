'use client'
import { MdClose } from "react-icons/md";
import { HiDocumentDownload } from "react-icons/hi";
import StylezedBtn from "./StylezedBtn";
import { useCallback, useState } from "react";
import { exportQTDToExcel } from "@/utils/ExportQTDToExcel";
import { getProductById } from "@/service/productsService";
import { getSomaProdutosVendidos } from "@/service/estatisticasService";
import { CgSpinner } from "react-icons/cg";

export default function ExportQTDModal({ isOpen, onClose }) {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Busca todos os dados de vendas por produto/mês
    const fetchVendasPorProduto = useCallback(async () => {
        try {
            const response = await getSomaProdutosVendidos();
            return response;
        } catch (error) {
            setError("Erro ao buscar dados de vendas.");
            return {};
        }
    }, []);

    // Busca dados do produto (nome, marca, etc)
    const fetchProduct = useCallback(async (id) => {
        try {
            const response = await getProductById(id);
            return response;
        } catch (error) {
            return {};
        }
    }, []);

    const exportData = async () => {
        setLoading(true);
        setProgress(0);
        setError(null);

        // Busca os dados de vendas por produto/mês
        const vendasPorProduto = await fetchVendasPorProduto();
        const skus = Object.keys(vendasPorProduto);
        const total = skus.length;

        // Monta os dados para exportação
        const dataToExport = [];
        for (let i = 0; i < skus.length; i++) {
            const sku = skus[i];
            const produtoInfo = await fetchProduct(sku);

            // vendasPorProduto[sku] pode conter vários meses, então exporta cada mês como linha
            Object.entries(vendasPorProduto[sku]).forEach(([key, value]) => {
                // Só pega as chaves de quantidade (ex: "2024-05_qtd")
                if (key.endsWith('_qtd')) {
                    const mes = key.replace('_qtd', '');
                    dataToExport.push({
                        SKU: sku,
                        Descricao: produtoInfo?.nome || '',
                        Marca: produtoInfo?.marca || '',
                        Mes: mes,
                        Quantidade: value
                    });
                }
            });

            setProgress(((i + 1) / total) * 100);
        }

        exportQTDToExcel(dataToExport);
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed overflow-y-auto inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full z-20 ">
            <div className="bg-white p-5 w-full m-5 md:m-52 rounded-xl shadow-lg ">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Exportar para Excel</h1>
                </div>

                <div className="mt-4">
                    <div className="mt-2 border-l-4 border-blue-500 p-2 rounded-r-xl bg-blue-50">
                        <p>• Os dados exportados são organizados em formato tabular.</p>
                        <p>• As vendas estão organizadas de acordo com o SKU por Mês.</p>
                        <p>• O arquivo gerado estará no formato Excel (.xlsx), pronto para análise.</p>
                    </div>
                </div>

                {loading && (
                    <div className="mt-4">
                        <p>Exportando... {Math.round(progress)}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 h-4 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-red-600">{error}</div>
                )}

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn
                        props={{ icon: loading ? <CgSpinner className="text-black animate-spin"/> : <HiDocumentDownload />, text: 'Exportar' }}
                        onClick={exportData}
                        disable={loading}
                    />
                </div>
            </div>
        </div>
    )
}