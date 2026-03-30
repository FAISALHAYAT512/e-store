"use client"

import axios from "axios"
import toast from "react-hot-toast"
import { useState } from "react"

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)

      const res = await axios.post("/api/checkout")

      if (res.data?.url) {
        window.location.href = res.data.url
      } else {
        toast.error("Checkout URL not found")
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="mt-4 w-full rounded-xl bg-green-600 p-3 text-white transition hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Checkout with Stripe"}
    </button>
  )
}