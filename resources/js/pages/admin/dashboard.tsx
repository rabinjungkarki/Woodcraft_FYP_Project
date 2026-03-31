import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Stats {
    total_products: number;
    total_orders: number;
    total_users: number;
    total_revenue: number;
    pending_orders: number;
}

interface Order {
    id: number;
    total: number;
    status: string;
    payment_status: string;
    created_at: string;
    user: { name: string };
}

export default function AdminDashboard({ stats, recent_orders }: { stats: Stats; recent_orders: Order[] }) {
    const cards = [
        { label: 'Total Products', value: stats.total_products },
        { label: 'Total Orders', value: stats.total_orders },
        { label: 'Total Customers', value: stats.total_users },
        { label: 'Revenue (NPR)', value: `Rs. ${Number(stats.total_revenue).toLocaleString()}` },
        { label: 'Pending Orders', value: stats.pending_orders },
    ];

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin Dashboard', href: '/admin' }]}>
            <Head title="Admin Dashboard" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {cards.map((c) => (
                        <div key={c.label} className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
                            <p className="text-sm text-muted-foreground">{c.label}</p>
                            <p className="text-2xl font-bold mt-1">{c.value}</p>
                        </div>
                    ))}
                </div>

                <div className="rounded-xl border p-4 bg-white dark:bg-neutral-900">
                    <h2 className="font-semibold mb-3">Recent Orders</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="pb-2">ID</th>
                                <th className="pb-2">Customer</th>
                                <th className="pb-2">Total</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recent_orders.map((o) => (
                                <tr key={o.id} className="border-b last:border-0">
                                    <td className="py-2">#{o.id}</td>
                                    <td className="py-2">{o.user.name}</td>
                                    <td className="py-2">Rs. {Number(o.total).toLocaleString()}</td>
                                    <td className="py-2 capitalize">{o.status}</td>
                                    <td className="py-2 capitalize">{o.payment_status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex gap-3">
                    <Link href="/admin/products" className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm">Manage Products</Link>
                    <Link href="/admin/categories" className="rounded-lg border px-4 py-2 text-sm">Manage Categories</Link>
                    <Link href="/admin/orders" className="rounded-lg border px-4 py-2 text-sm">Manage Orders</Link>
                    <Link href="/admin/users" className="rounded-lg border px-4 py-2 text-sm">Manage Users</Link>
                </div>
            </div>
        </AppLayout>
    );
}
