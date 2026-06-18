import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error:   (msg) => addToast(msg, 'error'),
    warning: (msg) => addToast(msg, 'warning'),
    info:    (msg) => addToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-slide-in"
            style={{ animation: 'slideIn 0.3s ease' }}
          >
            <ToastItem toast={t} onRemove={removeToast} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

const STYLES = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: '✅',
    title: 'text-green-800',
    msg: 'text-green-700',
    bar: 'bg-green-400',
    btn: 'text-green-400 hover:text-green-600',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: '❌',
    title: 'text-red-800',
    msg: 'text-red-700',
    bar: 'bg-red-400',
    btn: 'text-red-400 hover:text-red-600',
  },
  warning: {
    bg: 'bg-orange-50 border-orange-200',
    icon: '⚠️',
    title: 'text-orange-800',
    msg: 'text-orange-700',
    bar: 'bg-orange-400',
    btn: 'text-orange-400 hover:text-orange-600',
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'ℹ️',
    title: 'text-blue-800',
    msg: 'text-blue-700',
    bar: 'bg-blue-400',
    btn: 'text-blue-400 hover:text-blue-600',
  },
};

const TITLES = {
  success: 'Success',
  error:   'Error',
  warning: 'Warning',
  info:    'Info',
};

const ToastItem = ({ toast, onRemove }) => {
  const s = STYLES[toast.type] || STYLES.info;
  return (
    <div className={`relative border rounded-xl shadow-lg px-4 py-3 flex items-start gap-3 overflow-hidden ${s.bg}`}>
      <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${s.title}`}>{TITLES[toast.type]}</p>
        <p className={`text-sm mt-0.5 leading-snug ${s.msg}`}>{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className={`text-lg leading-none flex-shrink-0 transition ${s.btn}`}
      >
        ✕
      </button>
      {/* Progress bar */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 ${s.bar}`}
        style={{ animation: 'shrinkBar 4s linear forwards' }}
      />
      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
};