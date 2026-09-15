import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  MoreVertical, 
  Edit3, 
  Copy, 
  Trash2, 
  ArrowUpRight, 
  Compass, 
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';
import { formatInrShorthand } from '../../lib/currency.js';
import { formatDimension } from '../../lib/units.js';

export const ProjectCard = ({
  project,
  onRename,
  onDuplicate,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const plotW = project.plot?.width || 30;
  const plotL = project.plot?.length || 50;
  const unit = project.plot?.unit || 'ft';
  const floors = project.plot?.floors || 2;
  const bhk = project.requirements?.bhk || 3;
  const budget = project.requirements?.budgetInr || 3500000;
  const area = project.builtUpAreaSqFt || (plotW * plotL * 1.1);

  const floorLabel = floors === 1 ? 'Ground Only' : floors === 2 ? 'G+1 Floor' : 'G+2 Floor';

  return (
    <div className="group relative bg-white rounded-2xl border border-sand-300 hover:border-sage-400 p-6 shadow-subtle hover:shadow-elevated transition-all flex flex-col justify-between">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-semibold border border-sage-200">
                {bhk} BHK • {floorLabel}
              </span>
              {project.id === 'sharma-residence' && (
                <span className="text-[10px] font-medium bg-sand-200 text-ink px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-sage-700" />
                  Seed Demo
                </span>
              )}
            </div>
            <h3 className="font-display text-lg font-bold text-ink group-hover:text-sage-700 transition-colors pt-1">
              <Link to={`/projects/${project.id}`} className="hover:underline focus:outline-none">
                {project.name}
              </Link>
            </h3>
          </div>

          {/* Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
              aria-label="Project Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl shadow-elevated border border-sand-300 py-1.5 z-30 animate-in fade-in-50 duration-100">
                  <Link
                    to={`/projects/${project.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="w-full px-3 py-1.5 text-xs text-ink hover:bg-sand-100 flex items-center gap-2"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-sage-600" />
                    <span>Open</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRename(project);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-ink hover:bg-sand-100 flex items-center gap-2 text-left"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sand-500" />
                    <span>Rename</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(project.id);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-ink hover:bg-sand-100 flex items-center gap-2 text-left"
                  >
                    <Copy className="w-3.5 h-3.5 text-sand-500" />
                    <span>Duplicate</span>
                  </button>
                  <div className="my-1 border-t border-sand-200" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(project);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-terracotta hover:bg-terracotta-light/30 flex items-center gap-2 text-left"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Location & Dimensions info */}
        <div className="space-y-2 text-xs text-ink-muted mb-5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sand-400 shrink-0" />
            <span className="truncate">{project.location || 'India'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="bg-linen px-2 py-0.5 rounded border border-sand-200 text-ink font-medium">
              {formatDimension(plotW, unit)} × {formatDimension(plotL, unit)}
            </span>
            <span className="text-sand-400">•</span>
            <span className="capitalize">{project.plot?.facing || 'North'} Facing</span>
          </div>
        </div>

        {/* Mini Floor Plan Blueprint Thumbnail */}
        <div className="h-28 bg-linen rounded-xl border border-sand-200 p-2.5 flex items-center justify-center relative overflow-hidden mb-5 bg-blueprint-grid">
          <div className="w-full h-full border border-dashed border-sage-300 rounded-lg flex flex-col justify-between p-2 bg-white/60">
            <div className="flex justify-between items-center text-[10px] text-ink-muted font-medium">
              <span>{plotW}&apos;</span>
              <span className="uppercase text-sage-700 font-bold text-[9px]">Road Side ({project.plot?.roadSide || 'N'})</span>
              <span>{plotW}&apos;</span>
            </div>
            <div className="grid grid-cols-3 gap-1 h-12">
              <div className="bg-sage-100 rounded border border-sage-200 flex items-center justify-center text-[8px] font-semibold text-sage-800">
                Bed 1
              </div>
              <div className="bg-sand-100 rounded border border-sand-200 flex items-center justify-center text-[8px] font-semibold text-ink-muted">
                Living
              </div>
              <div className="bg-terracotta-light/60 rounded border border-terracotta/20 flex items-center justify-center text-[8px] font-semibold text-terracotta-dark">
                Kitchen
              </div>
            </div>
            <div className="flex justify-between items-center text-[9px] text-ink-muted font-medium">
              <span>Length: {plotL}&apos;</span>
              <span>~{Math.round(area)} sq.ft</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] text-ink-muted block uppercase font-medium">Target Budget</span>
          <span className="font-display font-bold text-ink text-sm flex items-center">
            {formatInrShorthand(budget)}
          </span>
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sage-700 group-hover:text-sage-800 transition-colors"
        >
          <span>Open Plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </div>
  );
};
