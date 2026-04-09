import { Head, Link, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Product { id: number; name: string; slug: string; price: number; stock: number; images: string[] | null; category: { name: string }; }
interface WishlistItem { id: number; product: Product; }

function WishlistCard({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
    const cartForm = useForm({ product_id: item.product.id, quantity: 1 });

    return (
        <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <Link href={`/shop/${item.product.slug}`} className="block aspect-square overflow-hidden bg-muted relative">
                {item.product.images?.[0]
                    ? <img src={imgSrc(item.product.images) ?? ''} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop&q=70" alt="" className="w-full h-full object-cover opacity-40" />
                }
                {item.product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
            </Link>
            <div className="p-4 space-y-3">
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.product.category.name}</p>
                    <p className="font-semibold truncate mt-0.5">{item.product.name}</p>
                    <p className="text-primary font-bold mt-1">रू {Number(item.product.price).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => cartForm.post('/cart', { preserveScroll: true })}
                        disabled={item.product.stock === 0 || cartForm.processing}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold py-2.5 rounded-xl hover:brightness-110 transition disabled:opacity-50">
                        <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                    <button onClick={onRemove}
                        className="p-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function Wishlist({ items }: { items: WishlistItem[] }) {
    const removeForm = useForm({});

    return (
        <ShopLayout>
            <Head title="Wishlist — Wood Kala" />
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="serif text-3xl font-bold flex items-center gap-2">
                            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" /> Wishlist
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">{items.length} saved item{items.length !== 1 ? 's' : ''}</p>
                    </div>
                    <Link href="/shop" className="text-sm text-primary hover:underline">Continue Shopping →</Link>
                </motion.div>

                {items.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="py-24 text-center border border-border rounded-2xl bg-card space-y-4">
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2.5 }}>
                            <Heart className="w-16 h-16 mx-auto text-muted-foreground/30" />
                        </motion.div>
                        <p className="serif text-xl font-bold">Your wishlist is empty</p>
                        <p className="text-muted-foreground text-sm">Save products you love to find them later.</p>
                        <Link href="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:brightness-110 transition">
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                        <AnimatePresence mode="popLayout">
                            {items.map(item => (
                                <WishlistCard key={item.id} item={item}
                                    onRemove={() => removeForm.post(`/wishlist/${item.product.id}`, { preserveScroll: true })} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </ShopLayout>
    );
}
