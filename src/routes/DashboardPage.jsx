import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  Layers, 
  RotateCcw,
  CheckCircle2,
  Compass
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
    <div className="flex-1 bg-linen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-20 z-50 bg-dark text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Welcome Hero Banner */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-sand-300 shadow-subtle relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sand-100 text-ink rounded-lg text-xs font-semibold mb-4 border border-sand-200">
              <Sparkles className="w-3.5 h-3.5 text-terracotta" />
              <span>Architectural AI Studio</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3 leading-tight">
              Design, explore, and draft your residential dreams.
            </h1>
            <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-6">
              Generate structured, editable 2D floor plans, explore conceptual 3D massing, calculate approximate ₹/sq.ft construction costs, and generate preliminary BOQs tailored for Indian plots and living requirements.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-2 px-5 py-3 bg-dark hover:bg-dark-hover text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-subtle hover:shadow-elevated"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Design</span>
              </Link>
              <button
                onClick={() => {
                  resetDemoProject();
                  navigate('/projects/sharma-residence');
                }}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-sand-100 text-ink border border-sand-300 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-subtle"
              >
                <Layers className="w-4 h-4 text-ink-muted" />
                <span>Explore Sharma Residence (Demo)</span>
              </button>
            </div>
          </div>

          {/* Decorative architectural grid element */}
          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
            <Compass className="w-64 h-64 text-ink stroke-[1]" />
          </div>
        </div>

        {/* Projects Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">My Studio Projects</h2>
            <p className="text-xs text-ink-muted">Manage your saved residential briefs and concepts</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSeedDemo}
              className="text-xs font-semibold text-ink-muted hover:text-ink flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-sand-100 border border-sand-300 transition-colors shadow-subtle"
              title="Reset Sharma Residence to original demo state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
              <span>Reset Demo</span>
            </button>
            <Link
              to="/projects/new"
              className="text-xs font-semibold text-white bg-dark hover:bg-dark-hover flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-colors shadow-subtle"
            >
              <Plus className="w-3.5 h-3.5" />
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

