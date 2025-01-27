'use client'
import React, { useCallback, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { FaCheckCircle, FaPlusCircle } from 'react-icons/fa';
import { IoIosDocument, IoIosWarning, IoMdCloudUpload } from 'react-icons/io';
import StylezedBtn from '@/components/StylezedBtn';
import { MdLaunch } from 'react-icons/md';
import { CgSpinner } from 'react-icons/cg';
import { AuthContext } from '@/context/AuthContext';
import { FaListCheck } from 'react-icons/fa6';
import { getProductsQ } from '@/utils/requestQueue';

export default function Generate() {
    const { accounts } = useContext(AuthContext);
    const [fileName, setFileName] = React.useState(null);
    const [fileError, setFileError] = React.useState('');
    const [file, setFile] = React.useState([]);
    const [isProcessing, setIsProcessing] = React.useState(false);
    const [verifyedProducts, setVerifyedProducts] = React.useState([]);
    const [isCheking, setIsCheking] = React.useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (file.type !== 'text/csv') {
                setFileError('Por favor, selecione um arquivo .csv');
                setFileName(null);
                setFile([]);
            } else {
                setFileError('');
                setFileName(file.name);
                Papa.parse(file, {
                    header: true,
                    complete: (results) => {
                        setFile(results.data);
                    }, error: (error) => {
                        setFileError('Erro ao ler o arquivo');
                        console.error(error);
                        setFileName(null);
                        setFile([]);
                    }
                });
            }
        }
    }, []);

    const fetchProducts = useCallback(async (key, row) => {
        const newProducts = {};
        for (const account of accounts) {
            if (account.token) {
                try {
                    const data = await getProductsQ(1, 1, account.token, row.SKU);
                    console.log('Produto bruto:', data);
                    const filteredProducts = data.data.filter(newProduct =>
                        newProduct.codigo.toLowerCase() === row.SKU.toLowerCase() && !newProducts[account.token]?.some(existingProduct => existingProduct.id === newProduct.id)
                    );
                    console.log('Produto filtrado:', filteredProducts)
                    if (filteredProducts.length > 0) {
                        newProducts[account.token] = filteredProducts;
                        row.Status = <FaCheckCircle size={24} />;
                        setVerifyedProducts(prev => {
                            const updatedProducts = [...prev, ...filteredProducts];
                            console.log('Produtos Verificados:', updatedProducts);
                            return updatedProducts;
                        });
                        return { row, products: newProducts };
                    } else {
                        row.Status = <IoIosWarning className="text-red-500" size={24} />;
                    }
                } catch (error) {
                    row.Status = <IoIosWarning className="text-red-500" size={24} />;
                    console.error('Erro ao obter produtos:', error);
                }
            }
        }
    }, [accounts]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'text/csv',
        maxFiles: 1
    });

    const handleVerify = async () => {
        setIsCheking(true);
        const newVerifyedProducts = [];
        await Promise.all(file.map(async (row, index) => {
            if (Object.values(row).every(value => value.trim() === '')) {
                return; // Ignora a linha em branco
            }
            const data = await fetchProducts(index, row);
            if (data) {
                setVerifyedProducts([...verifyedProducts, data]);
            }
        }));
        setIsCheking(false);
        console.log('Produtos verificados:', newVerifyedProducts);
    }

    const handleSubmit = () => {
        console.log('Produtos verificados:', verifyedProducts);
    }

    return (
        <div className="mx-4 mb-4 align-middle w-auto flex flex-col justify-center">
            {/* <div className='justify-center mb-2 w-full'>
                <OnDev />
            </div> */}


            <div className="flex justify-center w-full mb-4">
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
            </div>
            {file.length > 0 && (
                <>
                    <div className='flex flex-row justify-end mt-4 gap-2'>
                        <StylezedBtn props={{ icon: isCheking ? (<CgSpinner className="animate-spin" />) : (<FaListCheck />), text: 'Verificar' }} onClick={() => handleVerify()} />
                        <StylezedBtn props={{ icon: isProcessing ? (<CgSpinner className="animate-spin" />) : (<MdLaunch />), text: 'Lançar' }} onClick={() => handleSubmit()} />
                    </div>

                    <div className='flex flex-col justify-center items-center mt-4 border-2 border-gray-300 rounded-xl overflow-auto max-h-screen w-full'>
                        <div className='overflow-x-auto w-full'>
                            <table className="table-auto min-w-full">
                                <thead className="bg-white sticky top-0 border-b border-gray-200">
                                    <tr>

                                        {Object.keys(file[0]).map((key) => (
                                            <th key={key}
                                                className='px-4 py-2 font-bold border-b border-gray-200 text-start'>
                                                {key}
                                                {console.log(key)}
                                            </th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {file.map((row, index) => (
                                        <tr key={index}>
                                            {Object.values(row).map((value, i) => (
                                                <td key={i} className="py-2 px-4 border-b border-gray-200">
                                                    {value}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>

    );
}