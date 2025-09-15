import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/with-auth";

export const GET = withAuth(async (req, { session}) => {
  return NextResponse.json({ session });
}); 
