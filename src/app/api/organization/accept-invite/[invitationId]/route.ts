import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest,{params}: {params: Promise<{invitationId: string}> }) {
    const { invitationId } = await params;
    
    try {
        await auth.api.acceptInvitation({
        body: {
            invitationId: invitationId, // required
        },
        headers: await headers(),
    });   
    return NextResponse.redirect(new URL("/app", request.url));  
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL("/app", request.url));
    }
}