import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
//import { generateToken } from "@/lib/auth";
//import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { name, email, password, role } = await req.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return NextResponse.json({ error: "User already exists" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { name, email, password: hashed, role: role || "USER" },
    });

    // const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });
    // const cookieStore = await cookies();
    // cookieStore.set("token", token, { httpOnly: true });

    return NextResponse.json({ success: true, user });
}
