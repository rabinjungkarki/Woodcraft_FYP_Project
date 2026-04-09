import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; created_at: string; items: { id: number }[]; }

const STATUS: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    pending:    { label: 'Pending',    bg: '#fef9c3', color: '#854d0e', dot: '#eab308' },
    processing: { label: 'Processing', bg: '#dbeafe', color: '#1d4ed8', dot: '#3b82f6' },
    shipped:    { label: 'Shipped',    bg: '#ede9fe', color: '#6d28d9', dot: '#8b5cf6' },
    delivered:  { label: 'Delivered',  bg: '#dcfce7', color: '#15803d', dot: '#22c55e' },
    cancelled:  { label: 'Cancelled',  bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
};

export default function Orders({ orders }: { orders: Order[] }) {
    return (
        <ShopLayout>
            <Head title="My Orders — Wood Kala" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="serif text-3xl font-bold mb-8">My Orders</motion.h1>

                {orders.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="wood-card py-20 text-center space-y-4">
                        <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}>
                            <Package className="w-16 h-16 mx-auto text-muted-foreground/40" />
                        </motion.div>
                        <p className="serif text-xl font-bold">No orders yet</p>
                        <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition">
                            <ShoppingBag className="w-4 h-4" /> Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order, i) => {
                            const s = STATUS[order.status] ?? STATUS.pending;
                            return (
                                <motion.div key={order.id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                                    <Link href={`/orders/${order.id}`}
                                        className="glass-card rounded-2xl p-5 flex items-center justify-between hover:-translate-y-0.5 transition-all duration-300 block group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Package className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">Order #{order.id}</p>
                                                <p className="text-sm text-muted-foreground mt-0.5">
                                                    {order.items.length} item(s) · {new Date(order.created_at).toLocaleDateString()} · {order.payment_method.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <p className="font-bold text-primary">रू {Number(order.total).toLocaleString()}</p>
                                                <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: s.bg, color: s.color }}>
                                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
                                                    {s.label}
                                                </span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
