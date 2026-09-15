import React, { useState, useEffect } from 'react';
import { Edit3, X } from 'lucide-react';

export const RenameModal = ({
  isOpen,
  initialName = '',
  onRename,
  onCancel,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-elevated border border-sand-300 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sage-100 text-sage-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-display text-base font-bold text-ink">
                  Rename Project
                </h3>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="text-ink-muted hover:text-ink p-1 rounded-lg hover:bg-sand-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sharma Residence"
              className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition-all font-sans"
              autoFocus
            />
          </div>

          <div className="bg-sand-100/60 px-6 py-3.5 border-t border-sand-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-white hover:bg-sand-100 text-ink text-xs font-semibold rounded-lg border border-sand-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-subtle transition-all"
            >
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
