import React from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Layout, 
  Box, 
  IndianRupee, 
  Download, 
  CheckCircle2,
  Compass
} from 'lucide-react';

export const LearnModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#EAE6DF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-[#EAE6DF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-neutral-900">
                Drafted Architectural Studio Guide
              </h3>
              <p className="text-xs text-neutral-500">
                How to design, iterate, visualize, and estimate your home
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#EAE6DF] hover:bg-[#DDD7CD] flex items-center justify-center text-neutral-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6 text-sm text-neutral-700">
          
          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">1</span>
              Explore Design Directions
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed pl-7">
              Each project generates 3 deterministic, constraint-validated concepts: <strong>Balanced Layout</strong>, <strong>Open Living</strong>, and <strong>Vastu Priority</strong>. You can switch between concepts at any time from the Studio Hub or banner.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">2</span>
              Interactive 2D Blueprint Studio
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed pl-7">
              Click <strong>"Open 2D Studio"</strong> to directly drag rooms, resize walls, and stage furniture. The built-in spatial constraint engine prevents collisions and out-of-bounds errors with snapback protection. Use <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[11px] font-mono">Ctrl+Z</kbd> and <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[11px] font-mono">Ctrl+Y</kbd> to undo and redo up to 20 snapshots.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">3</span>
              Procedural 3D Model & Walkthrough
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed pl-7">
              Switch to the <strong>3D Concept</strong> view to inspect the exterior foundation slab, walls, and 3D furniture massing. Use camera presets (Isometric, Top-Down, Perspective) or enter the first-person walkthrough with WASD keys.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">4</span>
              Natural Language Architectural Assistant
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed pl-7">
              Click the blue floating chat button at the bottom right to make complex multi-part architectural requests such as:
              <em className="block my-1.5 p-2 bg-[#FAF8F5] rounded-xl border border-[#EAE6DF] font-serif text-neutral-900">
                “Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.”
              </em>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-neutral-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center">5</span>
              Construction Costing, BOQ & CAD Export
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed pl-7">
              View real-time ₹/sq.ft indicative estimates across 7 civil categories, inspect the preliminary Bill of Quantities (cement, TMT steel, bricks, tiles), and export professional client-ready A4 PDFs or layered AutoCAD .DXF drawings.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#EAE6DF] bg-[#FAF8F5] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            Got it, Let's Design
          </button>
        </div>

      </div>
    </div>
  );
};
