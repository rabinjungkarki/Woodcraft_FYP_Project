import { Head, Link } from '@inertiajs/react';
import { Package, ChevronRight } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; created_at: string; items: { id: number }[]; }

const STATUS: Record<string, { label: string; cls: string }> = {
    pending:    { label: 'Pending',    cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    processing: { label: 'Processing', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    shipped:    { label: 'Shipped',    cls: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    delivered:  { label: 'Delivered',  cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export default function Orders({ orders }: { orders: Order[] }) {
    return (
        <ShopLayout>
            <Head title="My Orders — WoodCraft" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-3xl font-bold mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="wood-card py-20 text-center space-y-4">
                        <Package className="w-16 h-16 mx-auto text-muted-foreground/40" />
                        <p className="text-xl font-semibold">No orders yet</p>
                        <p className="text-muted-foreground">Start shopping to see your orders here.</p>
                        <Link href="/shop" className="btn-wood inline-flex">Browse Products</Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map(order => {
                            const s = STATUS[order.status] ?? STATUS.pending;
                            return (
                                <Link key={order.id} href={`/orders/${order.id}`} className="wood-card p-5 flex items-center justify-between hover:-translate-y-0.5 block">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
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
                                            <p className="font-bold text-primary">Rs. {Number(order.total).toLocaleString()}</p>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
