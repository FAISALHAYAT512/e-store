import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/ProductCard"

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <section className="mb-10 rounded-3xl bg-black px-6 py-12 text-white">
        <h1 className="text-4xl font-bold md:text-5xl">Premium E-Commerce Store</h1>
        <p className="mt-3 text-zinc-300">Luxury black UI + database powered products</p>
      </section>

      <section>
        <h2 className="mb-6 text-3xl font-bold">Featured Products</h2>

        {products.length === 0 ? (
          <p>No featured products yet. Add from admin panel.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}