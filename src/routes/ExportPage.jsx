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
  Compass,
  Layers,
  FileCode,
  Box
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
  const [isExportingDxf, setIsExportingDxf] = useState(false);
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

  const handleDownloadDxf = async () => {
    setIsExportingDxf(true);
    try {
      await ExportServiceInstance.downloadDxf({ project });
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0284C7', '#38BDF8', '#0F172A', '#F59E0B'],
      });
      showToast('Downloaded AutoCAD .DXF Drawing File!');
    } catch (err) {
      console.error('DXF export error:', err);
      showToast('Error generating DXF file');
    } finally {
      setIsExportingDxf(false);
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
                CAD & Blueprint Publishing
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
                Export Project Architectural Package
              </h1>
              <p className="text-xs text-ink-muted mt-1 font-mono">
                Generate professional AutoCAD DXF drawings, client PDF summaries, and CAD blueprints
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            
            {/* AutoCAD DXF Export Card */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-700 shadow-elevated flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <FileCode className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
                    AutoCAD / BIM
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-white">
                  AutoCAD DXF (.dxf)
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Layered 2D CAD vector drawing (`WALLS`, `DOORS`, `WINDOWS`, `FURNITURE`, `ROOM_LABELS`, `DIMENSIONS`) ready for AutoCAD, Revit, ArchiCAD & SketchUp.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDxf}
                disabled={isExportingDxf}
                className="w-full py-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-lg hover:shadow-sky-500/25 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingDxf ? 'Generating DXF...' : 'Export AutoCAD (.dxf)'}</span>
              </button>
            </div>

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
                  Printable A4 report containing client brief specs, full room schedules, INR cost breakdown, preliminary BOQ, and legal disclaimers.
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

            {/* Printable Blueprint Sheet Card */}
            <div className="p-6 bg-linen rounded-2xl border border-sand-300 shadow-subtle flex flex-col justify-between space-y-4">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sand-100 text-slate-700 flex items-center justify-center mb-3">
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
              <span>Architectural Drawing Preview</span>
            </h3>
            <span className="text-[10px] font-mono text-ink-muted">Standard Title Block</span>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 space-y-5 text-xs text-white">
            <div className="flex justify-between items-start pb-3 border-b border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-sky-400 block tracking-wider">PROJECT TITLE</span>
                <h4 className="font-display text-lg font-bold text-white">{project.name}</h4>
                <p className="text-slate-400">{project.location} • {project.plot?.width}×{project.plot?.length} ft • {project.requirements?.bhk} BHK</p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-400 block uppercase">CAD Export Layers</span>
                <span className="font-mono text-xs text-sky-300 font-bold">7 Structured Layers</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 block">Layer 1</span>
                <span className="font-bold text-white">WALLS (Double-line)</span>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 block">Layer 2</span>
                <span className="font-bold text-red-400">DOORS (90° Arcs)</span>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 block">Layer 3</span>
                <span className="font-bold text-sky-400">WINDOWS (Frames)</span>
              </div>
              <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className="text-[9px] text-slate-400 block">Layer 4</span>
                <span className="font-bold text-green-400">FURNITURE (Staged)</span>
              </div>
            </div>
          </div>

          {/* Mandatory Legal & Professional Review Disclaimer */}
          <div className="p-4 bg-sand-50 rounded-xl border border-sand-200 flex items-start gap-3 text-xs text-ink-muted">
            <ShieldAlert className="w-4 h-4 text-terracotta-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mandatory Conceptual Disclaimer:</strong> All exported DXF drawings, 3D visualizations, material takeoffs, and construction estimates generated by Planova are conceptual design models and require formal verification by a registered architect and licensed civil/structural engineer before construction tenders or municipal sanctions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
