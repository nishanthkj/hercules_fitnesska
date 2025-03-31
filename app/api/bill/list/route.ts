import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Ensure you have Prisma properly configured
import { getUserFromToken } from "@/lib/auth"; // Function to get user from the JWT token

export async function GET() {
  try {
    // Retrieve the logged-in user session from the JWT token
    const session = await getUserFromToken();
    if (!session?.id) {
      // If no user session is found, return a 401 Unauthorized response
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all bills created by the logged-in user
    const bills = await prisma.bill.findMany({
      where: {
        userId: session.id, // Filter bills based on the logged-in user's ID
      },
      orderBy: { createdAt: "desc" }, // Order bills by creation date (most recent first)
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

    // Return the list of bills as a JSON response
    return NextResponse.json({ bills }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bills:", error);
    // Return an error response if something goes wrong
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}
