import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Sun, Moon, Search, User } from 'lucide-react';

interface Props { children: React.ReactNode; }

export default function ShopLayout({ children }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; role: string } | null } }>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const [search, setSearch] = useState('');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
    }, [dark]);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (search.trim()) router.get('/shop', { search }, { preserveState: false });
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Navbar */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-sm border-b border-border' : 'bg-background border-b border-border'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <span className="text-2xl">🪵</span>
                        <span className="font-bold text-lg text-primary">WoodCraft</span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                        {auth.user && <Link href="/orders" className="hover:text-primary transition-colors">Orders</Link>}
                        {auth.user?.role === 'seller' && (
                            <Link href="/seller/dashboard" className="hover:text-primary transition-colors">Seller Panel</Link>
                        )}
                        {!auth.user && (
                            <Link href="/seller/register" className="hover:text-primary transition-colors">Sell</Link>
                        )}
                    </nav>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                className="w-full bg-muted border-0 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-ring outline-none transition"
                                placeholder="Search furniture..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </form>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        {/* Dark mode */}
                        <button onClick={() => setDark(!dark)} className="p-2 rounded-xl hover:bg-accent transition-colors" aria-label="Toggle dark mode">
                            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {/* Cart */}
                        <Link href="/cart" className="p-2 rounded-xl hover:bg-accent transition-colors relative" aria-label="Cart">
                            <ShoppingCart className="w-4 h-4" />
                        </Link>

                        {/* Auth */}
                        {auth.user ? (
                            <Link href="/dashboard" className="hidden md:flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">
                                <User className="w-3.5 h-3.5" />
                                {auth.user.name.split(' ')[0]}
                            </Link>
                        ) : (
                            <div className="hidden md:flex gap-2">
                                <Link href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">Login</Link>
                                <Link href="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition">Register</Link>
                            </div>
                        )}

                        {/* Mobile menu toggle */}
                        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors">
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input className="w-full bg-muted rounded-xl pl-9 pr-4 py-2 text-sm outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </form>
                        {[
                            { href: '/shop', label: 'Shop' },
                            ...(auth.user ? [{ href: '/orders', label: 'My Orders' }, { href: '/cart', label: 'Cart' }, { href: '/dashboard', label: 'Dashboard' }] : [{ href: '/login', label: 'Login' }, { href: '/register', label: 'Register' }]),
                        ].map(l => (
                            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium hover:text-primary transition-colors">{l.label}</Link>
                        ))}
                    </div>
                )}
            </header>

            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-card border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">🪵</span>
                            <span className="font-bold text-primary">WoodCraft</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Nepal's premium handcrafted furniture marketplace.</p>
                    </div>
                    {[
                        { title: 'Shop', links: [{ href: '/shop', label: 'All Products' }, { href: '/shop?category=chairs', label: 'Chairs' }, { href: '/shop?category=tables', label: 'Tables' }] },
                        { title: 'Account', links: auth.user ? [{ href: '/dashboard', label: 'Dashboard' }, { href: '/orders', label: 'Orders' }, { href: '/cart', label: 'Cart' }] : [{ href: '/login', label: 'Login' }, { href: '/register', label: 'Register' }] },
                        { title: 'Sell', links: [{ href: '/seller/register', label: 'Become a Seller' }, { href: '/seller/dashboard', label: 'Seller Dashboard' }] },
                    ].map(col => (
                        <div key={col.title}>
                            <p className="font-semibold text-sm mb-3">{col.title}</p>
                            <ul className="space-y-2">
                                {col.links.map(l => (
                                    <li key={l.href}><Link href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{l.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
                    © 2026 WoodCraft Nepal · Developed by Rabin Karki · BSc(Hons) Computer Science
                </div>
            </footer>
        </div>
    );
}
