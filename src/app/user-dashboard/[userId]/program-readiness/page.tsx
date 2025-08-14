"use client"

import { ProgramReadinessView } from "@/components/user-dashboard/components/ProgramReadinessView";
import { useParams } from "next/navigation";

export default function ProgramReadinessPage() {
    const params = useParams();
    const userId = params.userId as string;

    if (!userId) {
        return <div>Loading...</div>;
    }

    return <ProgramReadinessView userId={userId} />;
}
