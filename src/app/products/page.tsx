import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">All Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}