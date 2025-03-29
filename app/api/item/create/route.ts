import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Create the item with the calculated total
        const newItem = await prisma.item.create({
            data: {
                modelNumber: data.modelNumber,
                name: data.name,
                description: data.description || "",
                price: parseFloat(data.price),
                specialPrice: parseFloat(data.specialPrice),
                image: data.image ? Buffer.from(data.image, 'base64') : null,

            }
        });

        return NextResponse.json({
            success: true,
            message: "Item created successfully",
            data: newItem
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating item:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create item",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}