'use client'

import DashList from "@/components/DashList";
import StatsQTDVenda from "@/components/StatsQTDVenda";
import SomaQTDVenda from "@/components/StatsQTDVenda";
import StatsVALVenda from "@/components/StatsVALVenda";

export default function dashboard() {

    return (
        <div className="m-4 flex justify-between align-middle">
            <StatsVALVenda/>
        </div>
    );
}