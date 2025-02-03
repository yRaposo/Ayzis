import { useRouter } from "next/navigation";
import StylezedBtn from "./StylezedBtn";
import { MdEdit } from "react-icons/md";

export default function Venda({ venda, onEditComponent }) {
    const router = useRouter();

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`/database/produtos/${encodedId}`);
    }

    if (!venda || !venda.id || !venda.produto) {
        return <div>Venda não encontrada</div>;
    }

    const { produto } = venda;

    return (
        <>
            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className="flex flex-col justify-between align-middle">
                    <div className="flex flex-row justify-start gap-1 align-middle items-center">
                        <h1 className="text-md font-thin">#{venda.id}</h1>
                    </div>
                    <h1 className="text-lg font-bold">{produto.nome}</h1>
                </div>
                <div className="flex flex-col justify-between align-middle my-2 md:flex-row md:justify-between md:gap-4">
                    <div className="flex flex-col align-middle w-full">
                        <h1 className="text-xl font-bold mt-6 md:mt-0">Detalhes da Venda</h1>
                        <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">
                            <table className='hidden min-w-full divide-y divide-gray-300 md:table'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Código</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Marca</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Preço</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Unidade</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Data da Venda</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Quantidade</th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Valor Total</th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-300'>
                                    <tr onClick={() => handleRowClick(produto.id)} className="cursor-pointer hover:bg-black hover:text-white">
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.marca}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>R${produto.preco}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{produto.unidade}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{venda.dataVenda}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{venda.status}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{venda.quantidade}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>R${venda.valorTotal}</td>
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
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Data da Venda:</span>
                                        <span className="text-gray-900">{venda.dataVenda}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Status:</span>
                                        <span className="text-gray-900">{venda.status}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Quantidade:</span>
                                        <span className="text-gray-900">{venda.quantidade}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Valor Total:</span>
                                        <span className="text-gray-900">R${venda.valorTotal}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {produto.composto && (
                            <div className="mt-4">
                                <div className="flex flex-row justify-between gap-1 align-middle items-center mb-2">
                                    <h2 className="text-lg font-bold">Componentes</h2>
                                </div>
                                <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">
                                    <table className='min-w-full divide-y divide-gray-300 '>
                                        <thead className='bg-gray-50'>
                                            <tr>
                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>SKU</th>
                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>QTD</th>
                                            </tr>
                                        </thead>
                                        <tbody className='bg-white divide-y divide-gray-300'>
                                            {produto.produtosComposicao.map((composicao) => (
                                                <tr key={composicao?.produtoComponente?.id} onClick={() => handleRowClick(composicao.produtoComponente.id)} className="cursor-pointer hover:bg-black hover:text-white">
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{composicao?.produtoComponente?.id}</td>
                                                    <td className='px-6 py-4 whitespace-nowrap text-sm truncate'>{composicao.quantidade}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
