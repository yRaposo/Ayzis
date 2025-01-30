'use client';

import { LuPackage } from "react-icons/lu";
import { MdSell } from "react-icons/md";
import StylezedBtn from "@/components/StylezedBtn";
import { useRouter } from "next/navigation";

export default function Generate() {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
              <h2 className="my-2 text-3xl font-extrabold text-center">Ayzis Database</h2>
              <p className="my-2 text-lg text-center">Consulte, edite, atualize e exclua dados de produtos e vendas registrados no sistema.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full max-w-4xl">
                <div className="flex flex-col gap-4 border-gray-300 p-4">
                  <StylezedBtn props={{ icon: <LuPackage size={20} />, text: 'Produtos' }} onClick={() => { router.push('/database/produtos') }} />
                </div>
                <div className="flex flex-col gap-4 border-gray-300 p-4">
                  <StylezedBtn props={{ icon: <MdSell size={20} />, text: 'Vendas' }} onClick={() => { router.push('/database/vendas') }} />
                </div>
              </div>
            </div>
    );
}