import { imgSrc } from '@/lib/img';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CreditCard, Truck, Wallet } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';

interface CartItem { id: number; quantity: number; product: { name: string; price: number; images: string[] | null }; }

const PAYMENT_METHODS = [
    { value: 'cod', label: 'Cash on Delivery', icon: <Truck className="w-5 h-5" />, desc: 'Pay when your order arrives' },
    { value: 'khalti', label: 'Khalti', icon: <Wallet className="w-5 h-5" />, desc: 'Pay via Khalti digital wallet' },
    { value: 'esewa', label: 'eSewa', icon: <CreditCard className="w-5 h-5" />, desc: 'Coming soon', disabled: true },
];

export default function Checkout({ items, total }: { items: CartItem[]; total: number }) {
    const { auth } = usePage<{ auth: { user: { address: string | null; phone: string | null } } }>().props;
    const form = useForm({ shipping_address: auth.user?.address ?? '', phone: auth.user?.phone ?? '', payment_method: 'cod' });

    return (
        <ShopLayout>
            <Head title="Checkout — WoodCraft" />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-5 gap-8">
                    {/* Form */}
                    <form onSubmit={e => { e.preventDefault(); form.post('/checkout'); }} className="md:col-span-3 space-y-6">
                        {/* Shipping */}
                        <div className="wood-card p-6 space-y-4">
                            <h2 className="font-bold text-lg flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Shipping Details</h2>
                            <div>
                                <label className="text-sm font-medium block mb-1.5">Phone Number</label>
                                <input className="w-full bg-muted border-0 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition"
                                    value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} placeholder="98XXXXXXXX" required />
                                {form.errors.phone && <p className="text-destructive text-xs mt-1">{form.errors.phone}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium block mb-1.5">Delivery Address</label>
                                <textarea className="w-full bg-muted border-0 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition resize-none" rows={3}
                                    value={form.data.shipping_address} onChange={e => form.setData('shipping_address', e.target.value)}
                                    placeholder="Street, City, District..." required />
                                {form.errors.shipping_address && <p className="text-destructive text-xs mt-1">{form.errors.shipping_address}</p>}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="wood-card p-6 space-y-3">
                            <h2 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Method</h2>
                            {PAYMENT_METHODS.map(m => (
                                <label key={m.value} className={`flex items-center gap-4 border-2 rounded-xl p-4 cursor-pointer transition-all ${form.data.payment_method === m.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'} ${m.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    <input type="radio" name="payment_method" value={m.value} disabled={m.disabled}
                                        checked={form.data.payment_method === m.value} onChange={() => !m.disabled && form.setData('payment_method', m.value)} className="sr-only" />
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.data.payment_method === m.value ? 'bg-primary text-primary-foreground' : 'bg-accent text-muted-foreground'}`}>{m.icon}</div>
                                    <div>
                                        <p className="font-semibold text-sm">{m.label}</p>
                                        <p className="text-xs text-muted-foreground">{m.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <button type="submit" disabled={form.processing} className="btn-wood w-full text-center">
                            {form.processing ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </form>

                    {/* Summary */}
                    <div className="md:col-span-2">
                        <div className="wood-card p-5 space-y-4 sticky top-20">
                            <h2 className="font-bold text-lg">Order Summary</h2>
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="flex gap-3 items-center">
                                        <div className="w-12 h-12 bg-accent rounded-xl overflow-hidden shrink-0">
                                            {item.product.images?.[0]
                                                ? <img src={imgSrc(item.product.images) ?? ''} alt="" className="w-full h-full object-cover" />
                                                : <div className="w-full h-full flex items-center justify-center bg-muted"><svg className="w-5 h-5 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold">Rs. {(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-border pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>Rs. {Number(total).toLocaleString()}</span></div>
                                <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="text-green-600">Free</span></div>
                                <div className="flex justify-between font-bold text-base pt-1 border-t border-border">
                                    <span>Total</span><span className="text-primary">Rs. {Number(total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
