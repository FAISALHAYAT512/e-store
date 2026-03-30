import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { cartItemId } = body

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("REMOVE_CART_ERROR", error)
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 })
  }
}