import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast({ notification, onClose }) {
  if (!notification) return null;

  const { message, type } = notification;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borderColors = {
    success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-200',
    error: 'border-rose-500/40 bg-rose-950/80 text-rose-200',
    warning: 'border-amber-500/40 bg-amber-950/80 text-amber-200',
    info: 'border-cyan-500/40 bg-slate-900/90 text-cyan-200'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounceIn max-w-md">
      <div className={`p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 ${borderColors[type] || borderColors.info}`}>
        <div className="flex items-center gap-3">
          {icons[type] || icons.info}
          <span className="text-xs font-medium font-sans">{message}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
