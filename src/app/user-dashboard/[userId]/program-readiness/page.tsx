"use client"

import { ProgramReadinessView } from "@/components/user-dashboard/components/ProgramReadinessView";
import { useParams } from "next/navigation";

export default function ProgramReadinessPage() {
    const params = useParams();
    const userId = params.userId as string;

    if (!userId) {
        return <div>Loading...</div>;
    }

    return <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        <ProgramReadinessView userId={userId} />
        </div>
}
