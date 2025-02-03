'use client'
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MdArrowBackIos, MdEdit } from "react-icons/md";
import { TbTrashXFilled } from "react-icons/tb";

import StylezedBtn from '@/components/StylezedBtn';
import { getVendaById } from '@/service/vendasService';
import Venda from '@/components/Venda';
import EditVendaModal from '@/components/EditVendaModal ';
import DeleteVendaModal from '@/components/DeleteVendaModal';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [venda, setVenda] = useState(null);
    const [modal, setModal] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchVendaById = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getVendaById(id);
            setVenda(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchVendaById();
    }, [fetchVendaById]);

    const handlerEditComp = () => {
        setModal('comp');
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse rounded-full h-12 w-12 bg-gray-400"></div>
            </div>
        )
    }

    if (!venda) {
        return <div>Venda não encontrada</div>;
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

            <div className="mt-4">
                <Venda venda={venda} />
            </div>

            <EditVendaModal venda={venda} isOpen={modal === 'edit'} onClose={() => setModal('')} />
            <DeleteVendaModal id={id} isOpen={modal === 'delete'} onClose={() => setModal('')} />
        </div>
    );
}
