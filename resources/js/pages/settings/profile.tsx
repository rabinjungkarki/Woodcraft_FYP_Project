import { Form, Head, Link, usePage } from '@inertiajs/react';
import { Camera, Mail, User, Phone, MapPin } from 'lucide-react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import DeleteUser from '@/components/delete-user';
import { send } from '@/routes/verification';

const inp = "w-full h-11 px-4 rounded-xl text-sm border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52] transition-colors";
const lbl = "block text-xs font-semibold text-[#6B5B4E] mb-1.5 uppercase tracking-wide";

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string; email_verified_at: string | null; phone?: string; address?: string; avatar?: string } } }>().props;
    const [preview, setPreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const avatarSrc = preview ?? (auth.user.avatar ? `/storage/${auth.user.avatar}` : null);

    return (
        <>
            <Head title="Profile" />
            <Form {...ProfileController.update.form()} options={{ preserveScroll: true, forceFormData: true }}>
                {({ processing, recentlySuccessful, errors }) => (
                    <div className="space-y-5">
                        {/* Avatar card */}
                        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <h2 className="font-bold text-base mb-4" style={{ color: '#1A1A1A' }}>Profile Photo</h2>
                            <div className="flex items-center gap-5">
                                <div className="relative shrink-0">
                                    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-bold"
                                        style={{ background: '#A67C52' }}>
                                        {avatarSrc ? <img src={avatarSrc} alt="" className="w-full h-full object-cover" /> : auth.user.name[0].toUpperCase()}
                                    </div>
                                    <button type="button" onClick={() => fileRef.current?.click()}
                                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white shadow-md"
                                        style={{ background: '#A67C52' }}>
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                    <input ref={fileRef} type="file" name="avatar" accept="image/*" className="hidden"
                                        onChange={e => { const f = e.target.files?.[0]; if (f) setPreview(URL.createObjectURL(f)); }} />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{auth.user.name}</p>
                                    <p className="text-xs mt-0.5" style={{ color: '#9A8070' }}>{auth.user.email}</p>
                                    <button type="button" onClick={() => fileRef.current?.click()}
                                        className="text-xs mt-2 font-medium hover:underline" style={{ color: '#A67C52' }}>
                                        {avatarSrc ? 'Change photo' : 'Upload photo'} — JPG, PNG up to 2MB
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Profile info card */}
                        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <h2 className="font-bold text-base mb-5" style={{ color: '#1A1A1A' }}>Profile Information</h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className={lbl}><User className="inline w-3 h-3 mr-1" />Full Name</label>
                                    <input className={inp} name="name" defaultValue={auth.user.name} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div>
                                    <label className={lbl}><Mail className="inline w-3 h-3 mr-1" />Email Address</label>
                                    <input className={inp} type="email" name="email" defaultValue={auth.user.email} required />
                                    <InputError message={errors.email} />
                                </div>
                                <div>
                                    <label className={lbl}><Phone className="inline w-3 h-3 mr-1" />Phone Number</label>
                                    <input className={inp} name="phone" defaultValue={auth.user.phone ?? ''} placeholder="98XXXXXXXX" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className={lbl}><MapPin className="inline w-3 h-3 mr-1" />Address</label>
                                    <textarea className="w-full px-4 py-3 rounded-xl text-sm border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52] transition-colors resize-none"
                                        name="address" rows={2} defaultValue={auth.user.address ?? ''} placeholder="Street, City, District..." />
                                </div>
                            </div>

                            {mustVerifyEmail && !auth.user.email_verified_at && (
                                <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400e' }}>
                                    Your email is unverified.{' '}
                                    <Link href={send()} as="button" className="font-semibold underline">Resend verification</Link>
                                    {status === 'verification-link-sent' && <span className="ml-2 text-green-600 font-medium">Sent!</span>}
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-4 mt-6">
                                {recentlySuccessful && <span className="text-sm font-medium" style={{ color: '#15803d' }}>✓ Saved</span>}
                                <button type="submit" disabled={processing}
                                    className="px-6 h-11 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all"
                                    style={{ background: '#A67C52' }}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>

                        {/* Danger zone */}
                        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#FECACA', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                            <h2 className="font-bold text-base mb-1" style={{ color: '#dc2626' }}>Danger Zone</h2>
                            <p className="text-xs mb-4" style={{ color: '#9A8070' }}>Permanently delete your account and all data</p>
                            <DeleteUser />
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}
