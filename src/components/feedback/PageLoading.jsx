import React from 'react';
import { Compass } from 'lucide-react';

export const PageLoading = () => {
  return (
    <div className="flex-1 min-h-[400px] flex items-center justify-center p-8 bg-blueprint-grid">
      <div className="bg-white/80 backdrop-blur-sm border border-[#EAE6DF] rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 max-w-xs text-center">
        <div className="relative">
          <Compass className="w-8 h-8 text-neutral-800 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-neutral-900">Loading Studio View</p>
          <p className="text-[11px] font-mono text-neutral-500 mt-0.5">Preparing architectural models...</p>
        </div>
      </div>
    </div>
  );
};

export default PageLoading;
