// src/app/orders/page.tsx
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

// Prisma type for Order with items & products
import { Prisma } from "@prisma/client"
type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true
      }
    }
  }
}>

export default async function OrdersPage() {
  // Check user session
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    redirect("/login")
  }

  // Fetch user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  // Fetch user's orders with items & products
  const orders: OrderWithItems[] = await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border p-6 shadow-md"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <span>{item.product.name}</span>
                    </div>
                    <span>
                      {item.quantity} × PKR {item.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right font-bold">
                Total: PKR{" "}
                {order.items.reduce(
                  (sum: number, item) => sum + item.price * item.quantity,
                  0
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}