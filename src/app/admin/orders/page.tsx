import { prisma } from "@/lib/prisma"

export default async function OrdersPage() {
  // Database se data lane ki koshish
  let orders: any[] = [];
  
  try {
    const data = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    orders = data || [];
  } catch (e) {
    orders = [];
  }

  // Display ke liye array tyyar kar rahe hain loop ke zariye
  const orderElements = [];
  for (const order of orders) {
    const itemElements = [];
    
    // Items ka loop
    if (order.items) {
      for (const item of order.items) {
        itemElements.push(
          <div key={item.id} className="flex items-center gap-4">
            <img
              src={item.product?.imageUrl || ""}
              alt={item.product?.name || "product"}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product?.name}</p>
              <p className="text-sm text-zinc-500">
                Qty: {item.quantity} × ${item.price}
              </p>
            </div>
          </div>
        );
      }
    }

    // Order Card
    orderElements.push(
      <div key={order.id} className="rounded-2xl border p-6 shadow-md">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-sm">Order ID: {order.id}</p>
          <span className="rounded-full bg-black px-3 py-1 text-xs text-white uppercase">
            {order.status}
          </span>
        </div>

        <div className="space-y-3">{itemElements}</div>

        <div className="mt-4 text-right text-xl font-bold">
          Total: ${Number(order.totalAmount || 0).toFixed(2)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Your Orders</h1>
      {orderElements.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-6">{orderElements}</div>
      )}
    </div>
  );
}
