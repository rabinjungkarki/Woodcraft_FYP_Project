import { Head, usePage } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';

export default function Addresses() {
    const { auth } = usePage<{ auth: { user: { address?: string; phone?: string } } }>().props;

    return (
        <>
            <Head title="Addresses — Wood Kala" />
            <div className="space-y-6">
                <div>
                    <h2 className="serif text-lg font-bold">Delivery Addresses</h2>
                    <p className="text-muted-foreground text-sm mt-1">Manage your saved delivery addresses</p>
                </div>

                {auth.user.address ? (
                    <div className="border border-border rounded-xl p-4 flex items-start gap-3">
                        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="font-semibold text-sm">Default Address</p>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{auth.user.address}</p>
                            {auth.user.phone && <p className="text-xs text-muted-foreground mt-0.5">{auth.user.phone}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="border-2 border-dashed border-border rounded-xl p-8 text-center space-y-2">
                        <MapPin className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                        <p className="font-medium text-sm">No addresses saved</p>
                        <p className="text-xs text-muted-foreground">Add an address in your Profile settings</p>
                    </div>
                )}

                <a href="/settings/profile"
                    className="inline-flex items-center gap-2 border border-border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent transition-colors">
                    <Plus className="w-4 h-4" /> Add / Edit Address
                </a>
            </div>
        </>
    );
}

Addresses.layout = { breadcrumbs: [{ title: 'Addresses', href: '/settings/addresses' }] };
