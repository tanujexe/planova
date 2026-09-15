import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Layers, 
  ArrowRight, 
  Layout, 
  Box, 
  IndianRupee, 
  ScrollText, 
  Download,
  MapPin,
  Compass,
  Sparkles,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';
import { DesignGenerationPanel } from '../components/design/DesignGenerationPanel.jsx';
import { GenerationService } from '../services/generation.js';

export const ProjectOverviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { activeProject, loadProject, saveActiveProject, isLoading } = useProjectStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  // Auto-generate if no design options exist
  useEffect(() => {
    if (activeProject && (!activeProject.designOptions || activeProject.designOptions.length === 0)) {
      triggerGeneration();
    }
  }, [activeProject]);

  const triggerGeneration = async () => {
    if (!activeProject) return;
    setIsGenerating(true);
    setCurrentStageIndex(0);

    try {
      const { options, defaultDesign } = await GenerationService.generate(
        { plot: activeProject.plot, requirements: activeProject.requirements },
        (stageIdx) => setCurrentStageIndex(stageIdx)
      );

      const updated = {
        ...activeProject,
        designOptions: options,
        selectedOptionId: options[0].id,
        design: activeProject.design || defaultDesign,
      };

      saveActiveProject(updated);
    } catch (err) {
      console.error('Error generating design concepts:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (opt) => {
    if (!activeProject) return;

    const updated = {
      ...activeProject,
      selectedOptionId: opt.id,
      design: opt.floorPlan || activeProject.design,
    };

    saveActiveProject(updated);
    navigate(`/projects/${activeProject.id}/design`);
  };

  if (isLoading || !activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-blueprint-grid">
        <div className="text-center space-y-3">
          <Compass className="w-8 h-8 text-sage-600 animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading project blueprint...</p>
        </div>
      </div>
    );
  }

  const project = activeProject;
  const plot = project.plot || { width: 30, length: 50, unit: 'ft', floors: 2, facing: 'north' };
  const req = project.requirements || { bhk: 3, budgetInr: 3500000, vastu: 'basic' };

  return (
    <div className="flex-1 bg-blueprint-grid py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Project Header Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-sand-300 shadow-elevated">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-sand-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-sage-100 text-sage-800 px-2.5 py-0.5 rounded font-semibold border border-sage-200">
                  {req.bhk} BHK • {plot.floors === 1 ? 'Ground' : `G+${plot.floors - 1}`}
                </span>
                <span className="text-[10px] font-mono bg-sand-100 text-ink-muted px-2 py-0.5 rounded border border-sand-200">
                  ID: {project.id}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink pt-1">
                {project.name}
              </h1>
              {project.clientName && (
                <p className="text-xs text-ink-muted">Client: <strong className="text-ink font-medium">{project.clientName}</strong></p>
              )}
              <div className="flex items-center gap-3 text-xs text-ink-muted pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sand-400" />
                  {project.location}
                </span>
                <span>•</span>
                <span className="font-mono">
                  {formatDimension(plot.width, plot.unit)} × {formatDimension(plot.length, plot.unit)}
                </span>
                <span>•</span>
                <span className="capitalize">{plot.facing} Facing</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to={`/projects/${project.id}/design`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs font-semibold shadow-subtle hover:shadow-elevated transition-all"
              >
                <span>Launch 2D Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-sand-200">
            <div className="bg-linen p-3.5 rounded-xl border border-sand-200">
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Plot Area</span>
              <span className="font-display text-lg font-bold text-ink">
                {(plot.width * plot.length).toLocaleString('en-IN')} <span className="text-xs font-normal text-ink-muted">sq.ft</span>
              </span>
            </div>

            <div className="bg-linen p-3.5 rounded-xl border border-sand-200">
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Built-Up Area</span>
              <span className="font-display text-lg font-bold text-ink">
                {project.design?.builtUpAreaSqFt || 1705} <span className="text-xs font-normal text-ink-muted">sq.ft</span>
              </span>
            </div>

            <div className="bg-linen p-3.5 rounded-xl border border-sand-200">
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Target Budget</span>
              <span className="font-display text-lg font-bold text-ink">
                {formatInrShorthand(req.budgetInr)}
              </span>
            </div>

            <div className="bg-linen p-3.5 rounded-xl border border-sand-200">
              <span className="text-[10px] uppercase font-mono text-ink-muted block">Vastu Preference</span>
              <span className="font-display text-lg font-bold text-ink capitalize">
                {req.vastu || 'Basic'}
              </span>
            </div>
          </div>

          {/* Quick Module Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
            <Link
              to={`/projects/${project.id}/design`}
              className="p-3 bg-linen rounded-xl border border-sand-300 hover:border-sage-400 text-xs font-semibold flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-sage-600" />
                <span>2D Workspace</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-sand-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to={`/projects/${project.id}/3d`}
              className="p-3 bg-linen rounded-xl border border-sand-300 hover:border-sage-400 text-xs font-semibold flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-sage-600" />
                <span>3D Concept</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-sand-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to={`/projects/${project.id}/cost`}
              className="p-3 bg-linen rounded-xl border border-sand-300 hover:border-sage-400 text-xs font-semibold flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-sage-600" />
                <span>Cost Breakdown</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-sand-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to={`/projects/${project.id}/boq`}
              className="p-3 bg-linen rounded-xl border border-sand-300 hover:border-sage-400 text-xs font-semibold flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-sage-600" />
                <span>Preliminary BOQ</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-sand-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 AI Concept Options Section */}
        <DesignGenerationPanel
          isGenerating={isGenerating}
          currentStageIndex={currentStageIndex}
          options={project.designOptions || []}
          selectedOptionId={project.selectedOptionId}
          onSelectOption={handleSelectOption}
          onRegenerate={triggerGeneration}
        />

      </div>
    </div>
  );
};
