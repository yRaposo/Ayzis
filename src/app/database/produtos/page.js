'use client'

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductList from "@/components/ProductList";

export default function Products() {
    const router = useRouter();

    return (
        <div className="m-4 flex justify-between align-middle">
            <ProductList />
        </div>
    )
}