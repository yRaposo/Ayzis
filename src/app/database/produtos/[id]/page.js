'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";


import StylezedBtn from '@/components/StylezedBtn';
import Product from '@/components/Product';
import { getProductById } from '@/service/productsService';
import EditModal from '@/components/EditModal';
import DeleteModal from '@/components/DeleteModal';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState(null);
    const [modal, setModal] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchProductById = useCallback(async () => {
        try {
            const decodedId = decodeURIComponent(id);
            const data = await getProductById(decodedId);
            setProduct(data);
            console.log('Produto: ', data);
        } catch (error) {
            console.error('Erro ao obter o produto por id:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProductById();
    }, [fetchProductById]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400"></div>
            </div>
        )
    }

    if (!product) {
        return <div>Produto não encontrado</div>;
    }

    return (
        <div className="m-4">
            <div className='flex justify-between gap-4'>
                <div className='hidden md:flex justify-between gap-4'>
                    <StylezedBtn props={{ icon: <MdArrowBackIos />, text: 'Voltar' }} onClick={() => router.back()} />
                </div>
                <div className="flex justify-between w-full md:w-auto md:gap-4">
                    <StylezedBtn props={{ icon: <MdEdit />, text: 'Editar' }} onClick={() => setModal('edit')} />
                    <StylezedBtn props={{ icon: <TbTrashXFilled />, text: 'Deletar' }} onClick={() => setModal('delete')} />
                </div>
            </div>

            <Product product={product} />

            <EditModal produto={product} isOpen={modal === 'edit'} onClose={() => setModal('')} />
            <DeleteModal id={decodeURIComponent(id)} isOpen={modal === 'delete'} onClose={() => setModal('')} />
        </div>
    );
}
