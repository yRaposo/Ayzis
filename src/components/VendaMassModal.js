'use client'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { IoIosWarning, IoIosDocument, IoMdCloudUpload } from 'react-icons/io';
import { FaPlusCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { MdCheckCircle, MdError, MdClose, MdLaunch } from 'react-icons/md';
import StylezedBtn from '@/components/StylezedBtn';
import { convertDateString } from '@/utils/dataConverter';
import { createVenda } from '@/service/vendasService';

export default function VendaMassModal({ isOpen, onClose }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [loading, setLoading] = useState(false);
    const [vendas, setVendas] = useState([]);
    const [results, setResults] = useState([]);
    const [file, setFile] = useState([]);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState(0);
    const [totalVendas, setTotalVendas] = useState(0);
    const [successVendas, setSuccessVendas] = useState(0);
    const [errorVendas, setErrorVendas] = useState([]);
    const [serverResponses, setServerResponses] = useState([]);

    const onDrop = (acceptedFiles) => {
        setLoading(true);
        setFileError('');
        setFileName('');
        setVendas([]);
        setResults([]);
        setErrorVendas([]);
        setSuccessVendas(0);
        setTotalVendas(0);
        setProgress(0);
        setServerResponses([]);
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
                    const vendas = Array.isArray(result.data) ? result.data.map(venda => ({ ...venda, status: 'pending' })) : [];
                    setVendas(vendas);
                    setLoading(false);
                    setTotalVendas(vendas.length);
                    console.log(vendas);
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
        for (const [index, venda] of vendas.entries()) {
            if (!venda || typeof venda !== 'object') {
                console.log('venda não é um objeto')
                continue;
            }

            console.log(convertDateString(venda?.DataDaVenda))
            console.log('iniciando iteração sobre a venda: ' + venda?.NDeVenda)
            console.log('vendas iterada com sucesso, enviando dados')

            const data = {
                id: venda?.NDeVenda?.toUpperCase() || '',
                dataVenda: convertDateString(venda?.DataDaVenda) || '',
                status: venda?.Estado || '',
                quantidade: parseInt(venda?.Unidades?.trim() || "0"),
                valorTotal: parseFloat(venda?.Total?.trim() || "0"),
                produto: {
                    id: venda?.SKU?.toUpperCase() || '',
                }
            }

            console.log(data)
            await createVenda(data).then((response) => {
                results.push({ venda, status: "success", response });
                venda.status = 'success';
                successCount++;
            }).catch((error) => {
                const errorMessage = error.response?.data?.message || error.message;
                results.push({ venda, status: "error", message: errorMessage });
                venda.status = 'error';
                venda.error = errorMessage;
                setErrorVendas([...errorVendas, venda]);
                console.error(errorMessage);
                console.error(venda);
            }).finally(() => {
                setProgress(((index + 1) / vendas.length) * 100);
            });
        }
        setLoading(false);
        console.log(results);
        console.log('Vendas com erro: ', errorVendas);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".CSV" });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">
            <div className="bg-white p-5 w-full max-w-3xl max-h-[90vh] m-5 md:m-10 rounded-xl shadow-lg overflow-y-auto">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Adicionar Vendas em Massa</h1>
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
                    {vendas.length > 0 && (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">ID da Venda</th>
                                    <th className="py-2 px-4 border-b">Data da Venda</th>
                                    <th className="py-2 px-4 border-b">Estado</th>
                                    <th className="py-2 px-4 border-b">Quantidade</th>
                                    <th className="py-2 px-4 border-b">Valor Total</th>
                                    <th className="py-2 px-4 border-b">Produto</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendas.map((venda, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{venda.NDeVenda}</td>
                                        <td className="py-2 px-4 border-b">{venda.DataDaVenda}</td>
                                        <td className="py-2 px-4 border-b">{venda.Estado}</td>
                                        <td className="py-2 px-4 border-b">{venda.Unidades}</td>
                                        <td className="py-2 px-4 border-b">{venda.Total}</td>
                                        <td className="py-2 px-4 border-b">{venda.SKU}</td>
                                        <td className="py-2 px-4 border-b">
                                            {venda.status === 'success' && <MdCheckCircle className="text-green-500" />}
                                            {venda.status === 'error' && <MdError className="text-red-500" />}
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
                        setVendas([]);
                        setResults([]);
                        setFile([]);
                        setFileName('');
                        setFileError('');
                        setLoading(false);
                        setIsError(false);
                        setErrorType('');
                        setErrorVendas([]);
                        setSuccessVendas(0);
                        setTotalVendas(0);
                        setProgress(0);
                        setServerResponses([]);
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
                {errorVendas.map((venda, index) => (
                    <div key={index} className="mt-2 border-l-4 border-red-500 p-2 rounded-r-xl bg-red-50">
                        <p>Venda: {venda.idVenda}</p>
                        <p>Status: {venda.status}</p>
                        {venda.status === 'error' && <p>Erro: {venda.errorMessage}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}