import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import slugify from "slugify"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, price, imageUrl, imagePublicId, stock, featured } = body

    if (!name || !description || !price || !imageUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const slug = slugify(name, { lower: true, strict: true }) + "-" + Date.now()

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        imageUrl,
        imagePublicId,
        stock: Number(stock || 0),
        featured: Boolean(featured),
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("ADMIN_CREATE_PRODUCT_ERROR", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}