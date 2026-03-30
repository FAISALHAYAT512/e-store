import Link from "next/link"
import AddToCartButton from "./AddToCartButton"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
    stock: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg transition hover:scale-[1.02]">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-60 w-full object-cover"
      />

      <div className="p-4">
        <h3 className="line-clamp-1 text-lg font-bold">{product.name}</h3>
        <p className="mt-2 text-xl font-semibold">${product.price}</p>
        <p className="mt-1 text-sm text-zinc-500">Stock: {product.stock}</p>

        <div className="mt-4 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-xl bg-black px-4 py-2 text-center text-white transition hover:bg-zinc-800"
          >
            View
          </Link>

          <AddToCartButton productId={product.id} />
        </div>
      </div>
    </div>
  )
}