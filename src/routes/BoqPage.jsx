import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ScrollText, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  IndianRupee,
  Filter,
  ShieldAlert
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { BoqServiceInstance } from '../services/boq.js';
import { formatInr, formatInrShorthand } from '../lib/currency.js';

export const BoqPage = () => {
  const { projectId } = useParams();
  const { activeProject, loadProject } = useProjectStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const project = activeProject || {
    plot: { width: 30, length: 50, floors: 2 },
    design: { floors: [] },
    requirements: { quality: 'standard' },
  };

  const boqItems = BoqServiceInstance.generateBoq({
    plan: project.design,
    requirements: project.requirements,
  });

  const categories = ['All', ...new Set(boqItems.map(item => item.category))];

  const filteredItems = selectedCategory === 'All' 
    ? boqItems 
    : boqItems.filter(item => item.category === selectedCategory);

  const totalBoqCost = boqItems.reduce((acc, item) => acc + item.totalCostInr, 0);

  return (
    <div className="flex-1 bg-blueprint-grid py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* BOQ Header Summary Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sand-200">
            <div>
              <span className="text-[10px] font-mono uppercase bg-sage-100 text-sage-800 px-2.5 py-1 rounded font-bold border border-sage-200">
                Preliminary AI Quantity Takeoff
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Preliminary Bill of Quantities (BOQ)
              </h1>
              <p className="text-xs text-ink-muted mt-1 font-mono">
                Derived algorithmically from {project.design?.builtUpAreaSqFt || 1705} sq.ft total built-up footprint
              </p>
            </div>

            <div className="bg-linen px-5 py-3 rounded-xl border border-sand-200 text-right">
              <span className="text-[10px] text-ink-muted uppercase font-mono block">Estimated Materials Total</span>
              <span className="font-display text-xl font-bold text-ink">
                {formatInr(totalBoqCost)}
              </span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="pt-6 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-ink-muted flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-sand-400" />
              Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-sage-500 text-white shadow-subtle'
                    : 'bg-linen text-ink-muted hover:text-ink border border-sand-200 hover:border-sand-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* BOQ Table */}
        <div className="bg-white rounded-2xl border border-sand-300 shadow-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/80 border-b border-sand-200 text-[11px] font-mono text-ink uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Item & Specification</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold text-right">Approx. Qty</th>
                  <th className="py-3.5 px-4 font-bold text-right">Unit Rate (₹)</th>
                  <th className="py-3.5 px-4 font-bold text-right">Est. Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-linen/60 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-ink block">{item.material}</span>
                      <span className="text-[10px] text-ink-muted font-mono">{item.specification}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-sand-100 text-ink-muted text-[10px] font-medium border border-sand-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-ink">
                      {item.quantity.toLocaleString('en-IN')} <span className="text-[10px] text-ink-muted font-normal">{item.unit}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-ink-muted">
                      {formatInr(item.unitRateInr)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-ink text-sm">
                      {formatInr(item.totalCostInr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Disclaimer */}
          <div className="p-4 bg-sand-50 border-t border-sand-200 flex items-start gap-3 text-xs text-ink-muted">
            <ShieldAlert className="w-4 h-4 text-sage-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Non-Procurement Disclaimer:</strong> Quantities listed above are order-of-magnitude AI approximations intended for preliminary budget understanding and client consultation. Certified procurement tenders require formal structural engineer drawings and bar bending schedules.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
