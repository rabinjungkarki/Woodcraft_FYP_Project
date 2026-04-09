import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ShoppingCart, Users, DollarSign, Clock, ArrowRight, TrendingUp, BarChart3 } from 'lucide-react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import SellerLayout from '@/layouts/seller-layout';

interface Stats { total_products: number; total_orders: number; total_users: number; total_revenue: number; pending_orders: number; }
interface Order { id: number; total: number; status: string; payment_status: string; created_at: string; user: { name: string }; }

const STATUS_CLS: Record<string, string> = {
    pending:    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    shipped:    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    delivered:  'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    cancelled:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};
const PAY_CLS: Record<string, string> = {
    paid:    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    failed:  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const QUICK_LINKS = [
    { href: '/admin/products',   label: 'Products',   desc: 'Manage all listings' },
    { href: '/admin/categories', label: 'Categories', desc: 'Organise the catalogue' },
    { href: '/admin/orders',     label: 'Orders',     desc: 'View & update orders' },
    { href: '/admin/users',      label: 'Customers',  desc: 'Browse all users' },
    { href: '/admin/reviews',    label: 'Reviews',    desc: 'Moderate feedback' },
];

const GROWTH_DATA = [
    { month: 'Sep', revenue: 45000, orders: 18, users: 12 },
    { month: 'Oct', revenue: 62000, orders: 25, users: 19 },
    { month: 'Nov', revenue: 58000, orders: 22, users: 15 },
    { month: 'Dec', revenue: 89000, orders: 38, users: 31 },
    { month: 'Jan', revenue: 74000, orders: 30, users: 24 },
    { month: 'Feb', revenue: 95000, orders: 42, users: 36 },
    { month: 'Mar', revenue: 112000, orders: 51, users: 44 },
];

const ORDER_STATUS_DATA = [
    { name: 'Delivered', value: 58, color: '#10b981' },
    { name: 'Processing', value: 22, color: '#6366f1' },
    { name: 'Pending', value: 14, color: '#f59e0b' },
    { name: 'Cancelled', value: 6, color: '#ef4444' },
];

const fade = { hidden: { opacity: 0, y: 20 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }) };

export default function AdminDashboard({ stats, recent_orders }: { stats: Stats; recent_orders: Order[] }) {
    const cards = [
        { label: 'Total Products',  value: stats.total_products,  icon: Package,      gradient: 'from-blue-500 to-blue-600' },
        { label: 'Total Orders',    value: stats.total_orders,    icon: ShoppingCart, gradient: 'from-violet-500 to-violet-600' },
        { label: 'Customers',       value: stats.total_users,     icon: Users,        gradient: 'from-emerald-500 to-emerald-600' },
        { label: 'Revenue (NPR)',   value: `रू ${Number(stats.total_revenue).toLocaleString()}`, icon: DollarSign, gradient: 'from-amber-500 to-orange-500' },
        { label: 'Pending Orders',  value: stats.pending_orders,  icon: Clock,        gradient: 'from-rose-500 to-red-600' },
    ];

    return (
        <SellerLayout title="Dashboard">
            <Head title="Admin Dashboard — Wood Kala" />
            <div className="space-y-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Platform Overview</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Wood Kala Admin Dashboard</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground glass-card px-3 py-2 rounded-lg">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        Live data
                    </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    {cards.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <motion.div key={c.label} custom={i} variants={fade} initial="hidden" animate="show"
                                className="stat-card p-5 group hover:-translate-y-1 transition-transform duration-300">
                                <div className={`w-10 h-10 bg-gradient-to-br ${c.gradient} rounded-xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold">{c.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Charts row */}
                <div className="grid lg:grid-cols-3 gap-5">
                    {/* Revenue + Orders area chart */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38, duration: 0.5 }}
                        className="lg:col-span-2 glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-sm">Platform Growth (7 months)</p>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={GROWTH_DATA}>
                                <defs>
                                    <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="rev" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                                <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                                    formatter={(v: number, name: string) => [name === 'revenue' ? `रू ${v.toLocaleString()}` : v, name === 'revenue' ? 'Revenue' : 'Orders']} />
                                <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#A67C52" strokeWidth={2.5} fill="url(#revG)" dot={false} />
                                <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} fill="url(#ordG)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Order status pie */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.5 }}
                        className="glass-card rounded-2xl p-5">
                        <p className="font-semibold text-sm mb-4">Order Status</p>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={ORDER_STATUS_DATA} cx="50%" cy="45%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                                    {ORDER_STATUS_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* New users bar chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.5 }}
                    className="glass-card rounded-2xl p-5">
                    <p className="font-semibold text-sm mb-4">New Customers per Month</p>
                    <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={GROWTH_DATA} barSize={32}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                            <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Quick links */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {QUICK_LINKS.map((l, i) => (
                        <motion.div key={l.href} custom={i + 5} variants={fade} initial="hidden" animate="show">
                            <Link href={l.href}
                                className="glass-card rounded-2xl p-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group block">
                                <p className="font-semibold text-sm">{l.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{l.desc}</p>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 mt-2 transition-all" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent orders */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                    className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                        <h2 className="font-semibold">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-primary hover:underline">View all →</Link>
                    </div>
                    {recent_orders.length === 0 ? (
                        <div className="py-14 text-center text-muted-foreground text-sm">No orders yet.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/20">
                                        <th className="px-5 py-3">Order</th>
                                        <th className="px-5 py-3">Customer</th>
                                        <th className="px-5 py-3">Total</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Payment</th>
                                        <th className="px-5 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recent_orders.map(o => (
                                        <tr key={o.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                                            <td className="px-5 py-3 font-medium">#{o.id}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{o.user.name}</td>
                                            <td className="px-5 py-3 font-semibold text-primary">रू {Number(o.total).toLocaleString()}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_CLS[o.status] ?? 'bg-muted text-muted-foreground'}`}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${PAY_CLS[o.payment_status] ?? 'bg-muted text-muted-foreground'}`}>
                                                    {o.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
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
