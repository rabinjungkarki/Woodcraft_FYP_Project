import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingBag, Shield, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Category { id: number; name: string; slug: string; products_count: number; }
interface Product { id: number; name: string; slug: string; price: number; images: string[] | null; category: { name: string }; }

const CATEGORY_ICONS: Record<string, string> = {
    chairs: '🪑', tables: '🪞', beds: '🛏️', sofas: '🛋️', decor: '🏺', default: '🪵',
};

const TESTIMONIALS = [
    { name: 'Sita Sharma', location: 'Kathmandu', rating: 5, text: 'Absolutely love my new dining table. The craftsmanship is exceptional and delivery was on time!' },
    { name: 'Ramesh Thapa', location: 'Pokhara', rating: 5, text: 'WoodCraft has the best quality furniture I\'ve found in Nepal. Will definitely order again.' },
    { name: 'Priya Gurung', location: 'Lalitpur', rating: 4, text: 'Great selection and easy checkout. The teak wood chair is even better in person.' },
];

function ProductCard({ product }: { product: Product }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <Link href={`/shop/${product.slug}`} className="wood-card group overflow-hidden block">
            <div className="aspect-square bg-accent overflow-hidden relative">
                {!imgLoaded && <div className="skeleton-wood absolute inset-0" />}
                {product.images?.[0]
                    ? <img src={imgSrc(product.images) ?? ''} alt={product.name} onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`} />
                    : <div className="w-full h-full flex items-center justify-center text-6xl">🪑</div>
                }
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="p-4">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.category.name}</p>
                <p className="font-semibold mt-1 truncate">{product.name}</p>
                <p className="text-primary font-bold mt-1">Rs. {Number(product.price).toLocaleString()}</p>
            </div>
        </Link>
    );
}

export default function Welcome({ canRegister = true, featured = [], categories = [], total_products = 0 }: {
    canRegister?: boolean; featured: Product[]; categories: Category[]; total_products: number;
}) {
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const [email, setEmail] = useState('');

    // Auto-rotate testimonials
    useEffect(() => {
        const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
        return () => clearInterval(t);
    }, []);

    return (
        <ShopLayout>
            <Head title="WoodCraft — Premium Handcrafted Furniture Nepal" />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80 text-primary-foreground">
                {/* Decorative circles */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />

                <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-700">
                        <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                            🏆 Nepal's #1 Furniture Marketplace
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                            Handcrafted<br />
                            <span className="text-white/80">Furniture</span><br />
                            for Your Home
                        </h1>
                        <p className="text-primary-foreground/80 text-lg max-w-md">
                            Discover premium woodcraft furniture made by skilled Nepali artisans. Timeless quality, delivered to your door.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/shop" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-all active:scale-95">
                                Shop Now <ArrowRight className="w-4 h-4" />
                            </Link>
                            {canRegister && (
                                <Link href="/register" className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
                                    Get Started
                                </Link>
                            )}
                        </div>
                        {/* Stats */}
                        <div className="flex gap-8 pt-2">
                            {[
                                { value: `${total_products}+`, label: 'Products' },
                                { value: `${categories.length}`, label: 'Categories' },
                                { value: '100%', label: 'Handcrafted' },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-2xl font-bold">{s.value}</p>
                                    <p className="text-sm text-primary-foreground/70">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex justify-center animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="relative w-80 h-80">
                            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
                            <span className="relative text-[200px] flex items-center justify-center h-full select-none drop-shadow-2xl">🪑</span>
                        </div>
                    </div>
                </div>
                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-background" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
            </section>

            {/* ── Categories ── */}
            {categories.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Browse</p>
                            <h2 className="text-3xl font-bold">Shop by Category</h2>
                        </div>
                        <Link href="/shop" className="text-sm text-primary font-medium hover:underline hidden md:block">View all →</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {categories.map(cat => (
                            <Link key={cat.id} href={`/shop?category=${cat.slug}`}
                                className="wood-card p-5 text-center group cursor-pointer hover:-translate-y-1">
                                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {CATEGORY_ICONS[cat.slug] ?? CATEGORY_ICONS.default}
                                </div>
                                <p className="font-semibold text-sm">{cat.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{cat.products_count} items</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ── Featured Products ── */}
            {featured.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-6 pb-16">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Handpicked</p>
                            <h2 className="text-3xl font-bold">Featured Products</h2>
                        </div>
                        <Link href="/shop" className="text-sm text-primary font-medium hover:underline hidden md:block">View all →</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                        {featured.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    <div className="text-center mt-8">
                        <Link href="/shop" className="btn-wood-outline inline-flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> Browse All Products
                        </Link>
                    </div>
                </section>
            )}

            {/* ── Why WoodCraft ── */}
            <section className="bg-card border-y border-border py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-10">
                        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Why Us</p>
                        <h2 className="text-3xl font-bold">The WoodCraft Difference</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <Shield className="w-6 h-6" />, title: 'Premium Quality', desc: 'Every piece is handcrafted by skilled Nepali artisans using sustainably sourced wood.' },
                            { icon: <span className="text-2xl">💳</span>, title: 'Secure Payments', desc: 'Pay safely with Khalti, eSewa, or Cash on Delivery — your choice, your comfort.' },
                            { icon: <Truck className="w-6 h-6" />, title: 'Nationwide Delivery', desc: 'We deliver across Nepal with care, ensuring your furniture arrives in perfect condition.' },
                        ].map(f => (
                            <div key={f.title} className="wood-card p-6 flex gap-4">
                                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">{f.icon}</div>
                                <div>
                                    <h3 className="font-bold mb-1">{f.title}</h3>
                                    <p className="text-sm text-muted-foreground">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-10">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">Reviews</p>
                    <h2 className="text-3xl font-bold">What Our Customers Say</h2>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    <div className="wood-card p-8 text-center min-h-[180px] flex flex-col items-center justify-center transition-all duration-500">
                        <div className="flex gap-1 mb-4 justify-center">
                            {Array.from({ length: TESTIMONIALS[testimonialIdx].rating }).map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                            ))}
                        </div>
                        <p className="text-lg italic text-muted-foreground mb-4">"{TESTIMONIALS[testimonialIdx].text}"</p>
                        <p className="font-semibold">{TESTIMONIALS[testimonialIdx].name}</p>
                        <p className="text-sm text-muted-foreground">{TESTIMONIALS[testimonialIdx].location}</p>
                    </div>
                    <div className="flex justify-center gap-3 mt-4">
                        <button onClick={() => setTestimonialIdx(i => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="p-2 rounded-xl border hover:bg-accent transition-colors"><ChevronLeft className="w-4 h-4" /></button>
                        {TESTIMONIALS.map((_, i) => (
                            <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testimonialIdx ? 'bg-primary w-6' : 'bg-border'}`} />
                        ))}
                        <button onClick={() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length)} className="p-2 rounded-xl border hover:bg-accent transition-colors"><ChevronRight className="w-4 h-4" /></button>
                    </div>
                </div>
            </section>

            {/* ── Newsletter ── */}
            <section className="bg-primary text-primary-foreground py-16 px-6">
                <div className="max-w-xl mx-auto text-center space-y-4">
                    <h2 className="text-2xl font-bold">Stay in the Loop</h2>
                    <p className="text-primary-foreground/80">Get notified about new arrivals, exclusive deals, and woodcraft tips.</p>
                    <form onSubmit={e => { e.preventDefault(); setEmail(''); alert('Subscribed! Thank you.'); }} className="flex gap-2 max-w-sm mx-auto">
                        <input type="email" required placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}
                            className="flex-1 bg-white/15 border border-white/30 text-white placeholder:text-white/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:bg-white/20 transition" />
                        <button type="submit" className="bg-white text-primary font-semibold px-5 py-2.5 rounded-xl hover:bg-white/90 transition text-sm">Subscribe</button>
                    </form>
                </div>
            </section>
        </ShopLayout>
    );
}
