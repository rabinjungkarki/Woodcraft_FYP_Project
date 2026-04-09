import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

// Used by: forgot-password, verify-email, confirm-password, reset-password, 2FA
export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] px-6 py-12">
            {/* Zen header — logo only, centered */}
            <Link href={home()} className="flex items-center gap-2.5 mb-10 group">
                <img
                    src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=48&h=48&fit=crop&q=80"
                    alt="Wood Kala"
                    className="h-10 w-10 rounded-lg object-cover shadow-sm group-hover:shadow-md transition-shadow"
                />
                <span className="serif font-bold text-xl text-foreground" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    Wood Kala
                </span>
            </Link>

            <div className="w-full max-w-sm">
                <div className="text-center mb-7 space-y-1">
                    <h1 className="serif text-xl font-bold text-foreground">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {children}
            </div>
        </div>
    );
}
