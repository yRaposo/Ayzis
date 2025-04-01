'use client'
import { MdClose, MdLaunch } from "react-icons/md";
import { HiDocumentDownload } from "react-icons/hi";
import StylezedBtn from "./StylezedBtn";
import { useCallback, useState } from "react";
import { exportToExcel } from "@/utils/ExportToExcel";
import { getProductById } from "@/service/productsService";
import { CgSpinner } from "react-icons/cg";

export default function ExportModal({ isOpen, onClose, data }) { // Obtemos os dados do mês
    const [progress, setProgress] = useState(0); // Estado para o progresso
    const [loading, setLoading] = useState(false); // Estado para indicar carregamento
    const [error, setError] = useState(null); // Estado para erros
    const [products, setProducts] = useState([]); // Estado para armazenar os produtos



    const fetchProducts = useCallback(async (id) => {
        try {
            const response = await getProductById(id);
            console.log(response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const exportData = async () => {
        setLoading(true); // Inicia o carregamento
        setProgress(0); // Reseta o progresso

        const skus = Object.keys(data);
        const total = skus.length;

        const dataToExport = await Promise.all(
            skus.map(async (sku, index) => {
                const product = await fetchProducts(sku);
                setProgress(((index + 1) / total) * 100); // Atualiza o progresso

                console.log("Estrutura",
                    {
                        ...data[sku],
                        Descricao: product?.nome || '',
                        Marca: product?.marca || '',
                        SKU: sku,
                    }
                )

                return {
                    ...data[sku],
                    Descricao: product?.nome || '',
                    Marca: product?.marca || '',
                    SKU: sku,
                };
            })
        );

        console.log(dataToExport);
        exportToExcel(dataToExport);
        setLoading(false); // Finaliza o carregamento
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

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={onClose} />
                    <StylezedBtn
                        props={{ icon: loading ? <CgSpinner className="text-black animate-spin"/> : <HiDocumentDownload />, text: 'Exportar' }}
                        onClick={exportData}
                        disable={loading} // Desabilita o botão durante o carregamento
                    />
                </div>

            </div>
        </div>
    )
}