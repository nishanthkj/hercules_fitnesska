import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch single item by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const imageDataUri = item.image
      ? `data:image/jpeg;base64,${Buffer.from(item.image).toString("base64")}`
      : null;

    return NextResponse.json({
      id: item.id,
      name: item.name,
      modelNumber: item.modelNumber,
      description: item.description,
      price: item.price,
      specialPrice: item.specialPrice,
      image: imageDataUri,
    });
  } catch (err) {
    console.error("GET /api/item/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update item by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const data = await req.json();

    const updatedItem = await prisma.item.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        specialPrice: data.specialPrice,
        modelNumber: data.modelNumber,
        image: data.image ? Buffer.from(data.image, "base64") : null,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (err) {
    console.error("PUT /api/item/[id] error:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
