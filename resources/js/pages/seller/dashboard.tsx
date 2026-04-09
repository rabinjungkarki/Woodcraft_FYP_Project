import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Package, ShoppingCart, TrendingUp, DollarSign, Plus, ArrowRight, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import SellerLayout from '@/layouts/seller-layout';

interface Stats { total_products: number; active_products: number; total_orders: number; total_revenue: number; }
interface Product { id: number; name: string; price: number; stock: number; is_active: boolean; category: { name: string }; }

const MOCK_REVENUE = [
    { month: 'Oct', revenue: 12000 }, { month: 'Nov', revenue: 19500 }, { month: 'Dec', revenue: 28000 },
    { month: 'Jan', revenue: 22000 }, { month: 'Feb', revenue: 31000 }, { month: 'Mar', revenue: 26500 },
];
const MOCK_ORDERS = [
    { day: 'Mon', orders: 3 }, { day: 'Tue', orders: 7 }, { day: 'Wed', orders: 5 },
    { day: 'Thu', orders: 9 }, { day: 'Fri', orders: 12 }, { day: 'Sat', orders: 8 }, { day: 'Sun', orders: 4 },
];

const fade = { hidden: { opacity: 0, y: 20 }, show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] } }) };

export default function SellerDashboard({ stats, recent_products }: { stats: Stats; recent_products: Product[] }) {
    const { auth } = usePage<{ auth: { user: { name: string; shop_name: string } } }>().props;

    const cards = [
        { label: 'Total Products',  value: stats.total_products,  icon: Package,      gradient: 'from-blue-500 to-blue-600' },
        { label: 'Active Listings', value: stats.active_products, icon: TrendingUp,   gradient: 'from-emerald-500 to-emerald-600' },
        { label: 'Total Orders',    value: stats.total_orders,    icon: ShoppingCart, gradient: 'from-violet-500 to-violet-600' },
        { label: 'Revenue',         value: `रू ${Number(stats.total_revenue).toLocaleString()}`, icon: DollarSign, gradient: 'from-amber-500 to-orange-500' },
    ];

    return (
        <SellerLayout title="Dashboard">
            <Head title="Dashboard — Seller Panel" />
            <div className="space-y-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                    className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{auth.user.shop_name}</h1>
                        <p className="text-muted-foreground text-sm mt-0.5">Welcome back, {auth.user.name}</p>
                    </div>
                    <Link href="/seller/products"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                        <Plus className="w-4 h-4" /> Add Product
                    </Link>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-5">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}
                        className="glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-sm">Revenue (6 months)</p>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={MOCK_REVENUE}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#A67C52" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#A67C52" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={v => `रू${(v/1000).toFixed(0)}k`} />
                                <Tooltip formatter={(v: number) => [`रू ${v.toLocaleString()}`, 'Revenue']}
                                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                                <Area type="monotone" dataKey="revenue" stroke="#A67C52" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#A67C52', r: 3 }} activeDot={{ r: 5 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.5 }}
                        className="glass-card rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingCart className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-sm">Orders This Week</p>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={MOCK_ORDERS} barSize={28}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                                <Bar dataKey="orders" fill="#A67C52" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { href: '/seller/products', label: 'Manage Products', desc: 'Add, edit or remove listings' },
                        { href: '/seller/orders',   label: 'View Orders',     desc: 'Track and update order status' },
                    ].map((a, i) => (
                        <motion.div key={a.href} custom={i + 4} variants={fade} initial="hidden" animate="show">
                            <Link href={a.href}
                                className="glass-card rounded-2xl p-5 flex items-center justify-between hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group block">
                                <div>
                                    <p className="font-semibold">{a.label}</p>
                                    <p className="text-sm text-muted-foreground mt-0.5">{a.desc}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent products table */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="glass-card rounded-2xl overflow-hidden">
                    <div className="px-5 py-4 border-b border-border flex justify-between items-center">
                        <h2 className="font-semibold">Recent Products</h2>
                        <Link href="/seller/products" className="text-sm text-primary hover:underline">View all →</Link>
                    </div>
                    {recent_products.length === 0 ? (
                        <div className="py-14 text-center">
                            <p className="text-muted-foreground text-sm">No products yet.</p>
                            <Link href="/seller/products" className="text-sm text-primary hover:underline mt-1 inline-block">Add your first product →</Link>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide border-b border-border bg-muted/30">
                                    <th className="px-5 py-3">Product</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3">Price</th>
                                    <th className="px-5 py-3">Stock</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_products.map(p => (
                                    <tr key={p.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                                        <td className="px-5 py-3 font-medium">{p.name}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{p.category.name}</td>
                                        <td className="px-5 py-3 font-semibold text-primary">रू {Number(p.price).toLocaleString()}</td>
                                        <td className="px-5 py-3 text-muted-foreground">{p.stock}</td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </motion.div>
            </div>
        </SellerLayout>
    );
}
