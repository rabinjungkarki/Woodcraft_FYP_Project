import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ShoppingCart, Users, DollarSign, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import SellerLayout from '@/layouts/seller-layout';

interface Stats { total_products: number; total_orders: number; total_users: number; total_revenue: number; pending_orders: number; }
interface Order { id: number; total: number; status: string; payment_status: string; created_at: string; user: { name: string }; }

const STATUS_COLOR: Record<string, string> = {
    pending:    '#f59e0b', processing: '#6366f1',
    shipped:    '#8b5cf6', delivered:  '#10b981', cancelled: '#ef4444',
};
const PAY_COLOR: Record<string, string> = {
    paid: '#10b981', pending: '#f59e0b', failed: '#ef4444',
};

const GROWTH_DATA = [
    { month: 'Sep', revenue: 45000, orders: 18 },
    { month: 'Oct', revenue: 62000, orders: 25 },
    { month: 'Nov', revenue: 58000, orders: 22 },
    { month: 'Dec', revenue: 89000, orders: 38 },
    { month: 'Jan', revenue: 74000, orders: 30 },
    { month: 'Feb', revenue: 95000, orders: 42 },
    { month: 'Mar', revenue: 112000, orders: 51 },
];

const ORDER_STATUS_DATA = [
    { name: 'Delivered',  value: 58, color: '#10b981' },
    { name: 'Processing', value: 22, color: '#6366f1' },
    { name: 'Pending',    value: 14, color: '#f59e0b' },
    { name: 'Cancelled',  value: 6,  color: '#ef4444' },
];

const QUICK_LINKS = [
    { href: '/admin/products',   label: 'Products',   desc: 'Manage all listings' },
    { href: '/admin/categories', label: 'Categories', desc: 'Organise the catalogue' },
    { href: '/admin/orders',     label: 'Orders',     desc: 'View & update orders' },
    { href: '/admin/users',      label: 'Customers',  desc: 'Browse all users' },
    { href: '/admin/reviews',    label: 'Reviews',    desc: 'Moderate feedback' },
];

const fade = {
    hidden: { opacity: 0, y: 18 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }),
};

const CARDS = [
    { label: 'Total Products', key: 'total_products',  icon: Package,      neon: '#6366f1', glow: 'rgba(99,102,241,0.35)' },
    { label: 'Total Orders',   key: 'total_orders',    icon: ShoppingCart, neon: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
    { label: 'Customers',      key: 'total_users',     icon: Users,        neon: '#10b981', glow: 'rgba(16,185,129,0.35)' },
    { label: 'Revenue (NPR)',  key: 'total_revenue',   icon: DollarSign,   neon: '#A67C52', glow: 'rgba(166,124,82,0.35)', format: (v: number) => `रू ${v.toLocaleString()}` },
    { label: 'Pending Orders', key: 'pending_orders',  icon: Clock,        neon: '#ef4444', glow: 'rgba(239,68,68,0.35)' },
] as const;

export default function AdminDashboard({ stats, recent_orders }: { stats: Stats; recent_orders: Order[] }) {
    return (
        <SellerLayout title="Dashboard">
            <Head title="Admin Dashboard — Wood Kala" />
            <div className="space-y-6" style={{ fontFamily: "'Inter', sans-serif" }}>

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>Platform Overview</h1>
                        <p className="text-sm mt-0.5" style={{ color: '#7A6A5A' }}>Wood Kala Admin · Live data</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border"
                        style={{ background: '#FDF9F5', borderColor: '#E8DDD0', color: '#A67C52' }}>
                        <TrendingUp className="w-3.5 h-3.5" />
                        Real-time
                    </div>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {CARDS.map((c, i) => {
                        const Icon = c.icon;
                        const raw = stats[c.key] as number;
                        const val = 'format' in c ? c.format(raw) : raw;
                        return (
                            <motion.div key={c.label} custom={i} variants={fade} initial="hidden" animate="show"
                                className="relative rounded-2xl p-5 overflow-hidden group cursor-default"
                                style={{
                                    background: '#FFFFFF',
                                    border: `1.5px solid ${c.neon}40`,
                                    boxShadow: `0 0 0 0 ${c.glow}`,
                                    transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                                }}
                                whileHover={{ y: -3, boxShadow: `0 8px 30px ${c.glow}` } as any}>
                                {/* Wood grain texture accent */}
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                                    style={{ backgroundImage: 'repeating-linear-gradient(105deg, transparent, transparent 3px, #A67C52 3px, #A67C52 4px)' }} />
                                <div className="relative z-10">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                        style={{ background: `${c.neon}15`, border: `1px solid ${c.neon}30` }}>
                                        <Icon className="w-5 h-5" style={{ color: c.neon }} />
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight" style={{ color: '#1A1A1A' }}>{val}</p>
                                    <p className="text-xs mt-1" style={{ color: '#9A8070' }}>{c.label}</p>
                                </div>
                                {/* Neon bottom border glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl"
                                    style={{ background: `linear-gradient(90deg, transparent, ${c.neon}, transparent)` }} />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Area chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.5 }}
                        className="lg:col-span-2 rounded-2xl p-5"
                        style={{ background: '#FFFFFF', border: '1.5px solid #E8DDD0' }}>
                        <p className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Platform Growth</p>
                        <p className="text-xs mb-4" style={{ color: '#9A8070' }}>Revenue & orders over 7 months</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={GROWTH_DATA}>
                                <defs>
                                    <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#A67C52" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9A8070' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: '#9A8070' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                                <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: '#9A8070' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#FDFCFA', border: '1px solid #E8DDD0', borderRadius: 12, fontSize: 12 }}
                                    formatter={(v: number, name: string) => [name === 'revenue' ? `रू ${v.toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Orders']} />
                                <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#A67C52" strokeWidth={2.5} fill="url(#revG)" dot={false} />
                                <Area yAxisId="ord" type="monotone" dataKey="orders"  stroke="#6366f1" strokeWidth={2}   fill="url(#ordG)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Donut chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.5 }}
                        className="rounded-2xl p-5 flex flex-col"
                        style={{ background: '#FFFFFF', border: '1.5px solid #E8DDD0' }}>
                        <p className="font-semibold text-sm mb-1" style={{ color: '#1A1A1A' }}>Order Status</p>
                        <p className="text-xs mb-2" style={{ color: '#9A8070' }}>Distribution breakdown</p>
                        <div className="relative flex-1">
                            <ResponsiveContainer width="100%" height={190}>
                                <PieChart>
                                    <Pie data={ORDER_STATUS_DATA} cx="50%" cy="45%" innerRadius={52} outerRadius={75} paddingAngle={3} dataKey="value" strokeWidth={0}>
                                        {ORDER_STATUS_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#FDFCFA', border: '1px solid #E8DDD0', borderRadius: 12, fontSize: 12 }} />
                                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: '#6B5B4E' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center label */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-10px' }}>
                                <div className="text-center">
                                    <p className="text-xl font-bold" style={{ color: '#1A1A1A' }}>
                                        {ORDER_STATUS_DATA.reduce((s, d) => s + d.value, 0)}
                                    </p>
                                    <p className="text-[10px]" style={{ color: '#9A8070' }}>Total</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {QUICK_LINKS.map((l, i) => (
                        <motion.div key={l.href} custom={i + 5} variants={fade} initial="hidden" animate="show">
                            <Link href={l.href}
                                className="block rounded-2xl p-4 group transition-all duration-300 hover:-translate-y-0.5"
                                style={{ background: '#FDFCFA', border: '1.5px solid #E8DDD0' }}
                                onMouseEnter={e => (e.currentTarget.style.borderColor = '#A67C52')}
                                onMouseLeave={e => (e.currentTarget.style.borderColor = '#E8DDD0')}>
                                <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{l.label}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>{l.desc}</p>
                                <ArrowRight className="w-3.5 h-3.5 mt-2 transition-all group-hover:translate-x-1" style={{ color: '#A67C52' }} />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent orders table */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#FFFFFF', border: '1.5px solid #E8DDD0' }}>
                    <div className="px-5 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid #F0EDE8' }}>
                        <div>
                            <h2 className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>Recent Orders</h2>
                            <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>Latest platform activity</p>
                        </div>
                        <Link href="/admin/orders" className="text-xs font-medium hover:underline" style={{ color: '#A67C52' }}>View all →</Link>
                    </div>
                    {recent_orders.length === 0 ? (
                        <div className="py-14 text-center text-sm" style={{ color: '#9A8070' }}>No orders yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                                    <tr>
                                        {['Order', 'Customer', 'Total', 'Status', 'Payment', 'Date'].map(h => (
                                            <th key={h} className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-left" style={{ color: '#7A6A5A' }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_orders.map((o, i) => (
                                        <tr key={o.id} style={{ borderBottom: i < recent_orders.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                                            <td className="px-5 py-3 font-medium" style={{ color: '#1A1A1A' }}>#{o.id}</td>
                                            <td className="px-5 py-3" style={{ color: '#6B5B4E' }}>{o.user.name}</td>
                                            <td className="px-5 py-3 font-semibold" style={{ color: '#A67C52' }}>रू {Number(o.total).toLocaleString()}</td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                                                    style={{ background: `${STATUS_COLOR[o.status] ?? '#9A8070'}18`, color: STATUS_COLOR[o.status] ?? '#9A8070' }}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                                                    style={{ background: `${PAY_COLOR[o.payment_status] ?? '#9A8070'}18`, color: PAY_COLOR[o.payment_status] ?? '#9A8070' }}>
                                                    {o.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-xs" style={{ color: '#9A8070' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

            </div>
        </SellerLayout>
    );
}
