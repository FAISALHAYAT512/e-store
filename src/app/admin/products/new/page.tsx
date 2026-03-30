"use client"

import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function NewProductPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")
  const [featured, setFeatured] = useState(false)

  const [imageUrl, setImageUrl] = useState("")
  const [imagePublicId, setImagePublicId] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (file: File) => {
    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)

      const res = await axios.post("/api/upload", formData)

      setImageUrl(res.data.imageUrl)
      setImagePublicId(res.data.publicId)

      toast.success("Image uploaded")
    } catch (error) {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post("/api/admin/products", {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        featured,
        imageUrl,
        imagePublicId,
      })

      toast.success("Product created")
      router.push("/products")
      router.refresh()
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Create failed")
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border p-6 shadow-lg">
      <h1 className="mb-6 text-3xl font-bold">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button className="w-full rounded-xl bg-black p-3 text-white">
          Create Product
        </button>
      </form>
    </div>
  )
}