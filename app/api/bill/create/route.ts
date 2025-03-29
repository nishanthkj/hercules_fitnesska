import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

type SelectedItem = {
  id: string;
  quantity: number;
};

interface BillRequestBody {
  invoiceNo: string;
  refNumber?: string;
  customerName: string;
  to?: string;
  address?: string;
  branch?: string;
  location?: string;
  selectedItems: SelectedItem[];
  paid?: boolean;
  deliveryTerms?: string;
  paymentTerms?: string;
  warranty?: string;
  bankDetails?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: BillRequestBody = await req.json();

    const {
      invoiceNo,
      refNumber,
      customerName,
      to,
      address,
      branch,
      location,
      selectedItems,
      paid,
      deliveryTerms,
      paymentTerms,
      warranty,
      bankDetails,
      contactPerson,
      contactPhone,
    } = body;

    if (!invoiceNo || !customerName || !selectedItems?.length) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const itemIds = selectedItems.map((i) => i.id);

    const items = await prisma.item.findMany({
      where: { id: { in: itemIds } },
    });

    if (!items.length) {
      return NextResponse.json({ error: "No valid items found." }, { status: 404 });
    }

    const billedItems = items.map((item) => {
      const matched = selectedItems.find((i) => i.id === item.id);
      const quantity = matched?.quantity ?? 1;
      const total = item.specialPrice * quantity;

      return {
        id: item.id,
        modelNumber: item.modelNumber,
        name: item.name,
        description: item.description,
        mrp: item.price,
        specialPrice: item.specialPrice,
        quantity,
        total,
        unit: "Nos",
      };
    });

    const totalAmount = billedItems.reduce((sum, item) => sum + item.total, 0);
    const gstAmount = Number((totalAmount * 0.18).toFixed(2));
    const netAmount = Number((totalAmount + gstAmount).toFixed(2));

    const bill = await prisma.bill.create({
      data: {
        to: to ?? customerName,
        address: address ?? location ?? "",
        invoiceNo,
        refNumber,
        customerName,
        branch,
        location,
        userId: user.id,
        items: {
          connect: itemIds.map((id) => ({ id })),
        },
        billedItems,
        totalAmount,
        gstAmount,
        netAmount,
        paid: paid ?? false,
        deliveryTerms,
        paymentTerms,
        warranty,
        bankDetails,
        contactPerson,
        contactPhone,
      },
    });

    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating bill:", error);
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}
