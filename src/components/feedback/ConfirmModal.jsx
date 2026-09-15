import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-elevated border border-sand-300 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              isDestructive ? 'bg-terracotta-light text-terracotta-dark' : 'bg-sage-100 text-sage-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-ink">
                {title}
              </h3>
              <p className="text-xs text-ink-muted mt-1.5 leading-relaxed">
                {message}
              </p>
            </div>

            <button
              onClick={onCancel}
              className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-sand-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-sand-100/60 px-6 py-3.5 border-t border-sand-200 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white hover:bg-sand-100 text-ink text-xs font-semibold rounded-lg border border-sand-300 transition-all"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-white text-xs font-semibold rounded-lg shadow-subtle transition-all ${
              isDestructive 
                ? 'bg-terracotta hover:bg-terracotta-dark' 
                : 'bg-sage-500 hover:bg-sage-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
