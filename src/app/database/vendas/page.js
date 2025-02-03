'use client'

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VendasList from "@/components/VendasList";

export default function Products() {
    const router = useRouter();

    return (
        <div className="m-4 flex justify-between align-middle">
            <VendasList />
        </div>
    )
}