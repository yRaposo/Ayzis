'use client';
import StylezedBtn from "@/components/StylezedBtn";
import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { IoAnalyticsSharp } from "react-icons/io5";


export default function Home() {
    const { token } = useContext(AuthContext);
    const router = useRouter();

    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="my-2 text-3xl font-extrabold text-center">Bem-vindo ao Ayzis</h2>
        <p className="my-2 text-lg text-center">Gere relatórios de forma simples e rapida.</p>
        <div className="grid grid-cols-1 mt-4 w-full max-w-4xl">
          <div className="flex flex-col gap-4 border-gray-300 p-4">
            <StylezedBtn props={{ icon: <IoAnalyticsSharp size={24} />, text: 'Gerar Relatório' }} onClick={() => {
              if (token) {
                router.push('/generate');
              } else {
                router.push('/access');
              }
            }} />
            <p className="flex justify-center text-center">Gere um relatório com os dados de venda mensal, e exporteos em um arquivo Excel.</p>
          </div>
        </div>
      </div>
    )
}