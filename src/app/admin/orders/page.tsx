// src/app/admin/orders/page.tsx
import AdminGuard from "@/components/AdminGuard"
import { prisma } from "@/lib/prisma"

type OrderWithRelations = {
  id: string
  status: string
  totalAmount: number
  createdAt: Date
  user: {
    email: string
  } | null
  items: {
    id: string
    quantity: number
    price: number
    product: {
      id: string
      name: string
      imageUrl: string
    }
  }[]
}

export default async function AdminOrdersPage() {
  const orders: OrderWithRelations[] = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Manage Orders</h1>

        {orders.length === 0 ? (
          <p className="text-gray-600">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border p-6 shadow-md">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">Order: {order.id}</p>
                    <p className="text-sm text-zinc-500">
                      Customer: {order.user?.email || "No email"}
                    </p>
                  </div>

                  <span className="rounded-full bg-black px-3 py-1 text-sm text-white">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-zinc-500">
                          Qty: {item.quantity} × ${item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-xl font-bold">
                  Total: ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}