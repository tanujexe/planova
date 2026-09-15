import React from 'react';
import { AlertTriangle, ArrowRight, Edit2, ShieldAlert } from 'lucide-react';

export const FeasibilityModal = ({
  isOpen,
  feasibilityResult,
  onProceedAnyway,
  onEditRequirements,
}) => {
  if (!isOpen || !feasibilityResult || feasibilityResult.isFeasible) return null;

  const { warnings, requiredSqFt, availableSqFt, utilizationRatio } = feasibilityResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-elevated border border-sand-300 overflow-hidden transform transition-all"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-light text-terracotta-dark flex items-center justify-center shrink-0 border border-terracotta/20">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase bg-terracotta-light text-terracotta-dark px-2 py-0.5 rounded font-bold">
                Spatial Feasibility Warning
              </span>
              <h3 className="font-display text-xl font-bold text-ink mt-1">
                Requested Brief Exceeds Standard Capacity
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                Our heuristic spatial engine detected potential congestion in this plot configuration.
              </p>
            </div>
          </div>

          {/* Metric Comparison Box */}
          <div className="grid grid-cols-2 gap-3 p-3.5 bg-sand-100/70 rounded-xl border border-sand-200 mb-5 text-xs font-mono">
            <div>
              <span className="text-ink-muted block text-[10px]">Estimated Space Required</span>
              <span className="font-bold text-ink text-sm">~{requiredSqFt.toLocaleString('en-IN')} sq.ft</span>
            </div>
            <div>
              <span className="text-ink-muted block text-[10px]">Optimal Plot Capacity</span>
              <span className="font-bold text-ink text-sm">~{availableSqFt.toLocaleString('en-IN')} sq.ft</span>
            </div>
          </div>

          {/* Warning Items */}
          <div className="space-y-2.5 mb-6">
            {warnings.map((warn, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-ink-muted bg-linen p-3 rounded-lg border border-sand-200">
                <span className="text-terracotta font-bold">•</span>
                <span className="leading-relaxed">{warn}</span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-sand-50 rounded-lg border border-sand-200 text-[11px] text-ink-muted flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-sage-600 shrink-0" />
            <span>This is heuristic spatial validation, not a certified municipal bylaw check.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-sand-100/60 px-6 py-4 border-t border-sand-200 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            onClick={onEditRequirements}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-sand-100 text-ink text-xs font-semibold rounded-xl border border-sand-300 transition-all shadow-subtle"
          >
            <Edit2 className="w-3.5 h-3.5 text-sand-500" />
            <span>Edit Requirements</span>
          </button>
          
          <button
            type="button"
            onClick={onProceedAnyway}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-sage-500 hover:bg-sage-600 text-white text-xs font-semibold rounded-xl shadow-subtle transition-all"
          >
            <span>Generate Best Possible Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
