import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import AppLayout from '@/layouts/app-layout';

interface OrderItem { quantity: number; price: number; product: { name: string }; }
interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; created_at: string; items: OrderItem[]; }

const STATUS_COLOR: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
};

export default function Dashboard({
    orders, total_orders, total_spent, cart_count,
}: {
    orders: Order[];
    total_orders: number;
    total_spent: number;
    cart_count: number;
}) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;

    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: dashboard() }]}>
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">

                {/* Welcome */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Welcome back, {auth.user.name} 👋</h1>
                        <p className="text-muted-foreground text-sm mt-1">{auth.user.email}</p>
                    </div>
                    <Link href="/shop" className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-800">
                        Browse Shop
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Orders', value: total_orders, icon: '📦', href: '/orders' },
                        { label: 'Total Spent', value: `Rs. ${Number(total_spent).toLocaleString()}`, icon: '💰', href: '/orders' },
                        { label: 'Items in Cart', value: cart_count, icon: '🛒', href: '/cart' },
                    ].map(s => (
                        <Link key={s.label} href={s.href} className="bg-white dark:bg-neutral-900 rounded-xl border p-5 hover:shadow-md transition flex items-center gap-4">
                            <span className="text-3xl">{s.icon}</span>
                            <div>
                                <p className="text-sm text-muted-foreground">{s.label}</p>
                                <p className="text-xl font-bold mt-0.5">{s.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: '🛍️ Shop Now', href: '/shop' },
                        { label: '🛒 My Cart', href: '/cart' },
                        { label: '📦 My Orders', href: '/orders' },
                        { label: '⚙️ Settings', href: '/settings/profile' },
                    ].map(l => (
                        <Link key={l.label} href={l.href} className="bg-white dark:bg-neutral-900 border rounded-xl p-4 text-center text-sm font-medium hover:shadow-md hover:border-amber-300 transition">
                            {l.label}
                        </Link>
                    ))}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl border">
                    <div className="flex items-center justify-between px-5 py-4 border-b">
                        <h2 className="font-semibold">Recent Orders</h2>
                        <Link href="/orders" className="text-sm text-amber-700 hover:underline">View all</Link>
                    </div>

                    {orders.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <p className="text-3xl mb-2">📭</p>
                            <p className="text-sm">No orders yet.</p>
                            <Link href="/shop" className="mt-3 inline-block text-sm text-amber-700 hover:underline">Start shopping →</Link>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {orders.map(order => (
                                <Link key={order.id} href={`/orders/${order.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                                    <div>
                                        <p className="font-medium text-sm">Order #{order.id}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {order.items.length} item(s) · {new Date(order.created_at).toLocaleDateString()} · {order.payment_method.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-sm text-amber-700">Rs. {Number(order.total).toLocaleString()}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${STATUS_COLOR[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}
