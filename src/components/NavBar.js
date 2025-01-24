'use client';
import Link from "next/link";
import { MdHomeFilled, MdAccountCircle } from "react-icons/md";
import { PiPackageFill } from "react-icons/pi";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";


export default function NavBar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState([]);
    const router = useRouter();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    }

    return (
        <div className="bg-white text-gray-800 m-4 p-4 rounded-2xl border-2 border-gray-300 flex justify-between align-middle">
            <div className="flex gap-4 align-middle items-center">
                <Image src="/U.svg" alt="PlanUp" width={30} height={30} className="object-cover text-gray-800" />
                <h1 className="text-2xl font-black">PlanUp</h1>
            </div>
            <div className="flex text-gray-800 gap-4 align-middle items-center ">
                <Link href="/dashboard">
                    <MdHomeFilled className="text-3xl text-gray-800 align-middle items-center" />
                </Link>
                <Link href={`/dashboard/products`}>
                    <PiPackageFill className="text-3xl text-gray-800 align-middle items-center" />
                </Link>
                <Link href={`/dashboard/analyze`}>
                    <BsFileEarmarkBarGraphFill className="text-2xl text-gray-800 align-middle items-center" />
                </Link>
                <div className="relative align-middle items-center">
                    <button onClick={toggleDropdown}>
                        <MdAccountCircle className="text-3xl" />
                    </button>
                    {isDropdownOpen && (
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