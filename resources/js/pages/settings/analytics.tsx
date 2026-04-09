import { Head } from '@inertiajs/react';
import { ShoppingBag, Heart, DollarSign, CheckCircle } from 'lucide-react';

interface Analytics { total_orders: number; wishlist_items: number; total_spent: number; delivered: number; }

export default function Analytics({ analytics }: { analytics: Analytics }) {
    const stats = [
        { label: 'Total Orders',    value: analytics.total_orders,   icon: ShoppingBag, color: '#3b82f6', bg: '#EFF6FF' },
        { label: 'Wishlist Items',  value: analytics.wishlist_items,  icon: Heart,       color: '#ec4899', bg: '#FDF2F8' },
        { label: 'Total Spent',     value: `रू ${Number(analytics.total_spent).toLocaleString()}`, icon: DollarSign, color: '#A67C52', bg: '#FDF0E6' },
        { label: 'Delivered Orders',value: analytics.delivered,       icon: CheckCircle, color: '#15803d', bg: '#F0FDF4' },
    ];

    return (
        <>
            <Head title="Analytics" />
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                <h2 className="font-bold text-base mb-5" style={{ color: '#1A1A1A' }}>Your Activity</h2>
                <div className="space-y-3">
                    {stats.map(s => {
                        const Icon = s.icon;
                        return (
                            <div key={s.label} className="flex items-center gap-4 p-4 rounded-xl border" style={{ borderColor: '#F0EDE8' }}>
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.bg }}>
                                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium" style={{ color: '#6B5B4E' }}>{s.label}</p>
                                </div>
                                <p className="text-lg font-bold" style={{ color: '#1A1A1A' }}>{s.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
