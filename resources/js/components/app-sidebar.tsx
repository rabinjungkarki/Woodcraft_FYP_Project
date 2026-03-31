import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, ShoppingBag, ShoppingCart, Package, Settings, Shield } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const customerNav: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Shop', href: '/shop', icon: ShoppingBag },
    { title: 'My Cart', href: '/cart', icon: ShoppingCart },
    { title: 'My Orders', href: '/orders', icon: Package },
    { title: 'Settings', href: '/settings/profile', icon: Settings },
];

const adminNav: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
    { title: 'Products', href: '/admin/products', icon: ShoppingBag },
    { title: 'Categories', href: '/admin/categories', icon: Package },
    { title: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { title: 'Users', href: '/admin/users', icon: Shield },
    { title: 'Reviews', href: '/admin/reviews', icon: Settings },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const navItems = auth.user?.role === 'admin' ? adminNav : customerNav;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
