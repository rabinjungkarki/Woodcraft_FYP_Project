import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';

interface Category { id: number; name: string; }
interface Product {
    id: number; name: string; price: number; stock: number;
    is_active: boolean; material: string | null;
    category: Category;
}

export default function ProductsIndex({ products, categories }: { products: Product[]; categories: Category[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const form = useForm({
        category_id: '', name: '', description: '', price: '',
        stock: '', material: '', dimensions: '', is_active: true as boolean,
        images: [] as File[],
    });

    function openCreate() { form.reset(); setEditing(null); setShowForm(true); }
    function openEdit(p: Product) {
        form.setData({
            category_id: String(p.category.id), name: p.name, description: '',
            price: String(p.price), stock: String(p.stock),
            material: p.material ?? '', dimensions: '', is_active: p.is_active, images: [],
        });
        setEditing(p); setShowForm(true);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, onSuccess: () => setShowForm(false) };
        editing
            ? form.post(`/admin/products/${editing.id}?_method=PATCH`, opts)
            : form.post('/admin/products', opts);
    }

    function deleteProduct(id: number) {
        if (confirm('Delete this product?')) useForm({}).delete(`/admin/products/${id}`);
    }

    return (
        <AppLayout breadcrumbs={[{ title: 'Admin', href: '/admin' }, { title: 'Products', href: '/admin/products' }]}>
            <Head title="Products" />
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <button onClick={openCreate} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">+ Add Product</button>
                </div>

                <div className="rounded-xl border bg-white dark:bg-neutral-900 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-b last:border-0">
                                    <td className="px-4 py-3 font-medium">{p.name}</td>
                                    <td className="px-4 py-3">{p.category.name}</td>
                                    <td className="px-4 py-3">Rs. {Number(p.price).toLocaleString()}</td>
                                    <td className="px-4 py-3">{p.stock}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button onClick={() => openEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                        <button onClick={() => deleteProduct(p.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Product Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8">
                        <form onSubmit={submit} className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg space-y-4">
                            <h2 className="font-semibold text-lg">{editing ? 'Edit Product' : 'Add Product'}</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />
                                    {form.errors.name && <p className="text-red-500 text-xs mt-1">{form.errors.name}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.category_id} onChange={e => form.setData('category_id', e.target.value)} required>
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" rows={3} value={form.data.description} onChange={e => form.setData('description', e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Price (NPR)</label>
                                    <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.price} onChange={e => form.setData('price', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Stock</label>
                                    <input type="number" className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.stock} onChange={e => form.setData('stock', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Material</label>
                                    <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.material} onChange={e => form.setData('material', e.target.value)} placeholder="e.g. Teak Wood" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Dimensions</label>
                                    <input className="mt-1 w-full border rounded-lg px-3 py-2 text-sm" value={form.data.dimensions} onChange={e => form.setData('dimensions', e.target.value)} placeholder="e.g. 120x60x75 cm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium">Images</label>
                                    <input type="file" multiple accept="image/*" className="mt-1 w-full text-sm" onChange={e => form.setData('images', Array.from(e.target.files ?? []))} />
                                </div>
                                {editing && (
                                    <div className="col-span-2 flex items-center gap-2">
                                        <input type="checkbox" id="is_active" checked={form.data.is_active} onChange={e => form.setData('is_active', e.target.checked)} />
                                        <label htmlFor="is_active" className="text-sm">Active</label>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button type="button" onClick={() => setShowForm(false)} className="border px-4 py-2 rounded-lg text-sm">Cancel</button>
                                <button type="submit" disabled={form.processing} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
