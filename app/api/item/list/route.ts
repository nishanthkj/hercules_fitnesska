import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      select: {
        id: true,
        modelNumber: true,
        name: true,
        description: true,
        price: true,
        specialPrice: true,
        image: true, // Binary image buffer
      },
    });

    const itemsWithImage = items.map((item) => ({
      ...item,
      image: item.image
        ? `data:image/jpeg;base64,${Buffer.from(item.image).toString("base64")}`
        : null,
    }));

    return NextResponse.json({ items: itemsWithImage });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}
