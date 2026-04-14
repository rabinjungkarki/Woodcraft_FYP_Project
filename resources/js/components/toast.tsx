import { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, ShoppingCart, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'cart' | 'info';
type Toast = { id: number; message: string; type: ToastType };
type ToastCtx = { toast: (message: string, type?: ToastType) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export function useToast() { return useContext(Ctx); }

const STYLES: Record<ToastType, { bg: string; border: string; icon: React.ReactNode; text: string }> = {
    success: {
        bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '#22c55e',
        text: '#15803d',
        icon: <CheckCircle style={{ width: 18, height: 18, color: '#22c55e', flexShrink: 0 }} />,
    },
    error: {
        bg: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
        border: '#f43f5e',
        text: '#be123c',
        icon: <XCircle style={{ width: 18, height: 18, color: '#f43f5e', flexShrink: 0 }} />,
    },
    cart: {
        bg: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
        border: '#6B8F5E',
        text: '#3d6b35',
        icon: <ShoppingCart style={{ width: 18, height: 18, color: '#6B8F5E', flexShrink: 0 }} />,
    },
    info: {
        bg: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
        border: '#3b82f6',
        text: '#1d4ed8',
        icon: <Info style={{ width: 18, height: 18, color: '#3b82f6', flexShrink: 0 }} />,
    },
};

function ToastItem({ t, onRemove }: { t: Toast; onRemove: () => void }) {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(100);
    const s = STYLES[t.type];

    useEffect(() => {
        const enter = setTimeout(() => setVisible(true), 10);
        const exit = setTimeout(() => setVisible(false), 3200);
        const remove = setTimeout(onRemove, 3500);

        // shrink progress bar
        const start = Date.now();
        const duration = 3200;
        const tick = setInterval(() => {
            const elapsed = Date.now() - start;
            setProgress(Math.max(0, 100 - (elapsed / duration) * 100));
        }, 30);

        return () => { clearTimeout(enter); clearTimeout(exit); clearTimeout(remove); clearInterval(tick); };
    }, []);

    return (
        <div style={{
            transition: 'opacity 0.3s cubic-bezier(0.22,1,0.36,1), transform 0.3s cubic-bezier(0.22,1,0.36,1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0) scale(1)' : 'translateX(40px) scale(0.95)',
            background: s.bg,
            borderRadius: 14,
            padding: '12px 14px 0 14px',
            display: 'flex',
            flexDirection: 'column',
            minWidth: 260,
            maxWidth: 340,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
            border: `1px solid ${s.border}30`,
            overflow: 'hidden',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 12 }}>
                {s.icon}
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: s.text, lineHeight: 1.4 }}>{t.message}</span>
                <button
                    onClick={() => { setVisible(false); setTimeout(onRemove, 300); }}
                    style={{ opacity: 0.5, cursor: 'pointer', background: 'none', border: 'none', padding: 2, color: s.text, flexShrink: 0 }}>
                    <X style={{ width: 14, height: 14 }} />
                </button>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, background: `${s.border}20`, marginLeft: -14, marginRight: -14 }}>
                <div style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: s.border,
                    transition: 'width 0.03s linear',
                    borderRadius: '0 2px 2px 0',
                }} />
            </div>
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        setToasts(prev => [...prev, { id: Date.now(), message, type }]);
    }, []);

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <Ctx.Provider value={{ toast }}>
            {children}
            <div style={{
                position: 'fixed', top: 80, right: 20,
                zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end',
                pointerEvents: 'none',
            }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: 'auto' }}>
                        <ToastItem t={t} onRemove={() => remove(t.id)} />
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}
