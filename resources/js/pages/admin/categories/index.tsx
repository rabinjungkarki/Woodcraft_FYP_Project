import { Head, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Category { id: number; name: string; description: string | null; products_count: number; }

export default function CategoriesIndex({ categories }: { categories: Category[] }) {
    const [editing, setEditing] = useState<Category | null>(null);
    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ name: '', description: '' });
    const { flash } = usePage<{ flash: { success?: string } }>().props;

    function submitCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post('/admin/categories', { onSuccess: () => createForm.reset() });
    }
    function startEdit(cat: Category) {
        setEditing(cat);
        editForm.setData({ name: cat.name, description: cat.description ?? '' });
    }
    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        editForm.patch(`/admin/categories/${editing!.id}`, { onSuccess: () => setEditing(null) });
    }
    function deleteCategory(id: number) {
        if (confirm('Delete this category?')) router.delete(`/admin/categories/${id}`);
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Categories', href: '/admin/categories' }]}>
            <Head title="Categories" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Categories</h1>

                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{flash.success}</div>
                )}

                <form onSubmit={submitCreate} className="flex gap-3 items-end border rounded-xl p-4 bg-white dark:bg-neutral-900">
                    <div className="flex-1">
                        <label className="text-sm font-medium">Name</label>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} placeholder="Category name" required />
                        {createForm.errors.name && <p className="text-red-600 text-xs mt-1">{createForm.errors.name}</p>}
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-medium">Description</label>
                        <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={createForm.data.description} onChange={e => createForm.setData('description', e.target.value)} placeholder="Optional" />
                    </div>
                    <button type="submit" disabled={createForm.processing} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                        {createForm.processing ? 'Adding...' : 'Add Category'}
                    </button>
                </form>

                <div className="rounded-xl border bg-white dark:bg-neutral-900">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Products</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No categories yet.</td></tr>
                            )}
                            {categories.map(cat => (
                                <tr key={cat.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">{cat.name}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{cat.description ?? '—'}</td>
                                    <td className="px-4 py-3">{cat.products_count}</td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => startEdit(cat)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <form onSubmit={submitEdit} className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-md space-y-4">
                            <h2 className="font-semibold text-lg">Edit Category</h2>
                            <div>
                                <label className="text-sm font-medium">Name</label>
                                <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required />
                                {editForm.errors.name && <p className="text-red-600 text-xs mt-1">{editForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={editForm.data.description} onChange={e => editForm.setData('description', e.target.value)} />
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setEditing(null)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
                                <button type="submit" disabled={editForm.processing} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm disabled:opacity-60">
                                    {editForm.processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
