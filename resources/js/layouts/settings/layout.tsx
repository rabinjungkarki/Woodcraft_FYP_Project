import { Link, usePage } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { User, Shield, BarChart2, ArrowLeft, CheckCircle } from 'lucide-react';

const NAV = [
    { title: 'Profile',   href: '/settings/profile',  icon: User },
    { title: 'Security',  href: '/settings/security',  icon: Shield },
    { title: 'Analytics', href: '/settings/analytics', icon: BarChart2 },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { auth } = usePage<{ auth: { user: { name: string; email: string; avatar?: string; email_verified_at?: string | null } } }>().props;
    const user = auth.user;

    return (
        <div className="min-h-screen" style={{ background: '#F5F3F0' }}>
            {/* Top bar */}
            <header className="bg-white border-b px-6 h-14 flex items-center" style={{ borderColor: '#E8DDD0' }}>
                <Link href="/shop" className="flex items-center gap-2 text-sm font-medium" style={{ color: '#6B5B4E' }}>
                    <ArrowLeft className="w-4 h-4" /> Back to Shop
                </Link>
            </header>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Page title */}
                <div className="mb-7">
                    <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A', fontFamily: "'Playfair Display', serif" }}>My Profile</h1>
                    <p className="text-sm mt-1" style={{ color: '#7A6A5A' }}>Manage your account settings</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar */}
                    <aside className="lg:w-60 shrink-0 space-y-4">
                        {/* Profile card */}
                        <div className="bg-white rounded-2xl border p-5 text-center" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div className="w-16 h-16 rounded-full mx-auto mb-3 overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
                                style={{ background: '#A67C52' }}>
                                {user.avatar
                                    ? <img src={`/storage/${user.avatar}`} alt="" className="w-full h-full object-cover" />
                                    : user.name[0].toUpperCase()
                                }
                            </div>
                            <p className="font-bold text-sm" style={{ color: '#1A1A1A' }}>{user.name}</p>
                            <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>{user.email}</p>
                            {user.email_verified_at && (
                                <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: '#F0FDF4', color: '#15803d' }}>
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            )}
                        </div>

                        {/* Nav */}
                        <nav className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            {NAV.map((item, i) => {
                                const active = isCurrentOrParentUrl(item.href);
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href}
                                        className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all"
                                        style={{
                                            borderBottom: i < NAV.length - 1 ? '1px solid #F0EDE8' : 'none',
                                            background: active ? '#A67C52' : 'transparent',
                                            color: active ? '#fff' : '#3D2B1F',
                                        }}>
                                        <Icon className="w-4 h-4 shrink-0" style={{ color: active ? '#fff' : '#A67C52' }} />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>

                        <Link href="/logout" method="post" as="button"
                            className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium bg-white border transition-colors hover:bg-red-50"
                            style={{ borderColor: '#E8DDD0', color: '#dc2626' }}>
                            Sign Out
                        </Link>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
