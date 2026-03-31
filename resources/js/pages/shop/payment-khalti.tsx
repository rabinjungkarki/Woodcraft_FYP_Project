import { Head, Link, useForm } from '@inertiajs/react';

interface Order { id: number; total: number; payment_method: string; }

declare const KhaltiCheckout: any;

export default function PaymentKhalti({ order }: { order: Order }) {
    const form = useForm({ token: '', amount: 0 });

    function initiateKhalti() {
        const config = {
            publicKey: (window as any).khaltiPublicKey ?? 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
            productIdentity: String(order.id),
            productName: `WoodCraft Order #${order.id}`,
            productUrl: window.location.href,
            paymentPreference: ['KHALTI'],
            eventHandler: {
                onSuccess(payload: { token: string; amount: number }) {
                    form.setData({ token: payload.token, amount: payload.amount });
                    form.post(`/payment/khalti/${order.id}/verify`);
                },
                onError(error: unknown) { console.error(error); },
                onClose() {},
            },
        };
        const checkout = new KhaltiCheckout(config);
        checkout.show({ amount: Math.round(Number(order.total) * 100) });
    }

    return (
        <>
            <Head title="Pay with Khalti - WoodCraft" />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-xl border p-8 max-w-sm w-full text-center space-y-4">
                    <p className="text-4xl">💜</p>
                    <h1 className="text-xl font-bold">Pay with Khalti</h1>
                    <p className="text-gray-600">Order #{order.id}</p>
                    <p className="text-2xl font-bold text-amber-700">Rs. {Number(order.total).toLocaleString()}</p>
                    <button onClick={initiateKhalti} className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700">
                        Pay Now
                    </button>
                    <Link href={`/orders/${order.id}`} className="block text-sm text-gray-500 hover:underline">Cancel</Link>
                </div>
            </div>
        </>
    );
}
