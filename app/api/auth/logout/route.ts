import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  (await cookies()).delete("token");
  return NextResponse.json({ success: true, message: "Logged out" });
}
