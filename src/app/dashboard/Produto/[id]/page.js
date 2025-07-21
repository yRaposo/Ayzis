'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { getProductById } from '@/service/productsService';
import { getSomaProdutoVendidosPorMes, getSomaVendasPorProduto } from '@/service/estatisticasService';
import { getVendasByProduto } from '@/service/vendasService';
import GraficoQTD from '@/components/GraficoQTD';
import GraficoVAL from '@/components/GraficoVAL';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartQTDData, setChartQTDData] = useState([]);
    const [chartVALData, setChartVALData] = useState([]);
    const [vendas, setVendas] = useState([]);

    // Busca produto
    const fetchProductById = useCallback(async () => {
        try {
            const decodedId = decodeURIComponent(id);
            const data = await getProductById(decodedId);
            setProduto(data);
        } catch (error) {
            console.error('Erro ao obter o produto por id:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // Busca estatísticas de vendas por mês para o produto
    const fetchEstatisticasProduto = useCallback(async () => {
        try {
            const decodedId = decodeURIComponent(id);
            // Busca quantidade vendida por mês
            const statsQTD = await getSomaProdutoVendidosPorMes(decodedId);
            console.log('Estatísticas de quantidade vendida por produto:', statsQTD);
            // statsQTD é um objeto { "2024-01": 10, ... }
            const chartQTDDataTemp = Object.entries(statsQTD).map(([monthYear, quantidade]) => ({
                monthYear,
                Quantidade: quantidade
            }));
            setChartQTDData(chartQTDDataTemp);

            // Busca valor vendido por mês
            const statsVAL = await getSomaVendasPorProduto(decodedId);
            console.log('Estatísticas de vendas por produto:', statsVAL);
            // statsVAL é um objeto { "2024-01": 1000, ... }
            const chartVALDataTemp = Object.entries(statsVAL).map(([monthYear, valor]) => ({
                monthYear,
                Valor: valor
            }));
            setChartVALData(chartVALDataTemp);
        } catch (error) {
            console.error('Erro ao obter estatísticas do produto:', error);
        }
    }, [id]);

    // Busca vendas relacionadas ao produto
    const fetchVendasByProduto = useCallback(async () => {
        try {
            const decodedId = decodeURIComponent(id);
            const vendas = await getVendasByProduto(decodedId);
            setVendas(vendas);
        } catch (error) {
            console.error('Erro ao obter vendas por produto:', error);
        }
    }, [id]);

    useEffect(() => {
        fetchProductById();
    }, [fetchProductById]);

    useEffect(() => {
        fetchEstatisticasProduto();
    }, [fetchEstatisticasProduto]);

    useEffect(() => {
        fetchVendasByProduto();
    }, [fetchVendasByProduto]);

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

    // Ordena as vendas da mais nova para a mais velha
    const vendasOrdenadas = Array.isArray(vendas)
        ? [...vendas].sort((a, b) => new Date(b.dataVenda) - new Date(a.dataVenda))
        : [];

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
                    <h2 className="text-xl font-bold">Quantidade Vendida por Mês</h2>
                    <GraficoQTD data={chartQTDData} />
                </div>
                <div className="my-4">
                    <h2 className="text-xl font-bold">Valor Faturado por Mês</h2>
                    <GraficoVAL data={chartQTDData} />
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-300">
                            {vendasOrdenadas.length > 0 ? (
                                vendasOrdenadas.map((venda) => (
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm truncate">{venda.vendedor}</td>
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
