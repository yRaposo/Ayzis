'use client';
import StylezedBtn from "@/components/StylezedBtn";
import { useRouter } from "next/navigation";
import { FaDatabase } from "react-icons/fa";
import { BsClipboard2DataFill } from "react-icons/bs";


export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h2 className="my-2 text-3xl font-extrabold text-center">Bem-vindo ao Ayzis</h2>
      <p className="my-2 text-lg text-center">Gere relatórios de forma simples e rapida.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full max-w-4xl">
        <div className="flex flex-col gap-4 border-gray-300 p-4">
          <StylezedBtn props={{ icon: <FaDatabase size={20} />, text: 'Dados' }} onClick={() => { router.push('/database') }} />
          <p className="flex justify-center text-center">Consulte, edite, atualize e exclua dados de produtos e vendas registrados no sistema.</p>
        </div>
        <div className="flex flex-col gap-4 border-gray-300 p-4">
          <StylezedBtn props={{ icon: <BsClipboard2DataFill size={20} />, text: 'Relatório' }} onClick={() => { router.push('/dashboard') }} />
          <p className="flex justify-center text-center">Visualize um relatório dos produtos vendidos mensalmente, e exporte-os para um arquivo Excel.</p>
        </div>
      </div>
    </div>
  )
}