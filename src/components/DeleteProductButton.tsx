"use client"

import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?")
    if (!confirmDelete) return

    try {
      setLoading(true)
      await axios.delete(`/api/products/${productId}`)
      toast.success("Product deleted")
      router.refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Delete failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-xl bg-red-600 px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  )
}