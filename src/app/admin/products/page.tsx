import AdminGuard from "@/components/AdminGuard"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import DeleteProductButton from "@/components/DeleteProductButton"

type ProductType = {
  id: string
  name: string
  price: number
  stock: number
  imageUrl: string
  createdAt: Date
}

export default async function AdminProductsPage() {
  const products: ProductType[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <AdminGuard>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Manage Products</h1>
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-black px-4 py-2 text-white"
          >
            Add Product
          </Link>
        </div>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="space-y-4">
            {products.map((product: ProductType) => (
              <div
                key={product.id}
                className="flex flex-col gap-4 rounded-2xl border p-4 shadow-sm md:flex-row md:items-center"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <p className="text-zinc-600">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-zinc-500">Stock: {product.stock}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-white"
                  >
                    Edit
                  </Link>

                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminGuard>
  )
}