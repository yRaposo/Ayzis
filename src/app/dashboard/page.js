'use client'

import DashList from "@/components/DashList";
import DashList2 from "@/components/DashList2";

export default function dashboard() {

    return (
        <div className="m-4 flex justify-between align-middle">
            <DashList2 />
        </div>
    );
}