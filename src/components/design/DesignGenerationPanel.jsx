import React from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Layers, 
  IndianRupee, 
  ShieldCheck,
  RotateCcw,
  Box
} from 'lucide-react';
import { formatInrShorthand } from '../../lib/currency.js';
import { GENERATION_STAGES } from '../../services/generation.js';

export const DesignGenerationPanel = ({
  isGenerating,
  currentStageIndex,
  options,
  selectedOptionId,
  onSelectOption,
  onRegenerate,
}) => {
  // Staged loading screen
  if (isGenerating) {
    return (
      <div className="bg-white rounded-2xl border border-sand-300 p-8 sm:p-12 shadow-elevated text-center max-w-xl mx-auto space-y-6">
        <div className="w-16 h-16 bg-sage-100 text-sage-600 rounded-2xl flex items-center justify-center mx-auto shadow-subtle animate-bounce">
          <Compass className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase bg-sage-100 text-sage-800 px-2.5 py-1 rounded font-bold border border-sage-200">
            AI Layout Generation in Progress
          </span>
          <h3 className="font-display text-2xl font-bold text-ink">
            Crafting Your Indian Home Concepts
          </h3>
          <p className="text-xs text-ink-muted">
            Evaluating zoning, circulation clearances, and Vastu directional orientations...
          </p>
        </div>

        {/* Staged Checklist */}
        <div className="space-y-2.5 text-left max-w-md mx-auto pt-2">
          {GENERATION_STAGES.map((stageText, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                  isCurrent
                    ? 'bg-sage-50 text-sage-900 border border-sage-300 font-semibold shadow-subtle'
                    : isCompleted
                    ? 'text-ink-muted bg-linen border border-transparent'
                    : 'text-sand-400 opacity-60'
                }`}
              >
                <div className="shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-sage-600" />
                  ) : isCurrent ? (
                    <Compass className="w-4 h-4 text-sage-600 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-sand-400 flex items-center justify-center text-[9px] font-mono">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <span className="truncate">{stageText}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Options cards grid
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase bg-sage-100 text-sage-800 px-2.5 py-0.5 rounded font-semibold border border-sage-200">
            3 AI Concepts Ready
          </span>
          <h2 className="font-display text-2xl font-bold text-ink mt-1">
            Choose Your Baseline Concept
          </h2>
          <p className="text-xs text-ink-muted">
            Select an architectural variation to inspect, edit with natural language, and preview in 3D.
          </p>
        </div>

        <button
          onClick={onRegenerate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sand-100 hover:bg-sand-200 text-ink rounded-xl text-xs font-semibold border border-sand-300 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sage-700" />
          <span>Regenerate Layouts</span>
        </button>
      </div>

      {/* 3 Options Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;

          return (
            <div
              key={opt.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all relative ${
                isSelected
                  ? 'border-sage-500 ring-2 ring-sage-500/20 shadow-elevated'
                  : 'border-sand-300 hover:border-sand-400 hover:shadow-subtle'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2.5 right-4 bg-sage-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-subtle flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Design
                </div>
              )}

              <div>
                {/* Header */}
                <div className="mb-4">
                  <span className="text-[10px] uppercase font-bold text-sage-700 bg-sage-50 px-2 py-0.5 rounded border border-sage-200">
                    {opt.concept === 'balanced' ? 'Balanced' : opt.concept === 'open_living' ? 'Open Living' : 'Vastu Priority'}
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink mt-2">
                    {opt.title}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    {opt.tagline}
                  </p>
                </div>

                {/* Mini Blueprint Graphic */}
                <div className="h-28 bg-linen rounded-xl border border-sand-200 p-2.5 flex flex-col justify-between mb-4 bg-blueprint-grid">
                  <div className="flex justify-between items-center text-[10px] text-ink-muted">
                    <span className="font-bold text-ink">~{opt.areaSqFt} sq.ft</span>
                    <span className="text-sage-700 font-semibold">{opt.roomCount} Rooms</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 h-12">
                    <div className="bg-sage-100/90 rounded border border-sage-300/60 flex items-center justify-center text-[8px] font-semibold text-sage-900">
                      Beds
                    </div>
                    <div className="bg-sand-100 rounded border border-sand-300/60 flex items-center justify-center text-[8px] font-semibold text-ink">
                      Living
                    </div>
                    <div className="bg-sage-200/80 rounded border border-sage-300/60 flex items-center justify-center text-[8px] font-semibold text-sage-900">
                      Kitchen
                    </div>
                  </div>
                  <div className="text-[9px] text-ink-muted truncate">
                    {opt.parkingSummary}
                  </div>
                </div>

                {/* Key Attributes */}
                <div className="space-y-2 text-xs mb-5">
                  <div className="p-2 bg-sand-50 rounded-lg border border-sand-200">
                    <span className="text-[10px] font-semibold uppercase text-ink-muted block">Vastu Orientation</span>
                    <span className="text-[11px] text-ink leading-tight block mt-0.5">{opt.vastuNotes}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-linen rounded-lg border border-sand-200">
                    <span className="text-ink-muted text-xs">Est. Construction:</span>
                    <span className="font-display font-bold text-ink text-sm">
                      {formatInrShorthand(opt.estimatedCostInr)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectOption(opt)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-sage-500 hover:bg-sage-600 text-white shadow-subtle'
                    : 'bg-sand-100 hover:bg-sand-200 text-ink border border-sand-300'
                }`}
              >
                <span>{isSelected ? 'Open in 2D Workspace' : 'Select This Concept'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
