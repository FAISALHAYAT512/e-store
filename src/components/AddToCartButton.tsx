"use client"

import axios from "axios"
import toast from "react-hot-toast"

export default function AddToCartButton({ productId }: { productId: string }) {
  const handleAdd = async () => {
    try {
      const res = await axios.post("/api/cart/add", { productId, quantity: 1 })
      toast.success(res.data.message || "Added to cart")
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Login required")
    }
  }

  return (
    <button
      onClick={handleAdd}
      className="rounded-xl border border-black px-4 py-2 font-medium text-black transition hover:bg-black hover:text-white"
    >
      Add
    </button>
  )
}