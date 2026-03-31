import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface User { id: number; name: string; email: string; phone: string | null; orders_count: number; created_at: string; }

export default function UsersIndex({ users }: { users: User[] }) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Users', href: '/admin/users' }]}>
            <Head title="Users" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Customers</h1>
                <div className="rounded-xl border bg-white dark:bg-neutral-900 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Phone</th>
                                <th className="px-4 py-3">Orders</th>
                                <th className="px-4 py-3">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">{u.name}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{u.phone ?? '—'}</td>
                                    <td className="px-4 py-3">{u.orders_count}</td>
                                    <td className="px-4 py-3">{new Date(u.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
