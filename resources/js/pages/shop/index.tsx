import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { SlidersHorizontal, Search, X, Star } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Category { id: number; name: string; slug: string; }
interface Product { id: number; name: string; slug: string; price: number; stock: number; images: string[] | null; category: Category; }
interface Paginated<T> { data: T[]; links: { url: string | null; label: string; active: boolean }[]; }

function ProductCard({ product }: { product: Product }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <Link href={`/shop/${product.slug}`} className="wood-card group overflow-hidden block">
            <div className="aspect-square bg-accent overflow-hidden relative">
                {!loaded && <div className="skeleton-wood absolute inset-0" />}
                {product.images?.[0]
                    ? <img src={imgSrc(product.images) ?? ''} alt={product.name} onLoad={() => setLoaded(true)} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loaded ? '' : 'opacity-0'}`} />
                    : <div className="w-full h-full flex items-center justify-center bg-muted"><svg className="w-12 h-12 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                }
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                        <span className="bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category.name}</p>
                <p className="font-semibold mt-1 truncate">{product.name}</p>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-primary font-bold">Rs. {Number(product.price).toLocaleString()}</p>
                    <span className="text-xs text-muted-foreground">{product.stock > 0 ? `${product.stock} left` : ''}</span>
                </div>
            </div>
        </Link>
    );
}

export default function ShopIndex({ products, categories, filters }: {
    products: Paginated<Product>; categories: Category[]; filters: Record<string, string>;
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function apply(params: Record<string, string>) {
        router.get('/shop', { ...filters, ...params, page: '1' }, { preserveState: true, replace: true });
    }

    const SORT_OPTIONS = [
        { value: '', label: 'Latest' },
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
    ];

    const FilterPanel = () => (
        <div className="space-y-6">
            <div>
                <p className="font-semibold text-sm mb-3">Categories</p>
                <ul className="space-y-1.5">
                    <li>
                        <button onClick={() => apply({ category: '' })} className={`text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${!filters.category ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent'}`}>
                            All Products
                        </button>
                    </li>
                    {categories.map(c => (
                        <li key={c.id}>
                            <button onClick={() => apply({ category: c.slug })} className={`text-sm w-full text-left px-3 py-1.5 rounded-lg transition-colors ${filters.category === c.slug ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-accent'}`}>
                                {c.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p className="font-semibold text-sm mb-3">Price Range</p>
                <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Min" className="w-full bg-muted border-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        defaultValue={filters.min_price} onBlur={e => apply({ min_price: e.target.value })} />
                    <span className="text-muted-foreground text-sm">–</span>
                    <input type="number" placeholder="Max" className="w-full bg-muted border-0 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                        defaultValue={filters.max_price} onBlur={e => apply({ max_price: e.target.value })} />
                </div>
            </div>
            {(filters.category || filters.min_price || filters.max_price || filters.search) && (
                <button onClick={() => { setSearch(''); router.get('/shop', {}, { replace: true }); }}
                    className="flex items-center gap-2 text-sm text-destructive hover:underline">
                    <X className="w-3.5 h-3.5" /> Clear filters
                </button>
            )}
        </div>
    );

    return (
        <ShopLayout>
            <Head title="Shop — WoodCraft" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Top bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">All Products</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{products.data.length} items shown</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {/* Search */}
                        <form onSubmit={e => { e.preventDefault(); apply({ search }); }} className="flex flex-1 sm:w-64">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input className="w-full bg-muted border-0 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </form>
                        {/* Sort */}
                        <select className="bg-muted border-0 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                            value={filters.sort ?? ''} onChange={e => apply({ sort: e.target.value })}>
                            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {/* Mobile filter toggle */}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2.5 bg-muted rounded-xl">
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-6">
                    {/* Desktop sidebar */}
                    <aside className="hidden md:block w-52 shrink-0">
                        <div className="wood-card p-5 sticky top-20">
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Mobile sidebar */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                            <div className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="font-bold">Filters</p>
                                    <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                                </div>
                                <FilterPanel />
                            </div>
                        </div>
                    )}

                    {/* Products grid */}
                    <div className="flex-1">
                        {products.data.length === 0 ? (
                            <div className="wood-card py-20 text-center">
                                <p className="text-5xl mb-4">🔍</p>
                                <p className="font-semibold text-lg">No products found</p>
                                <p className="text-muted-foreground text-sm mt-1">Try adjusting your filters</p>
                                <button onClick={() => router.get('/shop', {})} className="btn-wood mt-4 inline-block">Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products.data.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>
                                {/* Pagination */}
                                <div className="flex gap-1.5 mt-8 justify-center flex-wrap">
                                    {products.links.map((l, i) => (
                                        <button key={i} disabled={!l.url}
                                            onClick={() => l.url && router.get(l.url)}
                                            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${l.active ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'} disabled:opacity-40`}
                                            dangerouslySetInnerHTML={{ __html: l.label }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
