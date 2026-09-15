import React from 'react';
import { PlusCircle, Compass, Sparkles, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({ onSeedDemo }) => {
  return (
    <div className="bg-white rounded-2xl border border-sand-300 p-12 text-center max-w-xl mx-auto shadow-elevated">
      <div className="w-16 h-16 bg-sand-100 text-sage-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sand-200 shadow-subtle">
        <Compass className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="font-display text-xl font-bold text-ink mb-2">
        No Projects Yet
      </h3>
      <p className="text-xs text-ink-muted leading-relaxed max-w-md mx-auto mb-6">
        Begin by creating your first Indian residential plot brief, or launch the pre-configured Sharma Residence demo project to see Drafted in action.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/projects/new"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create First Project</span>
        </Link>
        <button
          onClick={onSeedDemo}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sand-200 hover:bg-sand-300 text-ink rounded-xl text-xs font-semibold transition-all"
        >
          <Layers className="w-4 h-4 text-sage-700" />
          <span>Load Sharma Residence (Demo)</span>
        </button>
      </div>
    </div>
  );
};
