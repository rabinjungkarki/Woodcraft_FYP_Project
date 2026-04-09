import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Store, Minus, Plus, Heart } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Review { id: number; rating: number; comment: string | null; user: { name: string }; created_at: string; }
interface Product {
    id: number; name: string; slug: string; price: number; stock: number;
    seller_id: number | null;
    description: string | null; material: string | null; dimensions: string | null;
    images: string[] | null; category: { name: string };
    seller: { name: string; shop_name: string | null; shop_description: string | null } | null;
    reviews: Review[];
}

function Stars({ value, onChange, size = 'sm' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'lg' }) {
    const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
                    <Star className={`${cls} ${s <= value ? 'fill-primary text-primary' : 'text-border'} transition-colors`} />
                </button>
            ))}
        </div>
    );
}

export default function ShopShow({ product, avg_rating, user_review, related = [], wishlisted = false }: {
    product: Product; avg_rating: number; user_review: Review | null;
    related?: { id: number; name: string; slug: string; price: number; images: string[] | null; category: { name: string } }[];
    wishlisted?: boolean;
}) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const isOwnProduct = auth.user?.id === product.seller_id;
    const [imgIdx, setImgIdx] = useState(0);
    const images = product.images ?? [];

    const cartForm = useForm({ product_id: product.id, quantity: 1 });
    const reviewForm = useForm({ product_id: product.id, rating: user_review?.rating ?? 5, comment: user_review?.comment ?? '' });
    const wishlistForm = useForm({});
    const buyNowForm = useForm({ product_id: product.id, quantity: 1 });

    return (
        <ShopLayout>
            <Head title={`${product.name} — Wood Kala`} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category.name.toLowerCase()}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Images */}
                    <div className="space-y-3">
                        <div className="aspect-square bg-muted rounded-2xl overflow-hidden relative group">
                            <AnimatePresence mode="wait">
                                <motion.div key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                                    className="w-full h-full">
                                    {images.length > 0
                                        ? <img src={imgSrc(images, imgIdx) ?? ''} alt={product.name} className="w-full h-full object-cover" />
                                        : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop&q=70" alt={product.name} className="w-full h-full object-cover opacity-40" />
                                    }
                                </motion.div>
                            </AnimatePresence>
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setImgIdx(i)}
                                        className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${i === imgIdx ? 'border-primary' : 'border-transparent'}`}>
                                        <img src={imgSrc([img]) ?? ''} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-medium text-primary uppercase tracking-widest">{product.category.name}</p>
                            <h1 className="text-2xl font-bold mt-1">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <Stars value={Math.round(avg_rating)} />
                                <span className="text-sm text-muted-foreground">{product.reviews.length} reviews</span>
                            </div>
                        </div>

                        <p className="text-3xl font-bold text-primary">रू {Number(product.price).toLocaleString()}</p>

                        {product.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                        )}

                        {/* Specs */}
                        {(product.material || product.dimensions) && (
                            <div className="grid grid-cols-2 gap-2">
                                {product.material && (
                                    <div className="bg-muted rounded-xl p-3">
                                        <p className="text-xs text-muted-foreground">Material</p>
                                        <p className="font-semibold text-sm mt-0.5">{product.material}</p>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="bg-muted rounded-xl p-3">
                                        <p className="text-xs text-muted-foreground">Dimensions</p>
                                        <p className="font-semibold text-sm mt-0.5">{product.dimensions}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── Product Storytelling ── */}
                        <div className="border border-border rounded-2xl overflow-hidden">
                            <div className="bg-muted/50 px-5 py-3 border-b border-border">
                                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Craftsmanship Details</p>
                            </div>
                            <div className="divide-y divide-border">
                                <div className="flex items-start gap-4 px-5 py-4">
                                    <span className="text-lg mt-0.5">🌳</span>
                                    <div>
                                        <p className="font-semibold text-sm">Material Origin</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            {product.material
                                                ? `Sourced from local ${product.material} — sustainably harvested from Nepal's forests.`
                                                : 'Sustainably sourced from local Nepali forests, ensuring quality and environmental responsibility.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 px-5 py-4">
                                    <span className="text-lg mt-0.5">⏱️</span>
                                    <div>
                                        <p className="font-semibold text-sm">Estimated Crafting Time</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            14–21 days to perfection — each piece is hand-finished by our master artisans.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 px-5 py-4">
                                    <span className="text-lg mt-0.5">🤝</span>
                                    <div>
                                        <p className="font-semibold text-sm">Custom Order Available</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                            Need a different size or finish?{' '}
                                            <a href="https://wa.me/977980000000?text=I'm interested in a custom order for this product."
                                                target="_blank" rel="noopener noreferrer"
                                                className="text-primary hover:underline font-medium">
                                                WhatsApp us for a custom inquiry →
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                            {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
                        </div>

                        {/* Add to Cart */}
                        {isOwnProduct ? (
                            <div className="bg-muted border border-border rounded-xl p-4 text-sm text-muted-foreground text-center">
                                🪵 This is your product — you can't buy, cart, or wishlist your own listing.
                            </div>
                        ) : product.stock > 0 && auth.user ? (
                            <div className="space-y-2">
                                <form onSubmit={e => { e.preventDefault(); cartForm.post('/cart'); }} className="flex gap-3">
                                    <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                        <button type="button" onClick={() => { cartForm.setData('quantity', Math.max(1, cartForm.data.quantity - 1)); buyNowForm.setData('quantity', Math.max(1, cartForm.data.quantity - 1)); }} className="px-3 py-2.5 hover:bg-accent transition-colors">
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-4 font-semibold text-sm min-w-[2.5rem] text-center">{cartForm.data.quantity}</span>
                                        <button type="button" onClick={() => { cartForm.setData('quantity', Math.min(product.stock, cartForm.data.quantity + 1)); buyNowForm.setData('quantity', Math.min(product.stock, cartForm.data.quantity + 1)); }} className="px-3 py-2.5 hover:bg-accent transition-colors">
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <button type="submit" disabled={cartForm.processing} className="flex-1 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60">
                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                    </button>
                                    <button type="button"
                                        onClick={() => wishlistForm.post(`/wishlist/${product.id}`, { preserveScroll: true })}
                                        className={`p-3 rounded-xl border transition-colors ${wishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-border hover:border-rose-300 hover:text-rose-500'}`}>
                                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    </button>
                                </form>
                                <button type="button"
                                    disabled={buyNowForm.processing}
                                    onClick={() => buyNowForm.post('/cart', { onSuccess: () => window.location.href = '/checkout' })}
                                    className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border-2 disabled:opacity-60"
                                    style={{ borderColor: '#A67C52', color: '#A67C52', background: 'transparent' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#A67C52'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#A67C52'; }}>
                                    {buyNowForm.processing ? 'Processing...' : '⚡ Buy Now'}
                                </button>
                            </div>
                        ) : !auth.user ? (
                            <Link href="/login" className="w-full bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 py-3 hover:opacity-90 transition">
                                <ShoppingCart className="w-4 h-4" /> Login to Purchase
                            </Link>
                        ) : (
                            <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm font-medium text-center">Out of Stock</div>
                        )}

                        {/* Seller */}
                        {product.seller && (
                            <div className="flex items-center gap-3 bg-muted rounded-xl p-3">
                                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Store className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{product.seller.shop_name ?? product.seller.name}</p>
                                    {product.seller.shop_description && <p className="text-xs text-muted-foreground">{product.seller.shop_description}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-12 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Reviews</h2>
                        <div className="flex items-center gap-2">
                            <Stars value={Math.round(avg_rating)} />
                            <span className="font-bold text-sm">{avg_rating || '—'}</span>
                            <span className="text-muted-foreground text-sm">({product.reviews.length})</span>
                        </div>
                    </div>

                    {auth.user && !isOwnProduct && (
                        <form onSubmit={e => { e.preventDefault(); reviewForm.post('/reviews'); }} className="bg-card border border-border rounded-2xl p-5 space-y-3">
                            <h3 className="font-semibold text-sm">{user_review ? 'Update Your Review' : 'Write a Review'}</h3>
                            <Stars value={reviewForm.data.rating} onChange={v => reviewForm.setData('rating', v)} size="lg" />
                            <textarea className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" rows={3}
                                placeholder="Share your experience..."
                                value={reviewForm.data.comment} onChange={e => reviewForm.setData('comment', e.target.value)} />
                            <button type="submit" disabled={reviewForm.processing} className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
                                {user_review ? 'Update' : 'Submit'}
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {product.reviews.map(r => (
                            <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs">
                                            {r.user.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{r.user.name}</p>
                                            <Stars value={r.rating} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                                </div>
                                {r.comment && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>}
                            </div>
                        ))}
                        {product.reviews.length === 0 && (
                            <div className="py-10 text-center text-muted-foreground border border-border rounded-2xl">
                                <p className="text-2xl mb-2">💬</p>
                                <p className="text-sm">No reviews yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <div className="mt-12 space-y-5">
                        <h2 className="text-xl font-bold">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {related.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                                    <Link href={`/shop/${p.slug}`}
                                        className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="aspect-square bg-muted overflow-hidden">
                                            {p.images?.[0]
                                                ? <img src={imgSrc(p.images) ?? ''} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=300&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-40" />
                                            }
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs text-muted-foreground">{p.category.name}</p>
                                            <p className="font-semibold text-sm truncate mt-0.5">{p.name}</p>
                                            <p className="text-primary font-bold text-sm mt-1">रू {Number(p.price).toLocaleString()}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
