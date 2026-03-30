import AdminGuard from "@/components/AdminGuard"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function AdminDashboardPage() {
  const [productsCount, ordersCount, usersCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ])

  return (
    <AdminGuard>
      <div>
        <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-black p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">Products</h2>
            <p className="mt-2 text-3xl font-bold">{productsCount}</p>
          </div>

          <div className="rounded-2xl bg-black p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">Orders</h2>
            <p className="mt-2 text-3xl font-bold">{ordersCount}</p>
          </div>

          <div className="rounded-2xl bg-black p-6 text-white shadow-lg">
            <h2 className="text-lg font-semibold">Users</h2>
            <p className="mt-2 text-3xl font-bold">{usersCount}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="rounded-xl bg-black px-5 py-3 text-center text-white"
          >
            Add New Product
          </Link>

          <Link
            href="/admin/products"
            className="rounded-xl border border-black px-5 py-3 text-center"
          >
            Manage Products
          </Link>

          <Link
            href="/admin/orders"
            className="rounded-xl border border-black px-5 py-3 text-center"
          >
            Manage Orders
          </Link>
        </div>
      </div>
    </AdminGuard>
  )
}