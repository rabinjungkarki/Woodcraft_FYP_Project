import { Head, Link } from '@inertiajs/react';
import ShopLayout from '@/components/shop-layout';

interface Order { id: number; total: number; }

export default function PaymentKhalti({ order }: { order: Order }) {
    return (
        <ShopLayout>
            <Head title="Redirecting to Khalti — Wood Kala" />
            <div className="max-w-sm mx-auto px-4 py-20 text-center">
                <div className="bg-white rounded-2xl border p-8 space-y-5" style={{ borderColor: '#E8DDD0', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: '#F5F0FF' }}>
                        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#6d28d9"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold" style={{ color: '#1A1A1A', fontFamily: "'Playfair Display', serif" }}>Redirecting to Khalti</h1>
                        <p className="text-sm mt-1" style={{ color: '#9A8070' }}>Order #{order.id}</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: '#A67C52' }}>रू {Number(order.total).toLocaleString()}</p>
                    <p className="text-sm" style={{ color: '#6B5B4E' }}>
                        You should have been redirected to Khalti automatically. If not, please go back and try again.
                    </p>
                    <Link href={`/orders/${order.id}`} className="block text-sm font-medium hover:underline" style={{ color: '#A67C52' }}>
                        ← View Order
                    </Link>
                </div>
            </div>
        </ShopLayout>
    );
}
