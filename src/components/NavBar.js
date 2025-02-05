'use client';
import Link from "next/link";
import { MdHomeFilled, MdAccountCircle, MdSell } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsBarChartFill, } from "react-icons/bs";
import { FaDatabase } from "react-icons/fa";
import { LuPackage } from "react-icons/lu";


export default function NavBar() {
    const [isDropdownAccountOpen, setIsDropdownAccountOpen] = useState(false);
    const [isDropdownDataBaseOpen, setIsDropdownDataBaseOpen] = useState(false);
    const [isDropdownDashboardOpen, setIsDropdownDashboardOpen] = useState(false);
    const router = useRouter();

    const toggleDropdownAccount = () => {
        setIsDropdownAccountOpen(!isDropdownAccountOpen);
        setIsDropdownDashboardOpen(false);
        setIsDropdownDataBaseOpen(false);
    }

    const toggleDropdownDataBase = () => {
        setIsDropdownDataBaseOpen(!isDropdownDataBaseOpen);
        setIsDropdownDashboardOpen(false);
        setIsDropdownAccountOpen(false);
    }

    const toggleDropdownDashboard = () => {
        setIsDropdownDashboardOpen(!isDropdownDashboardOpen);
        setIsDropdownAccountOpen(false);
        setIsDropdownDataBaseOpen(false);
    }

    return (
        <div className="bg-white text-gray-800 m-4 p-4 rounded-2xl border-2 border-gray-300 flex justify-between align-middle">
            <div className="flex gap-4 align-middle items-center">
                {/* <Image src="/U.svg" alt="PlanUp" width={30} height={30} className="object-cover text-gray-800" /> */}
                <h1 className="text-2xl font-black">AYZIS</h1>
            </div>
            <div className="flex text-gray-800 gap-4 align-middle items-center ">
                <Link href="/">
                    <MdHomeFilled className="text-3xl text-gray-800 align-middle items-center" />
                </Link>
                <button onClick={toggleDropdownDataBase}>
                    <FaDatabase className="text-xl text-gray-800 align-middle items-center" />
                </button>

                <button onClick={toggleDropdownDashboard}>
                    <BsBarChartFill className="text-2xl text-gray-800 align-middle items-center" />
                </button>
                <div className="relative align-middle items-center">
                    <button onClick={toggleDropdownAccount}>
                        <MdAccountCircle className="text-3xl" />
                    </button>
                    {isDropdownDataBaseOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            <Link href="/database/produtos" className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white">
                            <div className="flex gap-2">
                                <LuPackage size={20} />
                                Produtos
                            </div>
                            </Link>
                            <Link href="/database/vendas" className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white">
                            <div className="flex gap-2">
                                <MdSell size={20} />
                                Vendas
                            </div>
                            </Link>
                        </div>
                    )}
                    {isDropdownDashboardOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-black hover:text-white">
                            <div className="flex gap-2">
                                <BsBarChartFill size={20} />
                                Dashboard
                            </div>
                            </Link>
                        </div>
                    )}
                    {isDropdownAccountOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            {/* {user.data ? (
                                <>
                                    <div className="flex flex-col gap-0 border-b border-gray-300">
                                        <div className="px-4 pt-2 pb-0 text-gray-800 text-xs">
                                            {user.data.email}
                                        </div>
                                        <div className="px-4 pb-2 text-gray-800 text-xs font-black">
                                            {user.data.nome}
                                        </div>
                                        <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                            Gerenciar Perfis
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <Link href="/access" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">

                                    Fazer Login
                                </Link>
                            )} */}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}