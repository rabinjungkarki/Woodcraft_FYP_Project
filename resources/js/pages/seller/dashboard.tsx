import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, ShoppingCart, DollarSign, Plus, ArrowRight, TrendingUp } from 'lucide-react';

interface Stats { total_products: number; active_products: number; total_orders: number; total_revenue: number; }
interface Product { id: number; name: string; price: number; stock: number; is_active: boolean; category: { name: string }; }

export default function SellerDashboard({ stats, recent_products }: { stats: Stats; recent_products: Product[] }) {
    const { auth } = usePage<{ auth: { user: { name: string; shop_name: string } } }>().props;

    const statCards = [
        { label: 'Total Products', value: stats.total_products,   icon: Package,      color: 'text-blue-600 bg-blue-50' },
        { label: 'Active Listings', value: stats.active_products, icon: TrendingUp,   color: 'text-green-600 bg-green-50' },
        { label: 'Total Orders',   value: stats.total_orders,     icon: ShoppingCart, color: 'text-purple-600 bg-purple-50' },
        { label: 'Revenue (NPR)',  value: `Rs. ${Number(stats.total_revenue).toLocaleString()}`, icon: DollarSign, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <>
            <Head title="Seller Dashboard — WoodCraft" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg">WoodCraft</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-muted-foreground">Seller Panel</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Link href="/shop" className="text-muted-foreground hover:text-primary transition-colors">View Shop</Link>
                        <Link href="/settings/profile" className="font-medium hover:text-primary transition-colors">{auth.user.name}</Link>
                    </div>
                </header>

                <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold">{auth.user.shop_name}</h1>
                        <p className="text-muted-foreground text-sm mt-1">Welcome back, {auth.user.name}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statCards.map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-white rounded-xl border p-5">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-xl font-bold">{s.value}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Link href="/seller/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                            <Plus className="w-4 h-4" /> Add Product
                        </Link>
                        <Link href="/seller/products" className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-accent transition">
                            Manage Products <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Recent products */}
                    <div className="bg-white rounded-xl border">
                        <div className="px-5 py-4 border-b flex justify-between items-center">
                            <h2 className="font-semibold">Your Products</h2>
                            <Link href="/seller/products" className="text-sm text-primary hover:underline">View all</Link>
                        </div>
                        {recent_products.length === 0 ? (
                            <div className="py-16 text-center space-y-3">
                                <Package className="w-12 h-12 mx-auto text-muted-foreground/30" />
                                <p className="text-muted-foreground text-sm">No products yet.</p>
                                <Link href="/seller/products" className="text-sm text-primary hover:underline">Add your first product</Link>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {recent_products.map(p => (
                                    <div key={p.id} className="flex items-center justify-between px-5 py-3">
                                        <div>
                                            <p className="font-medium text-sm">{p.name}</p>
                                            <p className="text-xs text-muted-foreground">{p.category.name} · Stock: {p.stock}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-sm text-primary">Rs. {Number(p.price).toLocaleString()}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
