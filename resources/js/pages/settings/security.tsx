import { Form, Head, router } from '@inertiajs/react';
import { Shield, Lock } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import { disable, enable } from '@/routes/two-factor';

type Props = { canManageTwoFactor?: boolean; requiresConfirmation?: boolean; twoFactorEnabled?: boolean; google_user?: boolean; };

const inp = "w-full h-11 px-4 rounded-xl text-sm border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52] transition-colors";
const lbl = "block text-xs font-semibold text-[#6B5B4E] mb-1.5 uppercase tracking-wide";

export default function Security({ canManageTwoFactor = false, requiresConfirmation = false, twoFactorEnabled = false, google_user = false }: Props) {
    const passwordRef = useRef<HTMLInputElement>(null);
    const currentRef = useRef<HTMLInputElement>(null);
    const { qrCodeSvg, hasSetupData, manualSetupKey, clearSetupData, clearTwoFactorAuthData, fetchSetupData, recoveryCodesList, fetchRecoveryCodes, errors: tfaErrors } = useTwoFactorAuth();
    const [showModal, setShowModal] = useState(false);
    const [setPwSuccess, setSetPwSuccess] = useState(false);
    const [setPwForm, setSetPwForm] = useState({ password: '', password_confirmation: '', error: '', processing: false });

    function submitSetPassword(e: React.FormEvent) {
        e.preventDefault();
        if (setPwForm.password !== setPwForm.password_confirmation) {
            setSetPwForm(f => ({ ...f, error: 'Passwords do not match.' }));
            return;
        }
        setSetPwForm(f => ({ ...f, processing: true, error: '' }));
        router.put('/settings/set-password', {
            password: setPwForm.password,
            password_confirmation: setPwForm.password_confirmation,
        }, {
            preserveScroll: true,
            onSuccess: () => { setSetPwSuccess(true); setSetPwForm(f => ({ ...f, processing: false })); },
            onError: (errs) => { setSetPwForm(f => ({ ...f, processing: false, error: errs.password ?? 'Failed.' })); },
        });
    }

    return (
        <>
            <Head title="Security" />
            <div className="space-y-5">
                {/* Change / Set Password */}
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div className="flex items-center gap-2.5 mb-5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FDF0E6' }}>
                            <Lock className="w-4 h-4" style={{ color: '#A67C52' }} />
                        </div>
                        <div>
                            <h2 className="font-bold text-base" style={{ color: '#1A1A1A' }}>{google_user ? 'Set a Password' : 'Change Password'}</h2>
                            <p className="text-xs" style={{ color: '#9A8070' }}>{google_user ? 'You signed in with Google — set a password to also log in with email' : 'Use a long, random password to stay secure'}</p>
                        </div>
                    </div>

                    {google_user ? (
                        <form onSubmit={submitSetPassword} className="space-y-4">
                            {setPwSuccess && <p className="text-sm font-medium" style={{ color: '#15803d' }}>✓ Password set successfully.</p>}
                            {setPwForm.error && <p className="text-sm text-red-600">{setPwForm.error}</p>}
                            <div>
                                <label className={lbl}>New Password</label>
                                <input type="password" className={inp} placeholder="Min. 8 characters" value={setPwForm.password}
                                    onChange={e => setSetPwForm(f => ({ ...f, password: e.target.value }))} required minLength={8} />
                            </div>
                            <div>
                                <label className={lbl}>Confirm Password</label>
                                <input type="password" className={inp} placeholder="Confirm password" value={setPwForm.password_confirmation}
                                    onChange={e => setSetPwForm(f => ({ ...f, password_confirmation: e.target.value }))} required />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button type="submit" disabled={setPwForm.processing}
                                    className="px-6 h-11 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                                    style={{ background: '#A67C52' }}>
                                    {setPwForm.processing ? 'Setting...' : 'Set Password'}
                                </button>
                            </div>
                        </form>
                    ) : (
                    <Form {...SecurityController.update.form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={errs => { if (errs.password) passwordRef.current?.focus(); if (errs.current_password) currentRef.current?.focus(); }}
                        className="space-y-4">
                        {({ errors, processing, recentlySuccessful }) => (
                            <>
                                <div>
                                    <label className={lbl}>Current Password</label>
                                    <PasswordInput ref={currentRef} name="current_password" className={inp} placeholder="Current password" autoComplete="current-password" />
                                    <InputError message={errors.current_password} />
                                </div>
                                <div>
                                    <label className={lbl}>New Password</label>
                                    <PasswordInput ref={passwordRef} name="password" className={inp} placeholder="New password" autoComplete="new-password" />
                                    <InputError message={errors.password} />
                                </div>
                                <div>
                                    <label className={lbl}>Confirm New Password</label>
                                    <PasswordInput name="password_confirmation" className={inp} placeholder="Confirm password" autoComplete="new-password" />
                                    <InputError message={errors.password_confirmation} />
                                </div>
                                <div className="flex items-center justify-end gap-4 pt-2">
                                    {recentlySuccessful && <span className="text-sm font-medium" style={{ color: '#15803d' }}>✓ Updated</span>}
                                    <button type="submit" disabled={processing}
                                        className="px-6 h-11 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                                        style={{ background: '#A67C52' }}>
                                        {processing ? 'Updating...' : 'Update Password'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                    )}
                </div>

                {/* 2FA */}
                {canManageTwoFactor && (
                    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#E8DDD0', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: twoFactorEnabled ? '#F0FDF4' : '#FDF0E6' }}>
                                    <Shield className="w-4 h-4" style={{ color: twoFactorEnabled ? '#15803d' : '#A67C52' }} />
                                </div>
                                <div>
                                    <h2 className="font-bold text-base" style={{ color: '#1A1A1A' }}>Two-Factor Authentication</h2>
                                    <p className="text-xs" style={{ color: '#9A8070' }}>Add an extra layer of security to your account</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold"
                                style={twoFactorEnabled ? { background: '#F0FDF4', color: '#15803d' } : { background: '#FEF2F2', color: '#dc2626' }}>
                                {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>

                        <p className="text-sm mt-4 mb-4" style={{ color: '#6B5B4E' }}>
                            {twoFactorEnabled
                                ? 'You will be prompted for a secure pin during login from your TOTP app.'
                                : 'When enabled, you will be prompted for a secure pin during login.'}
                        </p>

                        {twoFactorEnabled ? (
                            <div className="space-y-4">
                                <Form {...disable.form()}>
                                    {({ processing }) => (
                                        <button type="submit" disabled={processing}
                                            className="px-5 h-10 rounded-xl text-sm font-semibold text-white"
                                            style={{ background: '#dc2626' }}>
                                            Disable 2FA
                                        </button>
                                    )}
                                </Form>
                                <TwoFactorRecoveryCodes recoveryCodesList={recoveryCodesList} fetchRecoveryCodes={fetchRecoveryCodes} errors={tfaErrors} />
                            </div>
                        ) : (
                            hasSetupData ? (
                                <button onClick={() => setShowModal(true)}
                                    className="px-5 h-10 rounded-xl text-sm font-semibold text-white"
                                    style={{ background: '#A67C52' }}>
                                    Continue Setup
                                </button>
                            ) : (
                                <Form {...enable.form()} onSuccess={() => setShowModal(true)}>
                                    {({ processing }) => (
                                        <button type="submit" disabled={processing}
                                            className="px-5 h-10 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                                            style={{ background: '#A67C52' }}>
                                            Enable 2FA
                                        </button>
                                    )}
                                </Form>
                            )
                        )}
                    </div>
                )}
            </div>

            <TwoFactorSetupModal isOpen={showModal} onClose={() => setShowModal(false)}
                requiresConfirmation={requiresConfirmation} twoFactorEnabled={twoFactorEnabled}
                qrCodeSvg={qrCodeSvg} manualSetupKey={manualSetupKey}
                clearSetupData={clearSetupData} fetchSetupData={fetchSetupData} errors={tfaErrors} />
        </>
    );
}
