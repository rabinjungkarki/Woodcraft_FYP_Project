import { Head, router, useForm, usePage } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Category { id: number; name: string; description: string | null; products_count: number; }

const card = "bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden";
const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left";
const td = "px-4 py-3 text-sm text-[#1A1A1A]";
const inp = "w-full h-10 px-3 rounded-lg text-sm border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52] transition-colors";

export default function CategoriesIndex({ categories = [] }: { categories: Category[] }) {
    const [editing, setEditing] = useState<Category | null>(null);
    const [showCreate, setShowCreate] = useState(false);
    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '' });
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/admin/categories', { onSuccess: () => { createForm.reset(); setShowCreate(false); } });
    }
    function startEdit(cat: Category) {
        setEditing(cat);
        editForm.setData({ name: cat.name, description: cat.description ?? '' });
    }
    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        if (!editing) return;
        editForm.patch(`/admin/categories/${editing.id}`, { onSuccess: () => setEditing(null) });
    }

    return (
        <SellerLayout title="Categories">
            <Head title="Categories" />
            <div className="p-6 space-y-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Categories</h1>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{ background: '#A67C52' }}>
                        <Plus className="w-4 h-4" /> Add Category
                    </button>
                </div>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{flash.success}</div>
                )}

                <div className={card}>
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['Name', 'Description', 'Products', 'Actions'].map(h => (
                                    <th key={h} className={th} style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: '#7A6A5A' }}>No categories yet.</td></tr>
                            )}
                            {categories.map((cat, i) => (
                                <tr key={cat.id} style={{ borderBottom: i < categories.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                                    <td className={td + ' font-medium'}>{cat.name}</td>
                                    <td className={td} style={{ color: '#6B5B4E' }}>{cat.description ?? '—'}</td>
                                    <td className={td}>{cat.products_count}</td>
                                    <td className={td}>
                                        <div className="flex gap-2">
                                            <button onClick={() => startEdit(cat)} className="p-1.5 rounded-lg hover:bg-[#F5F0EB] transition-colors" style={{ color: '#A67C52' }}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => { if (confirm('Delete this category?')) router.delete(`/admin/categories/${cat.id}`); }}
                                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create modal */}
                {showCreate && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                        <form onSubmit={submitCreate} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border border-[#E8DDD0]">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>Add Category</h2>
                                <button type="button" onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-[#F5F0EB]" style={{ color: '#6B5B4E' }}><X className="w-4 h-4" /></button>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Name</label>
                                <input className={inp} value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} required />
                                {createForm.errors.name && <p className="text-red-600 text-xs mt-1">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Description</label>
                                <input className={inp} value={createForm.data.description} onChange={e => createForm.setData('description', e.target.value)} placeholder="Optional" />
                            </div>
                            <div className="flex gap-3 justify-end pt-1">
                                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-xl text-sm border border-[#E8DDD0] text-[#6B5B4E] hover:bg-[#F5F0EB] transition-colors">Cancel</button>
                                <button type="submit" disabled={createForm.processing} className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: '#A67C52' }}>
                                    {createForm.processing ? 'Adding...' : 'Add Category'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Edit modal */}
                {editing && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                        <form onSubmit={submitEdit} className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border border-[#E8DDD0]">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>Edit Category</h2>
                                <button type="button" onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-[#F5F0EB]" style={{ color: '#6B5B4E' }}><X className="w-4 h-4" /></button>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Name</label>
                                <input className={inp} value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required />
                                {editForm.errors.name && <p className="text-red-600 text-xs mt-1">{editForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Description</label>
                                <input className={inp} value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} />
                            </div>
                            <div className="flex gap-3 justify-end pt-1">
                                <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm border border-[#E8DDD0] text-[#6B5B4E] hover:bg-[#F5F0EB] transition-colors">Cancel</button>
                                <button type="submit" disabled={editForm.processing} className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: '#A67C52' }}>
                                    {editForm.processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
