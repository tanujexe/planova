import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Sparkles, 
  Compass, 
  Layers, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { ProjectCard } from '../components/project/ProjectCard.jsx';
import { EmptyState } from '../components/project/EmptyState.jsx';
import { ConfirmModal } from '../components/feedback/ConfirmModal.jsx';
import { RenameModal } from '../components/project/RenameModal.jsx';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    loadProjects, 
    duplicateProject, 
    renameProject, 
    deleteProject, 
    resetDemoProject 
  } = useProjectStore();

  const [projectToRename, setProjectToRename] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSeedDemo = () => {
    resetDemoProject();
    showToast('Loaded Sharma Residence demo project!');
  };

  const handleDuplicate = (id) => {
    const cloned = duplicateProject(id);
    if (cloned) {
      showToast(`Duplicated as "${cloned.name}"`);
    }
  };

  const handleRenameConfirm = (newName) => {
    if (projectToRename) {
      renameProject(projectToRename.id, newName);
      setProjectToRename(null);
      showToast('Project renamed successfully');
    }
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      showToast('Project deleted');
    }
  };

  return (
    <div className="flex-1 bg-blueprint-grid py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-sage-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Welcome Hero Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#EAE6DF] shadow-xs relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest bg-[#F5F2EC] text-neutral-600 px-3 py-1 rounded-full font-semibold border border-[#EAE6DF]">
              AI Architectural Studio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 leading-tight">
              Design your home from brief to blueprint, 3D, and cost in seconds.
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Explore multiple design directions, iterate on room bubbles, customize interactive 2D blueprints with furniture staging, view 3D massing, and compute ₹/sq.ft Indian construction budgets.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-xs sm:text-sm font-semibold transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                Create New Project
              </Link>
              <button
                onClick={() => {
                  resetDemoProject();
                  navigate('/projects/sharma-residence');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#F5F2EC] hover:bg-[#EAE6DF] text-neutral-900 rounded-2xl text-xs sm:text-sm font-semibold transition-all"
              >
                <Layers className="w-4 h-4 text-neutral-700" />
                Open Sharma Residence (Studio Demo)
              </button>
            </div>
          </div>
        </div>

        {/* Projects Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-neutral-950">Your Studio Projects</h2>
            <p className="text-xs text-neutral-500">Manage your saved residential briefs and active designs</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDemo}
              className="text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F5F2EC] border border-[#DDD7CD] transition-colors"
              title="Reset Sharma Residence to original demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-600" />
              <span>Reset Demo</span>
            </button>
            <Link
              to="/projects/new"
              className="text-xs font-semibold text-white bg-neutral-950 hover:bg-neutral-800 flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Project</span>
            </Link>
          </div>
        </div>

        {/* Projects Grid or Empty State */}
        {projects.length === 0 ? (
          <EmptyState onSeedDemo={handleSeedDemo} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onRename={(p) => setProjectToRename(p)}
                onDuplicate={handleDuplicate}
                onDelete={(p) => setProjectToDelete(p)}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <RenameModal
          isOpen={Boolean(projectToRename)}
          initialName={projectToRename?.name || ''}
          onRename={handleRenameConfirm}
          onCancel={() => setProjectToRename(null)}
        />

        <ConfirmModal
          isOpen={Boolean(projectToDelete)}
          title={`Delete "${projectToDelete?.name}"?`}
          message="Are you sure you want to delete this project? All associated floor plans, custom adjustments, and cost estimates will be permanently removed from your local storage."
          confirmText="Delete Project"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setProjectToDelete(null)}
          isDestructive={true}
        />

      </div>
    </div>
  );
};
