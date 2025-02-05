'use client'
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { IoIosWarning, IoIosDocument, IoMdCloudUpload } from 'react-icons/io';
import { FaPlusCircle } from 'react-icons/fa';
import { CgSpinner } from 'react-icons/cg';
import { MdCheckCircle, MdError, MdClose, MdLaunch } from 'react-icons/md';
import { postComponent } from '@/service/componentsService';
import StylezedBtn from '@/components/StylezedBtn';

export default function CompMassModal({ isOpen, onClose }) {
    const [isError, setIsError] = useState(false);
    const [errorType, setErrorType] = useState('');
    const [loading, setLoading] = useState(false);
    const [components, setComponents] = useState([]);
    const [results, setResults] = useState([]);
    const [file, setFile] = useState([]);
    const [fileError, setFileError] = useState('');
    const [fileName, setFileName] = useState('');
    const [progress, setProgress] = useState(0);
    const [totalComponents, setTotalComponents] = useState(0);
    const [successComponents, setSuccessComponents] = useState(0);
    const [errorComponents, setErrorComponents] = useState([]);
    const [serverResponses, setServerResponses] = useState([]);

    const onDrop = (acceptedFiles) => {
        setLoading(true);
        setFileError('');
        setFileName('');
        setComponents([]);
        setResults([]);
        setErrorComponents([]);
        setSuccessComponents(0);
        setTotalComponents(0);
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
                    const components = Array.isArray(result.data) ? result.data.map(component => ({ ...component, status: 'pending' })) : [];
                    setComponents(components);
                    setLoading(false);
                    setTotalComponents(components.length);
                    console.log(components);
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
        for (const [index, component] of components.entries()) {
            if (!component || typeof component !== 'object') continue;
            const produtoComposto = component?.CodigoDaComposicao?.toUpperCase() || '';
            const produtoComponente = component?.CodigoDoComponente?.toUpperCase() || '';
            const quantidade = parseInt(component?.QuantidadeDoComponente?.trim() || "0");
            if (!produtoComposto || !produtoComponente || !quantidade) {
                results.push({ component, status: "error", message: "Dados do componente estão incompletos" });
                continue;
            }
            if (produtoComponente === produtoComposto) {
                results.push({ component, status: "error", message: "Produto composto e componente não podem ser iguais" });
                continue;
            }
            await postComponent(produtoComposto, produtoComponente, quantidade).then((response) => {
                results.push({ component, status: "success", response });
                component.status = 'success';
                successCount++;
            }).catch((error) => {
                const errorMessage = error.response?.data?.message || error.message;
                results.push({ component, status: "error", message: errorMessage });
                component.status = 'error';
                component.error = errorMessage;
                setErrorComponents([...errorComponents, component]);
                console.error(errorMessage);
                console.error(component);
            }).finally(() => {
                setProgress(((index + 1) / components.length) * 100);
            });
        }
        setLoading(false);
        setResults(results);
        setSuccessComponents(successCount);
        setServerResponses(results);
        console.log(results);
        console.log('Componentes com erro: ', errorComponents);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ".CSV" });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 h-full w-full">

            <div className="bg-white p-5 w-full max-w-3xl max-h-[90vh] m-5 md:m-10 rounded-xl shadow-lg overflow-y-auto">
                <div>
                    <h1 className="text-2xl font-bold mt-2">Adicionar Componentes em Massa</h1>
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
                    {components.length > 0 && (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">Código da Composição</th>
                                    <th className="py-2 px-4 border-b">ID do Componente</th>
                                    <th className="py-2 px-4 border-b">Descrição do Componente</th>
                                    <th className="py-2 px-4 border-b">Código do Componente</th>
                                    <th className="py-2 px-4 border-b">Quantidade</th>
                                    <th className="py-2 px-4 border-b">Custo Unitário</th>
                                    <th className="py-2 px-4 border-b">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {components.map((component, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{component.CodigoDaComposicao}</td>
                                        <td className="py-2 px-4 border-b">{component.IDdoComponente}</td>
                                        <td className="py-2 px-4 border-b">{component.DescricaoDoComponente}</td>
                                        <td className="py-2 px-4 border-b">{component.CodigoDoComponente}</td>
                                        <td className="py-2 px-4 border-b">{component.QuantidadeDoComponente}</td>
                                        <td className="py-2 px-4 border-b">{component.CustoUnitario}</td>
                                        <td className="py-2 px-4 border-b">
                                            {component.status === 'success' && <MdCheckCircle className="text-green-500" />}
                                            {component.status === 'error' && <MdError className="text-red-500" />}
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
                        setComponents([]);
                        setResults([]);
                        setFile([]);
                        setFileName('');
                        setFileError('');
                        setLoading(false);
                        setIsError(false);
                        setErrorType('');
                        setErrorComponents([]);
                        setSuccessComponents(0);
                        setTotalComponents(0);
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
                {errorComponents.map((component, index) => (
                    <div key={index} className="mt-2 border-l-4 border-red-500 p-2 rounded-r-xl bg-red-50">
                        <p>Componente: {component.name}</p>
                        <p>Status: {component.status}</p>
                        {component.status === 'error' && <p>Erro: {component.errorMessage}</p>}
                    </div>
                ))}
            </div>
        </div>
    );

}
