import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  RotateCcw,
  Compass,
  Layers,
  ShieldCheck,
  ArrowRight,
  Layout,
  IndianRupee,
  Eye
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { ThreeScene } from '../components/visualization/ThreeScene.jsx';
import { Fallback2DView } from '../components/visualization/Fallback2DView.jsx';

export const VisualizationPage = () => {
  const { projectId } = useParams();
  const { activeProject, loadProject, isLoading } = useProjectStore();
  const [visibleFloorLevel, setVisibleFloorLevel] = useState('all');
  const [webGlFailed, setWebGlFailed] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const project = activeProject || {
    plot: { width: 30, length: 50, floors: 2 },
    design: { floors: [] },
  };

  const plan = project.design || {
    plot: project.plot || { width: 30, length: 50 },
    floors: [],
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-blueprint-grid">
        <div className="text-center space-y-3">
          <Compass className="w-8 h-8 text-terracotta-500 animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading 3D procedural meshes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-linen overflow-hidden h-[calc(100vh-4rem)] min-h-[600px]">

      {/* Sub-header Toolbar */}
      <div className="bg-white border-b border-sand-300 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 z-10">

        {/* Left: Floor Level Isolation */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted hidden sm:inline">View Floor:</span>
          <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200">
            <button
              onClick={() => setVisibleFloorLevel('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${visibleFloorLevel === 'all'
                  ? 'bg-terracotta-500 text-white shadow-subtle'
                  : 'text-ink-muted hover:text-ink'
                }`}
            >
              All Floors (G+1)
            </button>
            {plan.floors?.map((f) => (
              <button
                key={f.level}
                onClick={() => setVisibleFloorLevel(f.level)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${visibleFloorLevel === f.level
                    ? 'bg-terracotta-500 text-white shadow-subtle'
                    : 'text-ink-muted hover:text-ink'
                  }`}
              >
                {f.label || `Level ${f.level}`}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Quick Links & Viewport Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setWebGlFailed(!webGlFailed)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg text-xs font-semibold border border-sand-300 transition-colors"
            title="Toggle between 3D WebGL and 2D Safe Mode"
          >
            <Eye className="w-3.5 h-3.5 text-terracotta-600" />
            <span>{webGlFailed ? 'Switch to 3D View' : '2D Fallback Mode'}</span>
          </button>

          <Link
            to={`/projects/${project.id}/design`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg text-xs font-semibold border border-sand-300 transition-colors"
          >
            <Layout className="w-3.5 h-3.5 text-terracotta-600" />
            <span className="hidden sm:inline">Edit in 2D</span>
          </Link>

          <Link
            to={`/projects/${project.id}/cost`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-lg text-xs font-semibold shadow-subtle transition-colors"
          >
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Check Cost</span>
          </Link>
        </div>
      </div>

      {/* 3D Viewport or Fallback */}
      <div className="flex-1 relative overflow-hidden h-[calc(100vh-7.5rem)] min-h-[650px] w-full">
        {webGlFailed ? (
          <Fallback2DView floorPlan={plan} projectId={project.id} />
        ) : (
          <ThreeScene
            floorPlan={plan}
            visibleFloorLevel={visibleFloorLevel}
            onError={() => setWebGlFailed(true)}
          />
        )}
      </div>

    </div>
  );
};

