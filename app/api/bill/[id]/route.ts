import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET a bill by ID
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
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

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(bill, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bill:", error);
    return NextResponse.json({ error: "Failed to fetch bill" }, { status: 500 });
  }
}

// PUT: Mark bill as paid
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const bill = await prisma.bill.findUnique({
      where: { id },
    });

    if (!bill) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    if (bill.paid) {
      return NextResponse.json({ error: "Bill is already paid" }, { status: 400 });
    }

    const updatedBill = await prisma.bill.update({
      where: { id },
      data: {
        paid: true,
      },
    });

    return NextResponse.json(updatedBill, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 });
  }
}
