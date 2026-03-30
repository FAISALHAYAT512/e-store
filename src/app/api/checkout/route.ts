import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "pkr",
            product_data: {
              name: "Stripe Test Product",
              description: "Test payment from your e-commerce store",
            },
            unit_amount: 20000, // Rs. 200
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/checkout/success",
      cancel_url: "http://localhost:3000/cart",
    })

    return NextResponse.json({
      success: true,
      url: session.url,
    })
  } catch (error: any) {
    console.error("STRIPE CHECKOUT ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Checkout failed",
      },
      { status: 500 }
    )
  }
}