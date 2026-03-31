import { prisma } from "@/lib/prisma"

export default async function OrdersPage() {
  let orders: any[] = [];

  try {
    // Database se data lane ki koshish
    const fetchedOrders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    orders = fetchedOrders;
  } catch (error) {
    console.error("Database error:", error);
    // Agar DB error de toh khali array show hoga, build nahi rukay gi
    orders = [];
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Orders</h1>

      {!orders || orders.length === 0 ? (
        <p className="text-gray-600">No orders yet or database connection issue.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="rounded-2xl border p-6 shadow-md">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-sm">Order ID: {order.id}</p>
                <span className="rounded-full bg-black px-3 py-1 text-xs text-white uppercase">
                  {order.status || "Pending"}
                </span>
              </div>

              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4">
                    {item.product?.imageUrl && (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || "Product"}</p>
                      <p className="text-sm text-zinc-500">
                        Qty: {item.quantity} × ${item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right text-xl font-bold">
                Total: ${Number(order.totalAmount || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
