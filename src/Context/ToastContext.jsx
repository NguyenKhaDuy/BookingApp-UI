import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });

        setTimeout(() => {
            setToast(null);
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* TOAST UI */}
            {toast && (
                <div
                    className={`
                        fixed bottom-6 right-6 z-50
                        min-w-[260px] max-w-sm
                        px-4 py-3 rounded-xl shadow-lg
                        flex items-center justify-between gap-4
                        animate-slideIn
                        ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}
                    `}
                >
                    <span className="text-sm font-medium">{toast.message}</span>
                    <button onClick={() => setToast(null)}>
                        <X size={18} />
                    </button>
                </div>
            )}
        </ToastContext.Provider>
    );
};
