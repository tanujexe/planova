import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  IndianRupee, 
  TrendingUp, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Layers,
  Wand2
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { CostingServiceInstance, QUALITY_RATES } from '../services/costing.js';
import { formatInr, formatInrShorthand } from '../lib/currency.js';

export const CostPage = () => {
  const { projectId } = useParams();
  const { activeProject, loadProject, saveActiveProject } = useProjectStore();
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const project = activeProject || {
    plot: { width: 30, length: 50, floors: 2 },
    design: { floors: [] },
    requirements: { quality: 'standard', budgetInr: 3500000 },
  };

  const estimate = CostingServiceInstance.calculateEstimate({
    plan: project.design,
    requirements: project.requirements,
  });

  const optimizations = CostingServiceInstance.proposeOptimizations({
    plan: project.design,
    requirements: project.requirements,
  });

  const handleQualityChange = (newQuality) => {
    const updated = {
      ...project,
      requirements: {
        ...project.requirements,
        quality: newQuality,
      },
    };
    saveActiveProject(updated);
    showToast(`Updated to ${newQuality.toUpperCase()} finish tier (@ ₹${QUALITY_RATES[newQuality]}/sq.ft)`);
  };

  const handleApplyOptimization = (opt) => {
    if (opt.action === 'setQualityStandard') {
      handleQualityChange('standard');
    } else if (opt.action === 'setQualityEconomy') {
      handleQualityChange('economy');
    } else if (opt.action === 'compactSpaces') {
      const updatedPlan = structuredClone(project.design);
      updatedPlan.floors.forEach((f) => {
        f.rooms.forEach((r) => {
          if (!r.required && (r.type === 'foyer' || r.type === 'balcony' || r.type === 'utility')) {
            r.height = Math.max(5, r.height - 1);
          }
        });
      });
      let totalArea = 0;
      updatedPlan.floors.forEach(f => f.rooms.forEach(r => totalArea += (r.width * r.height)));
      updatedPlan.builtUpAreaSqFt = Math.round(totalArea);

      saveActiveProject({ ...project, design: updatedPlan });
      showToast('Compacted non-core space margins by ~8%');
    }
  };

  return (
    <div className="flex-1 bg-blueprint-grid py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-sage-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Hero Estimate Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-sand-200">
            <div>
              <span className="text-[10px] font-mono uppercase bg-sage-100 text-sage-800 px-2.5 py-1 rounded font-bold border border-sage-200">
                Indicative Indian Construction Cost
              </span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink mt-2">
                {formatInr(estimate.totalEstimatedCost)}
              </h1>
              <p className="text-xs text-ink-muted mt-1 font-mono">
                {estimate.builtUpAreaSqFt} sq.ft total built-up @ ₹{estimate.ratePerSqFt} / sq.ft ({estimate.qualityTier} tier)
              </p>
            </div>

            {/* Target Budget Comparison Card */}
            <div className={`p-4 rounded-xl border text-right min-w-[200px] ${
              estimate.isOverBudget 
                ? 'bg-terracotta-light border-terracotta/30' 
                : 'bg-sage-50 border-sage-200'
            }`}>
              <span className="text-[10px] text-ink-muted uppercase font-mono block">Client Target Budget</span>
              <span className="font-display text-xl font-bold text-ink">
                {formatInr(estimate.targetBudget)}
              </span>
              <div className="mt-1">
                {estimate.isOverBudget ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-terracotta-dark">
                    <AlertTriangle className="w-3 h-3" />
                    +{formatInrShorthand(estimate.budgetGap)} above target
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sage-800">
                    <CheckCircle2 className="w-3 h-3 text-sage-600" />
                    {formatInrShorthand(Math.abs(estimate.budgetGap))} within budget
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quality Tier Selector */}
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-2">
              Select Construction & Finish Quality Tier:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'economy', label: 'Economy Tier', rate: '₹1,500/sq.ft', desc: 'Basic standard tiles, flush doors & standard wiring' },
                { val: 'standard', label: 'Standard Tier', rate: '₹1,900/sq.ft', desc: 'Vitrified flooring, modular electrical, teak frame' },
                { val: 'premium', label: 'Premium Tier', rate: '₹2,500/sq.ft', desc: 'Italian marble look, UPVC windows & branded fixtures' },
              ].map((tier) => (
                <button
                  key={tier.val}
                  type="button"
                  onClick={() => handleQualityChange(tier.val)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    estimate.qualityTier === tier.val
                      ? 'bg-sage-500 text-white border-sage-600 shadow-subtle'
                      : 'bg-linen border-sand-200 text-ink hover:bg-sand-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs capitalize">{tier.label}</span>
                    <span className={`text-[10px] font-mono font-semibold ${
                      estimate.qualityTier === tier.val ? 'text-white/90' : 'text-sage-800 bg-sage-100 px-1.5 py-0.2 rounded'
                    }`}>
                      {tier.rate}
                    </span>
                  </div>
                  <p className={`text-[10px] mt-1 line-clamp-2 ${
                    estimate.qualityTier === tier.val ? 'text-white/80' : 'text-ink-muted'
                  }`}>
                    {tier.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Optimization Proposals (if over budget or suggestions available) */}
        {optimizations.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-sand-300 shadow-subtle space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sage-100 text-sage-700 flex items-center justify-center">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-ink">
                  Budget Optimization Recommendations
                </h3>
                <p className="text-xs text-ink-muted">
                  Opt-in strategies to reduce construction expenditure and bridge the budget gap
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {optimizations.map((opt, i) => (
                <div
                  key={i}
                  className="p-4 bg-linen rounded-xl border border-sand-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-display font-bold text-xs text-ink">
                        {opt.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-sage-800 bg-sage-100 px-2 py-0.5 rounded border border-sage-200">
                        Save ~{formatInrShorthand(opt.savings)}
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-muted leading-relaxed mb-4">
                      {opt.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleApplyOptimization(opt)}
                    className="w-full py-2 bg-white hover:bg-sand-100 text-ink text-xs font-semibold rounded-lg border border-sand-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Optimization</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Category Split Breakdown */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <div>
              <h3 className="font-display text-lg font-bold text-ink">
                Indian Residential Construction Breakdown
              </h3>
              <p className="text-xs text-ink-muted">
                Category-wise allocation based on typical Indian urban residential building benchmarks
              </p>
            </div>
            <Link
              to={`/projects/${project.id}/boq`}
              className="text-xs font-semibold text-sage-700 hover:text-sage-800 flex items-center gap-1"
            >
              <span>View Materials BOQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {estimate.breakdown.map((item) => (
              <div key={item.id} className="p-3.5 bg-linen rounded-xl border border-sand-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-ink">{item.label}</span>
                    <p className="text-[10px] text-ink-muted">{item.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-ink text-sm block">
                      {formatInr(item.amount)}
                    </span>
                    <span className="text-[10px] font-mono text-sage-800 bg-sage-100 px-1.5 py-0.2 rounded font-semibold">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full bg-sand-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sage-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer Footer */}
          <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 flex items-start gap-3 text-xs text-ink-muted">
            <ShieldAlert className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Indicative Planning Estimate:</strong> Calculated automatically from built-up area and typical city benchmarks. Actual project execution costs depend on local soil bearing capacity, structural design steel tonnage, contractor margins, and specific luxury material selections.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
