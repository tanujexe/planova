import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Sparkles,
  ChevronDown,
  Layout, 
  Box, 
  IndianRupee, 
  ScrollText, 
  Download, 
  Plus, 
  Layers,
  MessageSquare,
  Compass,
  Check
} from 'lucide-react';
import clsx from 'clsx';
import { useProjectStore } from '../../store/useProjectStore.js';

export const AppShell = ({ children }) => {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, activeProject, loadProjects, loadProject } = useProjectStore();

  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const isProjectView = Boolean(projectId && location.pathname.startsWith('/projects/'));
  const currentProjectName = activeProject?.name || projects.find(p => p.id === projectId)?.name || 'Spano Ka Ghar';

  const navItems = isProjectView
    ? [
        { label: 'Overview', path: `/projects/${projectId}`, icon: Layers, end: true },
        { label: '2D Workspace', path: `/projects/${projectId}/design`, icon: Layout },
        { label: '3D Concept', path: `/projects/${projectId}/3d`, icon: Box },
        { label: 'Cost & Budget', path: `/projects/${projectId}/cost`, icon: IndianRupee },
        { label: 'BOQ', path: `/projects/${projectId}/boq`, icon: ScrollText },
        { label: 'Export', path: `/projects/${projectId}/export`, icon: Download },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-linen text-ink font-sans selection:bg-sand-300">
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sand-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Left: Logo & Studio Tab & Project Selector */}
            <div className="flex items-center gap-5 sm:gap-7">
              {/* Drafted Logo */}
              <Link to="/" className="flex items-center gap-1.5 focus:outline-none group">
                <span className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-ink group-hover:text-black transition-colors">
                  Drafted
                </span>
              </Link>

              {/* My Studio Active Tab */}
              <Link
                to="/"
                className={clsx(
                  "relative flex items-center gap-2 py-5 text-sm font-semibold transition-colors",
                  location.pathname === '/' || !isProjectView
                    ? "text-ink after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-ink"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                <Home className="w-4 h-4 stroke-[2]" />
                <span>My Studio</span>
              </Link>

              {/* Subtle Divider */}
              <div className="hidden md:block h-6 w-px bg-sand-300" />

              {/* Project Selector */}
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setProjectMenuOpen(!projectMenuOpen)}
                  className="flex flex-col text-left py-1 px-2 rounded-lg hover:bg-sand-100 transition-colors focus:outline-none group"
                >
                  <span className="text-[10px] tracking-wider uppercase font-mono text-ink-muted leading-none">
                    PROJECT
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-xs text-ink mt-0.5 group-hover:text-black">
                    <span className="max-w-[160px] truncate">{currentProjectName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-muted group-hover:text-ink transition-transform" />
                  </span>
                </button>

                {projectMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-20" 
                      onClick={() => setProjectMenuOpen(false)} 
                    />
                    <div className="absolute left-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-elevated border border-sand-300 py-1.5 z-30 animate-in fade-in-50 duration-100">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-ink-muted border-b border-sand-200">
                        Switch Project
                      </div>
                      <div className="max-h-52 overflow-y-auto py-1">
                        {projects.map((p) => {
                          const isCurrent = p.id === projectId;
                          return (
                            <button
                              key={p.id}
                              onClick={() => {
                                setProjectMenuOpen(false);
                                navigate(`/projects/${p.id}`);
                              }}
                              className={clsx(
                                "w-full px-3 py-2 text-xs flex items-center justify-between text-left hover:bg-sand-100 transition-colors",
                                isCurrent ? "font-bold text-ink bg-sand-50" : "text-ink-muted hover:text-ink"
                              )}
                            >
                              <span className="truncate">{p.name}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5 text-terracotta shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                      <div className="pt-1 border-t border-sand-200">
                        <Link
                          to="/projects/new"
                          onClick={() => setProjectMenuOpen(false)}
                          className="w-full px-3 py-2 text-xs font-semibold text-terracotta hover:bg-terracotta-50 flex items-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create New Project</span>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Learn Button, Credit Counter, User Avatar */}
            <div className="flex items-center gap-3">
              {/* Learn Button */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sand-50 text-ink text-xs font-medium rounded-lg border border-sand-300 shadow-subtle transition-all"
              >
                <BookOpen className="w-3.5 h-3.5 text-ink-muted" />
                <span>Learn</span>
              </a>

              {/* Credit pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-sand-300 rounded-lg shadow-subtle text-xs font-medium text-ink">
                <Sparkles className="w-3.5 h-3.5 text-ink-muted" />
                <div className="w-10 h-1.5 bg-sand-200 rounded-full overflow-hidden flex">
                  <div className="w-4/5 bg-ink rounded-full" />
                </div>
                <span className="font-mono text-[11px]">4 left</span>
              </div>

              {/* User Avatar */}
              <div 
                className="w-8 h-8 rounded-full bg-terracotta text-white font-semibold text-xs flex items-center justify-center shadow-subtle cursor-pointer select-none hover:opacity-90 transition-opacity"
                title="Tanuj (Homebuyer)"
              >
                T
              </div>
            </div>
          </div>
        </div>

        {/* Project View Subnav */}
        {isProjectView && (
          <div className="border-t border-sand-200 bg-sand-50/70 px-4 sm:px-6 lg:px-8 overflow-x-auto flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      isActive
                        ? 'bg-dark text-white shadow-subtle'
                        : 'text-ink-muted hover:text-ink hover:bg-sand-200'
                    )
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Floating Bottom-Right Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-50">
        {chatOpen && (
          <div className="mb-3 w-80 bg-white rounded-2xl shadow-elevated border border-sand-300 p-4 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-dark text-white flex items-center justify-center text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs text-ink">Drafted Assistant</span>
              </div>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-xs text-ink-muted hover:text-ink"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-ink-muted py-3 leading-relaxed">
              Need help customizing your architectural floor plans, modifying dimensions, or exporting high-res DWG/PDF blueprints?
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Drafted..." 
                className="flex-1 text-xs px-3 py-2 bg-sand-50 border border-sand-300 rounded-lg focus:outline-none focus:border-dark"
              />
              <button className="px-3 py-2 bg-dark text-white rounded-lg text-xs font-semibold hover:bg-dark-hover transition-colors">
                Send
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-12 h-12 bg-dark hover:bg-dark-hover text-white rounded-full shadow-elevated flex items-center justify-center transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          title="Drafted Support & Feedback"
        >
          <MessageSquare className="w-5 h-5 fill-white/10" />
        </button>
      </div>
    </div>
  );
};

