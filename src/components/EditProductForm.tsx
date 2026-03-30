"use client"

import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface EditProductFormProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    featured: boolean
    imageUrl: string
    imagePublicId: string | null
  }
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()

  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(String(product.price))
  const [stock, setStock] = useState(String(product.stock))
  const [featured, setFeatured] = useState(product.featured)
  const [imageUrl, setImageUrl] = useState(product.imageUrl)
  const [imagePublicId, setImagePublicId] = useState(product.imagePublicId || "")
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      if (imagePublicId) {
        formData.append("oldPublicId", imagePublicId)
      }

      const res = await axios.post("/api/upload", formData)

      setImageUrl(res.data.imageUrl)
      setImagePublicId(res.data.publicId)

      toast.success("Image updated")
    } catch {
      toast.error("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setSaving(true)

      await axios.put(`/api/products/${product.id}`, {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        featured,
        imageUrl,
        imagePublicId,
      })

      toast.success("Product updated")
      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4 rounded-2xl border p-6 shadow-lg">
      <input
        className="w-full rounded-xl border p-3"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        className="w-full rounded-xl border p-3"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="w-full rounded-xl border p-3"
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        className="w-full rounded-xl border p-3"
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
        />
        Featured Product
      </label>

      <input
        type="file"
        accept="image/*"
        className="w-full rounded-xl border p-3"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />

      {uploading && <p>Uploading image...</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="h-48 w-full rounded-xl object-cover"
        />
      )}

      <button
        disabled={saving}
        className="w-full rounded-xl bg-black p-3 text-white disabled:opacity-50"
      >
        {saving ? "Saving..." : "Update Product"}
      </button>
    </form>
  )
}