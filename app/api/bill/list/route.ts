import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        billedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        items: {
          select: {
            id: true,
            name: true,
            modelNumber: true,
          },
        },
      },
    });

    return NextResponse.json({ bills }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bills:", error);
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}
