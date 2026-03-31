import { imgSrc } from '@/lib/img';
import { Head, Link, useForm } from '@inertiajs/react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface Product { id: number; name: string; price: number; images: string[] | null; }
interface CartItem { id: number; quantity: number; product: Product; }

function QtyControl({ item }: { item: CartItem }) {
    const form = useForm({ quantity: item.quantity });
    function change(qty: number) {
        form.setData('quantity', qty);
        form.patch(`/cart/${item.id}`, { preserveScroll: true });
    }
    return (
        <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button onClick={() => change(Math.max(1, item.quantity - 1))} className="px-3 py-2 hover:bg-accent transition-colors"><Minus className="w-3.5 h-3.5" /></button>
            <span className="px-4 text-sm font-semibold min-w-[2.5rem] text-center">{item.quantity}</span>
            <button onClick={() => change(item.quantity + 1)} className="px-3 py-2 hover:bg-accent transition-colors"><Plus className="w-3.5 h-3.5" /></button>
        </div>
    );
}

export default function Cart({ items, total }: { items: CartItem[]; total: number }) {
    const removeForm = useForm({});

    return (
        <ShopLayout>
            <Head title="Cart — WoodCraft" />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="wood-card py-20 text-center space-y-4">
                        <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground/40" />
                        <p className="text-xl font-semibold">Your cart is empty</p>
                        <p className="text-muted-foreground">Looks like you haven't added anything yet.</p>
                        <Link href="/shop" className="btn-wood inline-flex">Browse Products</Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Items */}
                        <div className="md:col-span-2 space-y-3">
                            {items.map(item => (
                                <div key={item.id} className="wood-card p-4 flex gap-4 items-center">
                                    <div className="w-20 h-20 bg-accent rounded-xl overflow-hidden shrink-0">
                                        {item.product.images?.[0]
                                            ? <img src={imgSrc(item.product.images) ?? ''} alt={item.product.name} className="w-full h-full object-cover" />
                                            : <div className="w-full h-full flex items-center justify-center bg-muted"><svg className="w-6 h-6 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{item.product.name}</p>
                                        <p className="text-primary font-bold mt-0.5">Rs. {Number(item.product.price).toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <QtyControl item={item} />
                                        <button onClick={() => removeForm.delete(`/cart/${item.id}`, { preserveScroll: true })} className="text-destructive hover:opacity-70 transition-opacity">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="font-bold text-sm w-24 text-right hidden sm:block">
                                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="wood-card p-5 h-fit space-y-4">
                            <h2 className="font-bold text-lg">Order Summary</h2>
                            <div className="space-y-2 text-sm">
                                {items.map(i => (
                                    <div key={i.id} className="flex justify-between text-muted-foreground">
                                        <span className="truncate max-w-[140px]">{i.product.name} ×{i.quantity}</span>
                                        <span>Rs. {(i.product.price * i.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span className="text-primary">Rs. {Number(total).toLocaleString()}</span>
                            </div>
                            <Link href="/checkout" className="btn-wood w-full text-center block">Proceed to Checkout</Link>
                            <Link href="/shop" className="text-sm text-center block text-muted-foreground hover:text-primary transition-colors">← Continue Shopping</Link>
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
