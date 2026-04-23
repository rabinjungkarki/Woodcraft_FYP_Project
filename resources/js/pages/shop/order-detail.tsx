import { imgSrc } from '@/lib/img';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, Phone, CreditCard, XCircle } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { name: string; images: string[] | null }; }
interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; shipping_address: string; phone: string; created_at: string; items: OrderItem[]; }

const STATUS: Record<string, { label: string; bg: string; color: string; step: number }> = {
    pending:    { label: 'Order Placed',  bg: '#fef9c3', color: '#854d0e', step: 1 },
    processing: { label: 'Processing',   bg: '#dbeafe', color: '#1d4ed8', step: 2 },
    shipped:    { label: 'Shipped',       bg: '#ede9fe', color: '#6d28d9', step: 3 },
    delivered:  { label: 'Delivered',     bg: '#dcfce7', color: '#15803d', step: 4 },
    cancelled:  { label: 'Cancelled',     bg: '#fee2e2', color: '#dc2626', step: 0 },
};

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetail({ order }: { order: Order }) {
    const s = STATUS[order.status] ?? STATUS.pending;
    const cancelForm = useForm({});
    const canCancel = ['pending', 'processing'].includes(order.status);

    useEffect(() => {
        if (['pending', 'processing', 'shipped'].includes(order.status)) {
            const interval = setInterval(() => router.reload({ only: ['order'] }), 15000);
            return () => clearInterval(interval);
        }
    }, [order.status]);

    return (
        <ShopLayout>
            <Head title={`Order #${order.id} — Wood Kala`} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">← My Orders</Link>
                </motion.div>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-card rounded-2xl p-6 flex items-start justify-between">
                    <div>
                        <h1 className="serif text-2xl font-bold">Order #{order.id}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm px-3 py-1.5 rounded-full font-semibold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        {order.payment_method === 'khalti' && order.payment_status === 'unpaid' && order.status !== 'cancelled' && (
                            <a href={`/payment/khalti/${order.id}`}
                                className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 py-1.5 rounded-xl transition-colors"
                                style={{ background: '#5C2D91' }}>
                                Pay with Khalti
                            </a>
                        )}
                        {canCancel && (
                            <button onClick={() => confirm('Cancel this order?') && cancelForm.patch(`/orders/${order.id}/cancel`)}
                                disabled={cancelForm.processing}
                                className="flex items-center gap-1.5 text-sm text-destructive border border-destructive/30 px-3 py-1.5 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50">
                                <XCircle className="w-3.5 h-3.5" /> Cancel
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Progress tracker */}
                {order.status !== 'cancelled' && (
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.45 }}
                        className="glass-card rounded-2xl p-6">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border -z-0" />
                            <motion.div className="absolute left-0 top-4 h-0.5 bg-primary -z-0"
                                initial={{ width: '0%' }}
                                animate={{ width: `${((s.step - 1) / (STEPS.length - 1)) * 100}%` }}
                                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                            {STEPS.map((step, i) => (
                                <div key={step} className="flex flex-col items-center gap-2 z-10">
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i + 1 <= s.step ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30' : 'bg-white text-muted-foreground border border-border'}`}>
                                        {i + 1 <= s.step ? '✓' : i + 1}
                                    </motion.div>
                                    <p className="text-xs text-center hidden sm:block text-muted-foreground">{step}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: <MapPin className="w-4 h-4" />, label: 'Delivery Address', value: order.shipping_address },
                        { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: order.phone },
                        { icon: <CreditCard className="w-4 h-4" />, label: 'Payment Method', value: order.payment_method.toUpperCase() },
                        { icon: <Package className="w-4 h-4" />, label: 'Payment Status', value: order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) },
                    ].map((info, i) => (
                        <motion.div key={info.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                            className="glass-card rounded-2xl p-4">
                            <div className="flex items-center gap-2 text-primary mb-1">{info.icon}<p className="text-xs font-medium text-muted-foreground">{info.label}</p></div>
                            <p className="font-semibold text-sm">{info.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Items */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}
                    className="glass-card rounded-2xl p-5 space-y-4">
                    <h2 className="font-bold">Items Ordered</h2>
                    <div className="space-y-3">
                        {order.items.map(item => (
                            <div key={item.id} className="flex gap-3 items-center">
                                <div className="w-14 h-14 bg-accent rounded-xl overflow-hidden shrink-0">
                                    {item.product.images?.[0]
                                        ? <img src={imgSrc(item.product.images) ?? ''} alt="" className="w-full h-full object-cover" />
                                        : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=80&h=80&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-40" />
                                    }
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × रू {Number(item.price).toLocaleString()}</p>
                                </div>
                                <p className="font-bold text-sm">रू {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary text-lg">रू {Number(order.total).toLocaleString()}</span>
                    </div>
                </motion.div>
            </div>
        </ShopLayout>
    );
}
