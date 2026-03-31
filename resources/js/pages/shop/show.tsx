import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Star, ShoppingCart, ChevronLeft, ChevronRight, Store, Minus, Plus } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Review { id: number; rating: number; comment: string | null; user: { name: string }; created_at: string; }
interface Product {
    id: number; name: string; slug: string; price: number; stock: number;
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

export default function ShopShow({ product, avg_rating, user_review }: { product: Product; avg_rating: number; user_review: Review | null }) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const [imgIdx, setImgIdx] = useState(0);
    const images = product.images ?? [];

    const cartForm = useForm({ product_id: product.id, quantity: 1 });
    const reviewForm = useForm({ product_id: product.id, rating: user_review?.rating ?? 5, comment: user_review?.comment ?? '' });

    return (
        <ShopLayout>
            <Head title={`${product.name} — WoodCraft`} />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category.name.toLowerCase()}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
                    <span>/</span>
                    <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Image Gallery */}
                    <div className="space-y-3">
                        <div className="aspect-square bg-accent rounded-2xl overflow-hidden relative group">
                            {images.length > 0
                                ? <img src={imgSrc(images, imgIdx) ?? ''} alt={product.name} className="w-full h-full object-cover transition-all duration-500" />
                                : <div className="w-full h-full flex items-center justify-center bg-muted"><svg className="w-24 h-24 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                            }
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
                                        className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${i === imgIdx ? 'border-primary' : 'border-transparent'}`}>
                                        <img src={imgSrc([img]) ?? ''} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-5">
                        <div>
                            <p className="text-sm font-medium text-primary uppercase tracking-widest">{product.category.name}</p>
                            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Stars value={Math.round(avg_rating)} />
                                <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
                            </div>
                        </div>

                        <p className="text-4xl font-bold text-primary">Rs. {Number(product.price).toLocaleString()}</p>

                        {product.description && (
                            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                        )}

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-3">
                            {product.material && (
                                <div className="bg-accent rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground">Material</p>
                                    <p className="font-semibold text-sm mt-0.5">{product.material}</p>
                                </div>
                            )}
                            {product.dimensions && (
                                <div className="bg-accent rounded-xl p-3">
                                    <p className="text-xs text-muted-foreground">Dimensions</p>
                                    <p className="font-semibold text-sm mt-0.5">{product.dimensions}</p>
                                </div>
                            )}
                            <div className="bg-accent rounded-xl p-3">
                                <p className="text-xs text-muted-foreground">Availability</p>
                                <p className={`font-semibold text-sm mt-0.5 ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </p>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        {product.stock > 0 && auth.user ? (
                            <form onSubmit={e => { e.preventDefault(); cartForm.post('/cart'); }} className="flex gap-3">
                                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                    <button type="button" onClick={() => cartForm.setData('quantity', Math.max(1, cartForm.data.quantity - 1))} className="px-3 py-3 hover:bg-accent transition-colors">
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 font-semibold min-w-[3rem] text-center">{cartForm.data.quantity}</span>
                                    <button type="button" onClick={() => cartForm.setData('quantity', Math.min(product.stock, cartForm.data.quantity + 1))} className="px-3 py-3 hover:bg-accent transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button type="submit" disabled={cartForm.processing} className="btn-wood flex-1 flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                                </button>
                            </form>
                        ) : !auth.user ? (
                            <Link href="/login" className="btn-wood flex items-center justify-center gap-2 w-full">
                                <ShoppingCart className="w-4 h-4" /> Login to Purchase
                            </Link>
                        ) : (
                            <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm font-medium text-center">Out of Stock</div>
                        )}

                        {/* Seller */}
                        {product.seller && (
                            <div className="flex items-center gap-3 bg-accent rounded-xl p-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Store className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{product.seller.shop_name ?? product.seller.name}</p>
                                    {product.seller.shop_description && <p className="text-xs text-muted-foreground mt-0.5">{product.seller.shop_description}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews */}
                <div className="mt-14 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <div className="flex items-center gap-2">
                            <Stars value={Math.round(avg_rating)} />
                            <span className="font-bold">{avg_rating || '—'}</span>
                            <span className="text-muted-foreground text-sm">({product.reviews.length})</span>
                        </div>
                    </div>

                    {/* Write review */}
                    {auth.user && (
                        <form onSubmit={e => { e.preventDefault(); reviewForm.post('/reviews'); }} className="wood-card p-6 space-y-4">
                            <h3 className="font-semibold">{user_review ? 'Update Your Review' : 'Write a Review'}</h3>
                            <Stars value={reviewForm.data.rating} onChange={v => reviewForm.setData('rating', v)} size="lg" />
                            <textarea className="w-full bg-muted border-0 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" rows={3}
                                placeholder="Share your experience with this product..."
                                value={reviewForm.data.comment} onChange={e => reviewForm.setData('comment', e.target.value)} />
                            <button type="submit" disabled={reviewForm.processing} className="btn-wood">
                                {user_review ? 'Update Review' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {/* Review list */}
                    <div className="space-y-4">
                        {product.reviews.map(r => (
                            <div key={r.id} className="wood-card p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                            {r.user.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{r.user.name}</p>
                                            <Stars value={r.rating} />
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                                </div>
                                {r.comment && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{r.comment}</p>}
                            </div>
                        ))}
                        {product.reviews.length === 0 && (
                            <div className="wood-card py-12 text-center text-muted-foreground">
                                <p className="text-3xl mb-2">💬</p>
                                <p>No reviews yet. Be the first to review!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
