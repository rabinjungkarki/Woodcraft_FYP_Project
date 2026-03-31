import { Head, Link, useForm } from '@inertiajs/react';
import { Store } from 'lucide-react';

export default function SellerRegister() {
    const form = useForm({ shop_name: '', shop_description: '', phone: '' });

    return (
        <>
            <Head title="Become a Seller — WoodCraft" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl border shadow-sm w-full max-w-md p-8 space-y-6">
                    <div className="text-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Store className="w-7 h-7 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold">Become a Seller</h1>
                        <p className="text-muted-foreground text-sm mt-1">Set up your shop and start selling furniture on WoodCraft</p>
                    </div>

                    <form onSubmit={e => { e.preventDefault(); form.post('/seller/register'); }} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium block mb-1.5">Shop Name</label>
                            <input className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none transition"
                                value={form.data.shop_name} onChange={e => form.setData('shop_name', e.target.value)}
                                placeholder="e.g. Himalayan Wood Works" required />
                            {form.errors.shop_name && <p className="text-destructive text-xs mt-1">{form.errors.shop_name}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1.5">Phone Number</label>
                            <input className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none transition"
                                value={form.data.phone} onChange={e => form.setData('phone', e.target.value)}
                                placeholder="98XXXXXXXX" required />
                            {form.errors.phone && <p className="text-destructive text-xs mt-1">{form.errors.phone}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium block mb-1.5">Shop Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                            <textarea className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none transition resize-none" rows={3}
                                value={form.data.shop_description} onChange={e => form.setData('shop_description', e.target.value)}
                                placeholder="Tell buyers about your shop..." />
                        </div>
                        <button type="submit" disabled={form.processing}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60">
                            Activate Seller Account
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground">
                        Already a seller?{' '}
                        <Link href="/seller/dashboard" className="text-primary hover:underline">Go to dashboard</Link>
                    </p>
                </div>
            </div>
        </>
    );
}
