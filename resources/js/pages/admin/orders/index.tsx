import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { name: string }; }
interface Order {
    id: number; total: number; status: string; payment_method: string;
    payment_status: string; shipping_address: string; phone: string;
    created_at: string; user: { name: string; email: string };
    items: OrderItem[];
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function OrderRow({ order }: { order: Order }) {
    const form = useForm({ status: order.status });

    return (
        <tr className="border-b last:border-0 align-top">
            <td className="px-4 py-3">#{order.id}</td>
            <td className="px-4 py-3">
                <p className="font-medium">{order.user.name}</p>
                <p className="text-xs text-muted-foreground">{order.user.email}</p>
            </td>
            <td className="px-4 py-3">
                {order.items.map(i => (
                    <p key={i.id} className="text-xs">{i.product.name} × {i.quantity}</p>
                ))}
            </td>
            <td className="px-4 py-3">Rs. {Number(order.total).toLocaleString()}</td>
            <td className="px-4 py-3 capitalize">{order.payment_method} / {order.payment_status}</td>
            <td className="px-4 py-3">
                <select
                    className="border rounded-lg px-2 py-1 text-sm"
                    value={form.data.status}
                    onChange={e => {
                        form.setData('status', e.target.value);
                        form.patch(`/admin/orders/${order.id}`, { preserveScroll: true });
                    }}
                >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </td>
        </tr>
    );
}

export default function OrdersIndex({ orders }: { orders: Order[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Orders', href: '/admin/orders' }]}>
            <Head title="Orders" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Orders</h1>
                <div className="rounded-xl border bg-white dark:bg-neutral-900 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Items</th>
                                <th className="px-4 py-3">Total</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => <OrderRow key={o.id} order={o} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
