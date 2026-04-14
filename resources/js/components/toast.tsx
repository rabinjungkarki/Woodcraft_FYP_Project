import { useState, createContext, useContext, useCallback, useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';
type Toast = { id: number; message: string; type: ToastType };
type ToastCtx = { toast: (message: string, type?: ToastType) => void };

const Ctx = createContext<ToastCtx>({ toast: () => {} });
export function useToast() { return useContext(Ctx); }

function ToastItem({ t, onRemove }: { t: Toast; onRemove: () => void }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const enter = setTimeout(() => setVisible(true), 10);
        const exit = setTimeout(() => setVisible(false), 2700);
        const remove = setTimeout(onRemove, 3000);
        return () => { clearTimeout(enter); clearTimeout(exit); clearTimeout(remove); };
    }, []);

    return (
        <div style={{
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(32px)',
            background: t.type === 'success' ? '#1C1C1C' : '#fef2f2',
            color: t.type === 'success' ? '#fff' : '#dc2626',
            borderRadius: 14,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 220,
            maxWidth: 320,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            fontSize: 14,
            fontWeight: 500,
            borderLeft: `3px solid ${t.type === 'success' ? '#A67C52' : '#dc2626'}`,
        }}>
            {t.type === 'success'
                ? <CheckCircle style={{ width: 16, height: 16, color: '#A67C52', flexShrink: 0 }} />
                : <XCircle style={{ width: 16, height: 16, flexShrink: 0 }} />}
            <span style={{ flex: 1 }}>{t.message}</span>
            <button onClick={() => { setVisible(false); setTimeout(onRemove, 250); }}
                style={{ opacity: 0.5, cursor: 'pointer', background: 'none', border: 'none', padding: 0, color: 'inherit' }}>
                <X style={{ width: 14, height: 14 }} />
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);
    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <Ctx.Provider value={{ toast }}>
            {children}
            <div style={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none' }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: 'auto' }}>
                        <ToastItem t={t} onRemove={() => remove(t.id)} />
                    </div>
                ))}
            </div>
        </Ctx.Provider>
    );
}
