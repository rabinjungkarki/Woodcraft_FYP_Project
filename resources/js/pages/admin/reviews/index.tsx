import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { Trash2, Star } from 'lucide-react';

interface Review { id: number; rating: number; comment: string | null; user: { name: string }; product: { name: string }; created_at: string; }

export default function AdminReviews({ reviews }: { reviews: Review[] }) {
    const form = useForm({});

    return (
        <SellerLayout title="Reviews">
            <Head title="Reviews" />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Reviews</h1>
                    <span className="text-sm" style={{ color: '#9A8070' }}>{reviews.length} total</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['Customer','Product','Rating','Comment','Date','Action'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left" style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: '#9A8070' }}>No reviews yet.</td></tr>
                            ) : reviews.map((r, i) => (
                                <tr key={r.id} style={{ borderBottom: i < reviews.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                                    <td className="px-4 py-3 font-medium" style={{ color: '#1A1A1A' }}>{r.user.name}</td>
                                    <td className="px-4 py-3 text-sm" style={{ color: '#6B5B4E' }}>{r.product.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} className="w-3.5 h-3.5" style={{ fill: s <= r.rating ? '#A67C52' : 'none', color: s <= r.rating ? '#A67C52' : '#DDD6CC' }} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs" style={{ color: '#6B5B4E' }}>
                                        <span className="line-clamp-2">{r.comment ?? '—'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs" style={{ color: '#9A8070' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => { if (confirm('Delete this review?')) form.delete(`/admin/reviews/${r.id}`); }}
                                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}>
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
}
