import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 })
    }

    const body = await req.json()
    const { productId, quantity } = body

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: session.user.id,
        },
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + (quantity || 1),
        },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: quantity || 1,
        },
      })
    }

    return NextResponse.json({ success: true, message: "Added to cart" })
  } catch (error) {
    console.error("ADD_CART_ERROR", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}