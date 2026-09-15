import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Download, 
  FileText, 
  Image as ImageIcon, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  Printer,
  Copy,
  Building2,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useProjectStore } from '../store/useProjectStore.js';
import { ExportServiceInstance } from '../services/export.js';
import { CostingServiceInstance } from '../services/costing.js';
import { formatInr, formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';

export const ExportPage = () => {
  const { projectId } = useParams();
  const { activeProject, loadProject } = useProjectStore();
  const [isExportingPdf, setIsExportingPdf] = useState(false);
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
    name: 'Sharma Residence',
    clientName: 'Dr. Anand Sharma',
    location: 'Bhopal, Madhya Pradesh',
    plot: { width: 30, length: 50, floors: 2, facing: 'north', roadSide: 'north' },
    design: { floors: [] },
    requirements: { bhk: 3, budgetInr: 3500000, quality: 'standard' },
  };

  const estimate = CostingServiceInstance.calculateEstimate({
    plan: project.design,
    requirements: project.requirements,
  });

  const handleDownloadPdf = () => {
    setIsExportingPdf(true);
    try {
      ExportServiceInstance.downloadPdf({ project });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C08552', '#DFBA9D', '#889682', '#1E261F'],
      });
      showToast('Downloaded Client Concept PDF Summary!');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('Error exporting PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Copied project link to clipboard!');
  };

  return (
    <div className="flex-1 bg-blueprint-grid py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Toast Alert */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-terracotta-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Main Export Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sand-200">
            <div>
              <span className="text-[10px] font-mono uppercase bg-terracotta-100 text-terracotta-800 px-2.5 py-1 rounded font-bold border border-terracotta-200">
                Publish & Export Concept
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Export Project Architectural Package
              </h1>
              <p className="text-xs text-ink-muted mt-1 font-mono">
                Generate professional PDF summaries, drawing exports, and shareable briefs
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sand-100 hover:bg-sand-200 text-ink rounded-xl text-xs font-semibold border border-sand-300 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-terracotta-700" />
                <span>Share Brief</span>
              </button>
            </div>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
            
            {/* PDF Summary Export Card */}
            <div className="p-6 bg-linen rounded-2xl border border-sand-300 shadow-subtle flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Client Concept Summary PDF
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Comprehensive printable A4 report containing client brief specs, full room schedule, INR cost breakdown, preliminary BOQ, and legal disclaimers.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="w-full py-3 bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPdf ? 'Generating PDF...' : 'Download Concept PDF'}</span>
              </button>
            </div>

            {/* PNG Snapshot Export Card */}
            <div className="p-6 bg-linen rounded-2xl border border-sand-300 shadow-subtle flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sand-100 text-terracotta-700 flex items-center justify-center mb-3">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-ink">
                  Printable Blueprint Sheet
                </h3>
                <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                  Standard architectural browser print format with dimension tags, wall boundaries, and zoning legends.
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full py-3 bg-sand-200 hover:bg-sand-300 text-ink rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Document Preview Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-sand-200">
            <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              <span>Live Report Preview</span>
            </h3>
            <span className="text-[10px] font-mono text-ink-muted">A4 Summary Sheet</span>
          </div>

          <div className="p-6 bg-linen/70 rounded-2xl border border-sand-200 space-y-5 text-xs">
            <div className="flex justify-between items-start pb-3 border-b border-sand-300">
              <div>
                <h4 className="font-display text-lg font-bold text-ink">{project.name}</h4>
                <p className="text-ink-muted">{project.location} • {project.plot?.width}×{project.plot?.length} ft • {project.requirements?.bhk} BHK</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-ink-muted block uppercase">Estimated Construction</span>
                <span className="font-display font-bold text-base text-ink">{formatInr(estimate.totalEstimatedCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-2.5 bg-white rounded-lg border border-sand-200">
                <span className="text-[9px] text-ink-muted block">Usable Built-Up</span>
                <span className="font-bold text-ink">~{estimate.builtUpAreaSqFt} sq.ft</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-sand-200">
                <span className="text-[9px] text-ink-muted block">Finish Tier</span>
                <span className="font-bold text-ink capitalize">{project.requirements?.quality || 'Standard'}</span>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-sand-200">
                <span className="text-[9px] text-ink-muted block">Vastu Orientation</span>
                <span className="font-bold text-ink capitalize">{project.requirements?.vastu || 'Basic'}</span>
              </div>
            </div>
          </div>

          {/* Mandatory Legal & Professional Review Disclaimer */}
          <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 flex items-start gap-3 text-xs text-ink-muted">
            <ShieldAlert className="w-4 h-4 text-terracotta-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Conceptual Disclaimer:</strong> All exported drawings, 3D visualizations, material takeoffs, and construction estimates generated by Drafted are conceptual design models and require formal verification by a registered architect and licensed civil/structural engineer before construction tenders or municipal sanctions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

