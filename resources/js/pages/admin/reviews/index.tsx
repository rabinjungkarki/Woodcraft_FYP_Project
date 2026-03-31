import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface Review { id: number; rating: number; comment: string | null; is_approved: boolean; user: { name: string }; product: { name: string }; created_at: string; }

export default function AdminReviews({ reviews }: { reviews: Review[] }) {
    const form = useForm({});

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Reviews', href: '/admin/reviews' }]}>
            <Head title="Reviews" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Reviews</h1>
                <div className="rounded-xl border bg-white dark:bg-neutral-900 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Product</th>
                                <th className="px-4 py-3">Rating</th>
                                <th className="px-4 py-3">Comment</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map(r => (
                                <tr key={r.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">{r.user.name}</td>
                                    <td className="px-4 py-3">{r.product.name}</td>
                                    <td className="px-4 py-3">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</td>
                                    <td className="px-4 py-3 max-w-xs truncate">{r.comment ?? '—'}</td>
                                    <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => form.delete(`/admin/reviews/${r.id}`)} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
