'use client'
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { createProduct } from "@/service/productsService";
import Papa from "papaparse";
import { MdClose, MdLaunch, MdCheckCircle, MdError } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import StylezedBtn from "./StylezedBtn";
import { IoIosDocument, IoIosWarning, IoMdCloudUpload } from "react-icons/io";
import { FaPlusCircle } from "react-icons/fa";

export default function NewProdutoMassModal({ isOpen, onClose }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [results, setResults] = useState([]);
    const [file, setFile] = useState([]);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [successProducts, setSuccessProducts] = useState(0);
    const [errorProducts, setErrorProducts] = useState([]);
    const [serverResponses, setServerResponses] = useState([]); // New state for server responses

    const onDrop = (acceptedFiles) => {
        setLoading(true);
        setFileError('');
        setFileName('');
        setProducts([]);
        setResults([]);
        setErrorProducts([]);
        setSuccessProducts(0);
        setTotalProducts(0);
        setProgress(0);
        setServerResponses([]); // Reset server responses
        if (acceptedFiles.length === 0) {
            setFileError('Por favor, selecione um arquivo valido');
            setFileName(null);
            setFile([]);
            setLoading(false);
            return;
        }
        setFile(acceptedFiles);
        setFileError('');
        setFileName(acceptedFiles[0].name);
        const reader = new FileReader();
        reader.onload = ({ target }) => {
            Papa.parse(target.result, {
                header: true,
                delimiter: ";",
                skipEmptyLines: true,
                complete: (result) => {
                    const products = Array.isArray(result.data) ? result.data.map(product => ({ ...product, status: 'pending' })) : [];
                    setProducts(products);
                    setLoading(false);
                    setTotalProducts(products.length);
                    console.log(products);
                    console.log(result);
                },
                error: (error) => {
                    setFileError(error.message);
                    setLoading(false);
                }
            });
        };
        reader.readAsText(acceptedFiles[0], 'ISO-8859-1');
    };

    const handleConfirm = async () => {
        setLoading(true);
        const results = [];
        let successCount = 0;
        for (const [index, product] of products.entries()) {
            if (!product || typeof product !== 'object') continue;
            const id = product?.SKU?.normalize('NFD').replace(/[\u0300-\u036f�]/g, '') || '';
            if (!id) {
                results.push({ product, status: "error", message: "ID do produto está vazio" });
                continue;
            }

            const data = {
                id: id.toUpperCase(),
                nome: (product?.Descricao || '').substring(0, 250).replace(/[^\w\s]/gi, ''),
                descricao: (product?.Descricao || '').substring(0, 250).replace(/[^\w\s]/gi, ''),
                marca: (product?.Fornecedor || '').substring(0, 250).replace(/[^\w\s]/gi, ''),
                tipo: (product?.TIPO || 'Produto').replace(/[^\w\s]/gi, ''),
                condicao: 'Novo',
                preco: parseFloat((product?.CMVUnitario || "0").replace(/[^\d.-]/g, '').trim() || "0") || 0,
                largura: parseFloat((product?.["Largura(cm)"] || "0").replace(/[^\d.-]/g, '').trim() || "0") || 0,
                altura: parseFloat((product?.["Altura(cm)"] || "0").replace(/[^\d.-]/g, '').trim() || "0") || 0,
                profundidade: parseFloat((product?.["Comprimento(cm)"] || "0").replace(/[^\d.-]/g, '').trim() || "0") || 0,
                peso: parseFloat((product?.Peso || "0").replace(/[^\d.-]/g, '').trim() || "0") || 0,
                unidade: "Unidade",
                produtosComposicao: [],
                composto: false
            };

            await createProduct(data).then(response => {
                results.push({ product: data, status: "success", response });
                product.status = 'success';
                successCount++;
            }).catch(error => {
                const errorMessage = error.response?.data?.message || error.message;
                results.push({ product, status: "error", message: errorMessage });
                product.status = 'error';
                product.error = errorMessage;
                setErrorProducts([...errorProducts, product]);
                console.error(errorMessage);
                console.error(product);
            }).finally(() => {
                setProgress(((index + 1) / products.length) * 100);
            });
        }
        setLoading(false);
        setResults(results);
        setSuccessProducts(successCount);
        setServerResponses(results); // Update server responses state
        console.log(results);
        console.log('Produtos com erro: ', errorProducts);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".CSV" });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full max-w-3xl max-h-[90vh] m-5 md:m-10 rounded-xl shadow-lg overflow-y-auto">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Adicionar Produtos em Massa</h1>
                </div>

                <div  {...getRootProps()} className={`flex border-2 border-gray-300 rounded-xl p-4 cursor-pointer w-full h-52 justify-center items-center hover:bg-gray-100 
                ${fileError
                        ? ('border-red-800 bg-red-200')
                        : file && file.length > 0
                            ? ('justify-start h-auto items-start flex-none')
                            : isDragActive
                                ? ('bg-gray-100 border-dashed')
                                : ('')
                    }`}>
                    <input {...getInputProps()} className="justify-center items-center flex" multiple={false} accept='.csv' />
                    {
                        fileError !== ''
                            ? <div className='flex flex-col justify-center items-center'>
                                <IoIosWarning className="text-red-500" size={32} />
                                <p className='text-center font-bold text-red-800'>
                                    {fileError}
                                </p>
                            </div>
                            : fileName
                                ? <div className='flex flex-row justify-start items-center'>
                                    <IoIosDocument size={32} color='#000' />
                                    <p className='text-center font-bold'>
                                        {fileName}
                                    </p>
                                </div>
                                : isDragActive
                                    ? <div className='flex flex-col justify-center items-center'>
                                        <FaPlusCircle size={32} color='#000' />
                                        <p className='text-center font-bold'>
                                            Solte o arquivo aqui
                                        </p>
                                    </div>
                                    : <div className='flex flex-col justify-center items-center'>
                                        <IoMdCloudUpload size={32} color='#000' />
                                        <p className='text-center font-bold'>
                                            Arraste e solte um arquivo .csv aqui, ou clique para selecionar arquivos
                                        </p>
                                    </div>
                    }
                </div>

                <div className="mt-4 overflow-x-auto">
                    {products.length > 0 && (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">SKU</th>
                                    <th className="py-2 px-4 border-b">Descrição</th>
                                    <th className="py-2 px-4 border-b">Fornecedor</th>
                                    <th className="py-2 px-4 border-b">Preço</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{product.SKU}</td>
                                        <td className="py-2 px-4 border-b">{product.Descricao}</td>
                                        <td className="py-2 px-4 border-b">{product.Fornecedor}</td>
                                        <td className="py-2 px-4 border-b">{product.CMVUnitario}</td>
                                        <td className="py-2 px-4 border-b">
                                            {product.status === 'success' && <MdCheckCircle className="text-green-500" />}
                                            {product.status === 'error' && <MdError className="text-red-500" />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {loading && (
                    <div className="mt-4">
                        <p>Carregando...</p>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-blue-600 h-4 rounded-full animate-pulse" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between mt-4">
                    <StylezedBtn props={{ icon: <MdClose />, text: 'Cancelar' }} onClick={() => {
                        setProducts([]);
                        setResults([]);
                        setFile([]);
                        setFileName('');
                        setFileError('');
                        setLoading(false);
                        setIsError(false);
                        setErrorType('');
                        setErrorProducts([]);
                        setSuccessProducts(0);
                        setTotalProducts(0);
                        setProgress(0);
                        setServerResponses([]); // Reset server responses
                        onClose();
                    }} />
                    <StylezedBtn props={{ icon: loading ? <CgSpinner className="text-black animate-spin" /> : <MdLaunch />, text: 'Salvar' }} disable={loading} onClick={handleConfirm} />
                </div>

                <div className="mt-4"></div>
                {isError && (
                    <div className="bg-red-200 text-red-800 p-2 rounded-xl">
                        {errorType}
                    </div>
                )}
                {errorProducts.map((product, index) => (
                    <div key={index} className="mt-2 border-l-4 border-red-500 p-2 rounded-r-xl bg-red-50">
                        <p>Produto: {product.name}</p>
                        <p>Status: {product.status}</p>
                        {product.status === 'error' && <p>Erro: {product.errorMessage}</p>}
                    </div>
                ))}
            </div>

        </div>
    );
}