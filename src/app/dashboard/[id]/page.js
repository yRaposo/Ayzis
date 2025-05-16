'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";

import StylezedBtn from '@/components/StylezedBtn';
import Product from '@/components/Product';
import { getProductById } from '@/service/productsService';
import EditModal from '@/components/EditProdutoModal';
import DeleteProdutoModal from '@/components/DeleteProdutoModal';
import CompModal from '@/components/CompModal';
import { getInfoByProduto } from '@/service/dashboardService';
import Grafico from '@/components/Grafico';
import { getVendaByInfoMes } from '@/service/vendasService';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [produto, setProduto] = useState(null);
    const [modal, setModal] = useState('');
    const [loading, setLoading] = useState(true);
    const [infoMes, setInfoMes] = useState([]);
    const [infoMesBruto, setInfoMesBruto] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [vendas, setVendas] = useState([]);

    const fetchProductById = useCallback(async () => {
        try {
            const decodedId = decodeURIComponent(id);
            const data = await getProductById(decodedId);
            setProduto(data);
            console.log('Produto: ', data);
        } catch (error) {
            console.error('Erro ao obter o produto por id:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchInfoMesByProduct = useCallback(async () => {
        try {
            const infoResponses = await getInfoByProduto(decodeURIComponent(id));
            const organizedData = {};
            const chartDataTemp = [];

            setInfoMesBruto(infoResponses);

            infoResponses.forEach(info => {
                const sku = info.produto.id;
                const monthYear = info.monthYear.substring(0, 7); // "YYYY-MM"

                if (!organizedData[sku]) {
                    organizedData[sku] = {};
                }

                organizedData[sku][monthYear] = info;

                chartDataTemp.push({
                    monthYear,
                    Total_Concluido: info.total,
                    canceladoComponente: info.canceladoComponente,
                    canceladoIndividual: info.canceladoIndividual,
                    Total_Cancelado: info.canceladoTotal,
                    Componentes_Concluidos: info.componente,
                    Diretas_Concluidas: info.direta,
                    Individuais_Concluidas: info.individual,
                    pendenteComponente: info.pendenteComponente,
                    pendenteIndividual: info.pendenteIndividual,
                    Total_Pendente: info.pendenteTotal,
                });
            });

            setInfoMes(organizedData);
            setChartData(chartDataTemp);
            console.log(organizedData);
        } catch (error) {
            console.error(error);
        }
    }, [id]);

    const fetchVendasByInfoMes = useCallback(async () => {
        try {
            const vendas = await getVendaByInfoMes(infoMesBruto);
            setVendas(vendas);
            console.log('Vendas: ', vendas);
        } catch (error) {
            console.error('Erro ao obter vendas por infoMes:', error);
        }
    }, [infoMesBruto]);

    useEffect(() => {
        fetchProductById();
    }, [fetchProductById]);

    useEffect(() => {
        fetchInfoMesByProduct();
    }, [fetchInfoMesByProduct]);

    useEffect(() => {

        infoMesBruto.forEach((info) => {
            getVendaByInfoMes(info.id);
        })

    }, [fetchVendasByInfoMes, infoMesBruto]);

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`/database/produtos/${encodedId}`);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400"></div>
            </div>
        )
    }

    if (!produto) {
        return <div>Produto não encontrado</div>;
    }

    return (
        <div className="m-4">
            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className="flex flex-col justify-between align-middle">
                    <div className="flex flex-row justify-start gap-1 align-middle items-center">
                        <h1 className="text-md font-thin">{produto.id}</h1>
                    </div>
                    <h1 className="text-lg font-bold">{produto.nome}</h1>
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">Gráficos de InfoMes</h2>
                    <Grafico data={chartData} />
                </div>
            </div>

            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className="flex flex-col justify-between align-middle my-2 md:flex-row md:justify-between md:gap-4">
                    <div className="flex flex-col align-middle w-full">
                        <h1 className="text-xl font-bold mt-6 md:mt-0">Detalhes do Produto</h1>
                        <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">
                            <table className='hidden min-w-full divide-y divide-gray-300 md:table'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Código</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Marca</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Preço</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unidade</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-300'>
                                    <tr onClick={() => handleRowClick(produto.id)} className="cursor-pointer hover:bg-black hover:text-white">
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.marca}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>R${produto.preco}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.unidade}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='w-full px-1 flex flex-col md:hidden justify-between'>
                                <div className="flex flex-col md:hidden">
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Código:</span>
                                        <span className="text-gray-900">{produto.id}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Marca:</span>
                                        <span className="text-gray-900">{produto.marca}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Preço:</span>
                                        <span className="text-gray-900">R${produto.preco}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Unidade:</span>
                                        <span className="text-gray-900">{produto.unidade}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <h1 className="text-xl font-bold mt-2 mb-4">Vendas Relacionadas</h1>
                <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">
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
                            {Array.isArray(vendas) && vendas.length > 0 ? (
                                vendas.map((venda) => (
                                    venda && venda.id ? (
                                        <tr
                                            key={venda.id}
                                            className="cursor-pointer hover:bg-black hover:text-white"
                                            onClick={() => router.push(`/database/vendas/${encodeURIComponent(venda.id)}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">
                                                <button
                                                    className="w-full text-left"
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        router.push(`/database/vendas/${encodeURIComponent(venda.id)}`);
                                                    }}
                                                >
                                                    {venda.id}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.dataVenda}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.status}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.quantidade}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">R${venda.valorTotal}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.produto?.id}</td>
                                        </tr>
                                    ) : null
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhuma venda encontrada.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}