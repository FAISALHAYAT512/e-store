import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const userCount = await prisma.user.count()

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userCount === 0 ? "ADMIN" : "USER",
      },
    })

    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("REGISTER_ERROR", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}