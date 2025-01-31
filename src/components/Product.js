import { useRouter } from "next/navigation";
import StylezedBtn from "./StylezedBtn";
import { MdEdit } from "react-icons/md";

export default function Product({ product, onEditComponent }) {
    const router = useRouter();

    const handleRowClick = (id) => {
        const encodedId = encodeURIComponent(id);
        router.push(`/database/produtos/${encodedId}`);
    }

    if (!product || !product.id || !product.nome) {
        return <div>Produto não encontrado</div>;
    }

    return (
        <>
            <div className="my-4 flex flex-col justify-between align-middle border-gray-300 rounded-xl p-4 border-2">
                <div className="flex flex-col justify-between align-middle">
                    <div className="flex flex-row justify-start gap-1 align-middle items-center">
                        <h1 className="text-md font-thin">{product.id}</h1>
                    </div>
                    <h1 className="text-lg font-bold">{product.nome}</h1>
                </div>
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
                                    <tr>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.id}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.marca}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>R${product.preco}</td>
                                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate'>{product.unidade}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='w-full px-1 flex flex-col md:hidden justify-between'>
                                <div className="flex flex-col md:hidden">
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Código:</span>
                                        <span className="text-gray-900">{product.id}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Marca:</span>
                                        <span className="text-gray-900">{product.marca}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Preço:</span>
                                        <span className="text-gray-900">R${product.preco}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="font-medium text-gray-500">Unidade:</span>
                                        <span className="text-gray-900">{product.unidade}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {product.composto && (
                            <div className="mt-4">
                                <div className="flex flex-row justify-between gap-1 align-middle items-center mb-2">
                                    <h2 className="text-lg font-bold">Componentes</h2>
                                    <StylezedBtn props={{ icon: <MdEdit />, text: 'Editar Componentes' }} onClick={onEditComponent} />
                                </div>
                                <div className="flex flex-col border-2 border-gray-300 rounded-xl px-2 mt-1 items-center w-full">
                                    <table className='min-w-full divide-y divide-gray-300 '>
                                        <thead className='bg-gray-50'>
                                            <tr>
                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Nome</th>
                                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>QTD</th>
                                            </tr>
                                        </thead>
                                        <tbody className='bg-white divide-y divide-gray-300'>
                                            {product.produtosComposicao.map((composicao) => (
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
