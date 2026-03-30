import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/AddToCartButton"

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
  })

  if (!product) return notFound()

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-[500px] w-full rounded-3xl object-cover shadow-xl"
      />

      <div>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-semibold">${product.price}</p>
        <p className="mt-4 text-zinc-600">{product.description}</p>
        <p className="mt-3 text-sm text-zinc-500">Stock: {product.stock}</p>

        <div className="mt-6">
          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}