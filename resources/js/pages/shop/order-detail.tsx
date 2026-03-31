import { imgSrc } from '@/lib/img';
import { Head, Link } from '@inertiajs/react';
import { Package, MapPin, Phone, CreditCard } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface OrderItem { id: number; quantity: number; price: number; product: { name: string; images: string[] | null }; }
interface Order { id: number; total: number; status: string; payment_method: string; payment_status: string; shipping_address: string; phone: string; created_at: string; items: OrderItem[]; }

const STATUS: Record<string, { label: string; cls: string; step: number }> = {
    pending:    { label: 'Order Placed',  cls: 'bg-yellow-100 text-yellow-700', step: 1 },
    processing: { label: 'Processing',   cls: 'bg-blue-100 text-blue-700',   step: 2 },
    shipped:    { label: 'Shipped',       cls: 'bg-purple-100 text-purple-700', step: 3 },
    delivered:  { label: 'Delivered',     cls: 'bg-green-100 text-green-700',  step: 4 },
    cancelled:  { label: 'Cancelled',     cls: 'bg-red-100 text-red-700',     step: 0 },
};

const STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetail({ order }: { order: Order }) {
    const s = STATUS[order.status] ?? STATUS.pending;

    return (
        <ShopLayout>
            <Head title={`Order #${order.id} — WoodCraft`} />
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">← My Orders</Link>
                </div>

                {/* Header */}
                <div className="wood-card p-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                        <p className="text-sm text-muted-foreground mt-1">{new Date(order.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`text-sm px-3 py-1.5 rounded-full font-semibold ${s.cls}`}>{s.label}</span>
                </div>

                {/* Progress tracker (not for cancelled) */}
                {order.status !== 'cancelled' && (
                    <div className="wood-card p-6">
                        <div className="flex items-center justify-between relative">
                            <div className="absolute left-0 right-0 top-4 h-0.5 bg-border -z-0" />
                            <div className="absolute left-0 top-4 h-0.5 bg-primary -z-0 transition-all duration-500" style={{ width: `${((s.step - 1) / (STEPS.length - 1)) * 100}%` }} />
                            {STEPS.map((step, i) => (
                                <div key={step} className="flex flex-col items-center gap-2 z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${i + 1 <= s.step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                        {i + 1 <= s.step ? '✓' : i + 1}
                                    </div>
                                    <p className="text-xs text-center hidden sm:block text-muted-foreground">{step}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { icon: <MapPin className="w-4 h-4" />, label: 'Delivery Address', value: order.shipping_address },
                        { icon: <Phone className="w-4 h-4" />, label: 'Phone', value: order.phone },
                        { icon: <CreditCard className="w-4 h-4" />, label: 'Payment Method', value: order.payment_method.toUpperCase() },
                        { icon: <Package className="w-4 h-4" />, label: 'Payment Status', value: order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1) },
                    ].map(info => (
                        <div key={info.label} className="wood-card p-4">
                            <div className="flex items-center gap-2 text-primary mb-1">{info.icon}<p className="text-xs font-medium text-muted-foreground">{info.label}</p></div>
                            <p className="font-semibold text-sm">{info.value}</p>
                        </div>
                    ))}
                </div>

                {/* Items */}
                <div className="wood-card p-5 space-y-4">
                    <h2 className="font-bold">Items Ordered</h2>
                    <div className="space-y-3">
                        {order.items.map(item => (
                            <div key={item.id} className="flex gap-3 items-center">
                                <div className="w-14 h-14 bg-accent rounded-xl overflow-hidden shrink-0">
                                    {item.product.images?.[0]
                                        ? <img src={imgSrc(item.product.images) ?? ''} alt="" className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center bg-muted"><svg className="w-5 h-5 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                    }
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{item.product.name}</p>
                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}</p>
                                </div>
                                <p className="font-bold text-sm">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary text-lg">Rs. {Number(order.total).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
