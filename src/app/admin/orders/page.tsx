import AdminGuard from "@/components/AdminGuard"
import { prisma } from "@/lib/prisma"

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
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
      <div>
        <h1 className="mb-6 text-3xl font-bold">Manage Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border p-6 shadow-md">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">Order: {order.id}</p>
                    <p className="text-sm text-zinc-500">
                      Customer: {order.user?.email || "Guest User"}
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
                        src={item.product.imageUrl || "/placeholder.png"}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-zinc-500">
                          Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right text-xl font-bold">
                  Total: ${Number(order.totalAmount).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}