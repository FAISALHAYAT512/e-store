"use client"

import { useState } from "react"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess("")
    setError("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (data.success) {
        setSuccess("Message sent successfully ✅")
        setForm({
          name: "",
          email: "",
          subject: "",
          message: "",
        })
      } else {
        setError(data.message || "Failed to send message ❌")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-10 md:p-14 border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
          Contact Us
        </h1>

        <p className="text-center text-gray-600 mb-10 text-lg md:text-xl">
          Have a question or need help? Send us a message and we’ll reply as soon as possible.
        </p>

        {success && (
          <div className="mb-6 rounded-lg bg-green-100 text-green-800 px-5 py-3 font-semibold text-center shadow-md">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-100 text-red-800 px-5 py-3 font-semibold text-center shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-bold text-gray-700">Your Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-black focus:border-black shadow-sm transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-700">Your Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-black focus:border-black shadow-sm transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-700">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Enter subject"
              className="w-full border border-gray-300 rounded-2xl px-5 py-3 outline-none focus:ring-4 focus:ring-black focus:border-black shadow-sm transition"
            />
          </div>

          <div>
            <label className="block mb-2 font-bold text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your message..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-black focus:border-black shadow-sm transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl hover:bg-gray-900 font-bold text-lg transition disabled:opacity-50 shadow-lg"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}