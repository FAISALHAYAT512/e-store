import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

type CartItemWithProduct = {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: {
    price: number
  }
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (error) {
    console.error("STRIPE_WEBHOOK_SIGNATURE_ERROR", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const stripeSessionId = session.id

      if (!userId) {
        return NextResponse.json(
          { error: "Missing userId in metadata" },
          { status: 400 }
        )
      }

      const existingOrder = await prisma.order.findFirst({
        where: { stripeSessionId },
      })

      if (existingOrder) {
        return NextResponse.json({ received: true })
      }

      const cart = await prisma.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!cart || cart.items.length === 0) {
        return NextResponse.json(
          { error: "Cart not found or empty" },
          { status: 400 }
        )
      }

      const cartItems = cart.items as CartItemWithProduct[]

      const totalAmount: number = cartItems.reduce(
        (sum: number, item: CartItemWithProduct) => {
          return sum + item.product.price * item.quantity
        },
        0
      )

      await prisma.order.create({
        data: {
          userId,
          totalAmount,
          status: "PAID",
          stripeSessionId,
          items: {
            create: cartItems.map((item: CartItemWithProduct) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      })

      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("STRIPE_WEBHOOK_PROCESSING_ERROR", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}