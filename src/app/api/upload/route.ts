import cloudinary from "@/lib/cloudinary"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const oldPublicId = formData.get("oldPublicId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (oldPublicId) {
      try {
        await cloudinary.uploader.destroy(oldPublicId)
      } catch (error) {
        console.error("OLD_IMAGE_DELETE_ERROR", error)
      }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce/products",
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      uploadStream.end(buffer)
    })

    return NextResponse.json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error) {
    console.error("UPLOAD_ERROR", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}