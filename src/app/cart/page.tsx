"use client"

import CheckoutButton from "@/components/CheckoutButton"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface CartItemType {
  id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const res = await axios.get("/api/cart")
      setItems(res.data?.items || [])
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Login required")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const removeItem = async (cartItemId: string) => {
    try {
      await axios.post("/api/cart/remove", { cartItemId })
      toast.success("Removed")
      fetchCart()
    } catch {
      toast.error("Failed to remove")
    }
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  if (loading) return <p>Loading cart...</p>

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>

      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 rounded-2xl border p-4 shadow-sm"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              <div className="flex-1">
                <h3 className="font-bold">{item.product.name}</h3>
                <p>${item.product.price}</p>
                <p>Qty: {item.quantity}</p>
              </div>

              <button
                onClick={() => removeItem(item.id)}
                className="rounded-xl bg-red-600 px-4 py-2 text-white"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6 rounded-2xl bg-black p-6 text-white">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
          </div>

          {/* ✅ Checkout button yahan hona chahiye */}
          <div className="mt-4">
            <CheckoutButton />
          </div>
        </div>
      )}
    </div>
  )
}