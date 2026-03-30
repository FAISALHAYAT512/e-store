"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-black text-white shadow-lg">
      <nav className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          FaisalStore
        </Link>

        <div className="flex items-center gap-5 text-sm md:text-base">
          <Link href="/products" className="hover:text-zinc-300 transition">
            Products
          </Link>
          <Link href="/cart" className="hover:text-zinc-300 transition">
            Cart
          </Link>

          {/* NEW CONTACT LINK */}
          <Link href="/contact" className="hover:text-zinc-300 transition">
            Contact
          </Link>

          {session && (
            <Link href="/orders" className="hover:text-zinc-300 transition">
              Orders
            </Link>
          )}

          {session?.user?.role === "ADMIN" && (
            <Link href="/admin/dashboard" className="hover:text-zinc-300 transition">
              Admin
            </Link>
          )}

          {!session ? (
            <>
              <Link href="/login" className="hover:text-zinc-300 transition">
                Login
              </Link>
              <Link href="/register" className="hover:text-zinc-300 transition">
                Register
              </Link>
            </>
          ) : (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg bg-white px-3 py-1.5 text-black hover:bg-zinc-200 transition"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}