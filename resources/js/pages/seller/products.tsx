import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, Package, LayoutDashboard } from 'lucide-react';

interface Category { id: number; name: string; }
interface Product { id: number; name: string; price: number; stock: number; is_active: boolean; material: string | null; dimensions: string | null; description: string | null; category: { id: number; name: string }; }

export default function SellerProducts({ products, categories }: { products: Product[]; categories: Category[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const form = useForm({ category_id: '', name: '', description: '', price: '', stock: '', material: '', dimensions: '', is_active: true as boolean, images: [] as File[] });
    const deleteForm = useForm({});

    function openCreate() { form.reset(); setEditing(null); setShowForm(true); }
    function openEdit(p: Product) {
        form.setData({ category_id: String(p.category.id), name: p.name, description: p.description ?? '', price: String(p.price), stock: String(p.stock), material: p.material ?? '', dimensions: p.dimensions ?? '', is_active: p.is_active, images: [] });
        setEditing(p); setShowForm(true);
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, onSuccess: () => setShowForm(false) };
        editing ? form.post(`/seller/products/${editing.id}`, opts) : form.post('/seller/products', opts);
    }

    return (
        <>
            <Head title="My Products — WoodCraft Seller" />
            <div className="min-h-screen bg-gray-50">
                <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <LayoutDashboard className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg">WoodCraft</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-muted-foreground">Seller Panel</span>
                    </div>
                    <Link href="/seller/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">← Dashboard</Link>
                </header>

                <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">My Products</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
                        </div>
                        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition">
                            <Plus className="w-4 h-4" /> Add Product
                        </button>
                    </div>

                    {products.length === 0 ? (
                        <div className="bg-white rounded-xl border py-20 text-center space-y-3">
                            <Package className="w-14 h-14 mx-auto text-muted-foreground/30" />
                            <p className="font-semibold">No products yet</p>
                            <p className="text-sm text-muted-foreground">Add your first product to start selling.</p>
                            <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition mt-2">
                                <Plus className="w-4 h-4" /> Add Product
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-muted-foreground border-b bg-gray-50 text-xs uppercase tracking-wide">
                                        <th className="px-5 py-3">Product</th>
                                        <th className="px-5 py-3">Category</th>
                                        <th className="px-5 py-3">Price</th>
                                        <th className="px-5 py-3">Stock</th>
                                        <th className="px-5 py-3">Status</th>
                                        <th className="px-5 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-5 py-3 font-medium">{p.name}</td>
                                            <td className="px-5 py-3 text-muted-foreground">{p.category.name}</td>
                                            <td className="px-5 py-3 font-bold text-primary">Rs. {Number(p.price).toLocaleString()}</td>
                                            <td className="px-5 py-3">{p.stock}</td>
                                            <td className="px-5 py-3">
                                                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors" title="Edit">
                                                        <Pencil className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => confirm('Delete this product?') && deleteForm.delete(`/seller/products/${p.id}`)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8 px-4">
                        <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4">
                            <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium block mb-1.5">Product Name</label>
                                    <input className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />
                                    {form.errors.name && <p className="text-destructive text-xs mt-1">{form.errors.name}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium block mb-1.5">Category</label>
                                    <select className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.category_id} onChange={e => form.setData('category_id', e.target.value)} required>
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium block mb-1.5">Description</label>
                                    <textarea className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring resize-none" rows={3} value={form.data.description} onChange={e => form.setData('description', e.target.value)} placeholder="Describe your product..." />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1.5">Price (NPR)</label>
                                    <input type="number" min="0" className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.price} onChange={e => form.setData('price', e.target.value)} required />
                                    {form.errors.price && <p className="text-destructive text-xs mt-1">{form.errors.price}</p>}
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1.5">Stock Quantity</label>
                                    <input type="number" min="0" className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.stock} onChange={e => form.setData('stock', e.target.value)} required />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1.5">Material</label>
                                    <input className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.material} onChange={e => form.setData('material', e.target.value)} placeholder="e.g. Teak Wood" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium block mb-1.5">Dimensions</label>
                                    <input className="w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring" value={form.data.dimensions} onChange={e => form.setData('dimensions', e.target.value)} placeholder="e.g. 120×60×75 cm" />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-sm font-medium block mb-1.5">Product Images</label>
                                    <input type="file" multiple accept="image/*" className="w-full text-sm bg-gray-50 border rounded-xl px-4 py-2.5 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground"
                                        onChange={e => form.setData('images', Array.from(e.target.files ?? []))} />
                                    <p className="text-xs text-muted-foreground mt-1">Upload up to 5 images (max 2MB each)</p>
                                </div>
                                {editing && (
                                    <div className="col-span-2 flex items-center gap-2">
                                        <input type="checkbox" id="is_active" checked={form.data.is_active} onChange={e => form.setData('is_active', e.target.checked)} className="rounded" />
                                        <label htmlFor="is_active" className="text-sm">Active (visible to buyers)</label>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 justify-end pt-2 border-t">
                                <button type="button" onClick={() => setShowForm(false)} className="border px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                                <button type="submit" disabled={form.processing} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-60">
                                    {editing ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
