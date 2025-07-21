'use client';

import { LuPackage } from "react-icons/lu";
import { MdSell } from "react-icons/md";
import StylezedBtn from "@/components/StylezedBtn";
import { useRouter } from "next/navigation";
import { FaChartLine, FaChartPie } from "react-icons/fa";

export default function Generate() {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
              <h2 className="my-2 text-3xl font-extrabold text-center">Ayzis Dashboard</h2>
              <p className="my-2 text-lg</p></p> text-center">Consulte valores de vendas mensais</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full max-w-4xl">
                <div className="flex flex-col gap-4 border-gray-300 p-4">
                  <StylezedBtn props={{ icon: <FaChartPie size={20} />, text: 'Quantidades por produto' }} onClick={() => { router.push('/dashboard/Quantidades') }} />
                </div>
                <div className="flex flex-col gap-4 border-gray-300 p-4">
                  <StylezedBtn props={{ icon: <FaChartLine size={20} />, text: 'Valor Faturado' }} onClick={() => { router.push('/dashboard/Valores') }} />
                </div>
              </div>
            </div>
    );
}