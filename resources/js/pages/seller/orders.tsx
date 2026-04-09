import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { name: string }; }
interface Order { id: number; total: number; status: string; payment_status: string; created_at: string; user: { name: string }; items: OrderItem[]; }

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_CLS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped:    'bg-purple-100 text-purple-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
};

function OrderRow({ order }: { order: Order }) {
    const form = useForm({ status: order.status });
    return (
        <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors align-top">
            <td className="px-5 py-3 font-medium text-slate-800">#{order.id}</td>
            <td className="px-5 py-3 text-slate-700">{order.user.name}</td>
            <td className="px-5 py-3 text-slate-500 text-xs">
                {order.items.map(i => <p key={i.id}>{i.product.name} ×{i.quantity}</p>)}
            </td>
            <td className="px-5 py-3 font-semibold text-slate-800">रू {Number(order.total).toLocaleString()}</td>
            <td className="px-5 py-3 text-slate-500 text-xs">{new Date(order.created_at).toLocaleDateString()}</td>
            <td className="px-5 py-3">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_CLS[order.payment_status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {order.payment_status}
                </span>
            </td>
            <td className="px-5 py-3">
                <select
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400/40 cursor-pointer"
                    value={form.data.status}
                    onChange={e => { form.setData('status', e.target.value); form.patch(`/seller/orders/${order.id}`, { preserveScroll: true }); }}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
            </td>
        </tr>
    );
}

export default function SellerOrders({ orders }: { orders: Order[] }) {
    return (
        <SellerLayout title="Orders">
            <Head title="Orders — Seller Panel" />
            <div className="space-y-5">

                <div>
                    <h1 className="text-xl font-bold text-slate-800">Orders</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{orders.length} order{orders.length !== 1 ? 's' : ''} for your products</p>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 text-sm">No orders yet. Orders for your products will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
                                        <th className="px-5 py-3">Order</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Items</th>
                                        <th className="px-5 py-3">Total</th>
                                        <th className="px-5 py-3">Date</th>
                                        <th className="px-5 py-3">Payment</th>
                                        <th className="px-5 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(o => <OrderRow key={o.id} order={o} />)}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </SellerLayout>
    );
}
