import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    const cookieStore = await cookies();
    cookieStore.set("token", token, { httpOnly: true });

    return NextResponse.json({
      success: true,
      role: user.role,
      name: user.name,
    });
  } catch  {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
