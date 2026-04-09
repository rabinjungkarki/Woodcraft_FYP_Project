import { Head } from '@inertiajs/react';

const PREFS = [
    { key: 'order_updates',   label: 'Order Updates',       desc: 'Shipping, delivery, and status changes', default: true },
    { key: 'promotions',      label: 'Promotions & Deals',  desc: 'Exclusive offers and new arrivals',       default: false },
    { key: 'account_alerts',  label: 'Account Activity',    desc: 'Login alerts and security notices',       default: true },
    { key: 'seller_updates',  label: 'Seller Notifications',desc: 'New orders and stock alerts (sellers)',   default: true },
    { key: 'newsletter',      label: 'Newsletter',          desc: 'Monthly woodcraft tips and inspiration',  default: false },
];

export default function Notifications() {
    return (
        <>
            <Head title="Notifications — Wood Kala" />
            <div className="space-y-6">
                <div>
                    <h2 className="serif text-lg font-bold">Notification Preferences</h2>
                    <p className="text-muted-foreground text-sm mt-1">Choose what updates you receive by email</p>
                </div>
                <div className="space-y-2">
                    {PREFS.map(p => (
                        <label key={p.key} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-accent/50 transition-colors cursor-pointer">
                            <div>
                                <p className="font-medium text-sm">{p.label}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                            </div>
                            <input type="checkbox" defaultChecked={p.default} className="accent-primary w-4 h-4 shrink-0" />
                        </label>
                    ))}
                </div>
                <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:brightness-110 transition">
                    Save Preferences
                </button>
            </div>
        </>
    );
}

Notifications.layout = { breadcrumbs: [{ title: 'Notifications', href: '/settings/notifications' }] };
