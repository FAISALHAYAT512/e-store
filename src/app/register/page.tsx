"use client"

import axios from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post("/api/register", {
        name,
        email,
        password,
      })

      toast.success("Registered successfully")
      router.push("/login")
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Registration failed")
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border p-6 shadow-lg">
      <h1 className="mb-6 text-2xl font-bold">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Name"
          className="w-full rounded-xl border p-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          type="email"
          className="w-full rounded-xl border p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full rounded-xl border p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full rounded-xl bg-black p-3 text-white">
          Register
        </button>
      </form>
    </div>
  )
}