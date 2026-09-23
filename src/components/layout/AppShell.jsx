import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  BookOpen, 
  Zap, 
  Layers, 
  Layout, 
  Box, 
  IndianRupee, 
  ScrollText, 
  Download, 
  Check, 
  Home,
  Menu,
  X
} from 'lucide-react';
import clsx from 'clsx';
import { useProjectStore } from '../../store/useProjectStore.js';
import { LearnModal } from '../studio/LearnModal.jsx';

export const AppShell = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, activeProject, loadProjects, loadProject } = useProjectStore();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Extract projectId from location.pathname
  const match = location.pathname.match(/^\/projects\/([a-zA-Z0-9_-]+)/);
  const matchedId = match ? match[1] : null;
  const currentProjectId = matchedId && matchedId !== 'new' ? matchedId : (activeProject?.id || null);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (currentProjectId && (!activeProject || activeProject.id !== currentProjectId)) {
      loadProject(currentProjectId);
    }
  }, [currentProjectId, activeProject, loadProject]);

  // Click outside to close project dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProjectDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isProjectView = Boolean(currentProjectId && location.pathname.startsWith('/projects/'));

  const navItems = isProjectView
    ? [
        { label: 'My Studio', path: `/projects/${currentProjectId}`, icon: Building2, end: true },
        { label: '2D Blueprint', path: `/projects/${currentProjectId}/design`, icon: Layout },
        { label: '3D Walkthrough', path: `/projects/${currentProjectId}/3d`, icon: Box },
        { label: 'Cost & Budget', path: `/projects/${currentProjectId}/cost`, icon: IndianRupee },
        { label: 'BOQ Takeoff', path: `/projects/${currentProjectId}/boq`, icon: ScrollText },
        { label: 'Export PDF/DXF', path: `/projects/${currentProjectId}/export`, icon: Download },
      ]
    : [];

  const handleSelectProject = (projId) => {
    setIsProjectDropdownOpen(false);
    loadProject(projId);
    navigate(`/projects/${projId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F5F0] text-neutral-900 font-sans selection:bg-neutral-200">
      
      {/* Drafted Studio Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE6DF]">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Brand Logo & Studio Tab & Project Selector */}
            <div className="flex items-center gap-4 sm:gap-6">
              
              {/* Drafted Logo (Matching Screenshots Serif Branding) */}
              <Link 
                to={currentProjectId ? `/projects/${currentProjectId}` : "/"} 
                className="flex items-center gap-2 group focus:outline-hidden"
              >
                <span className="font-serif text-2xl font-bold tracking-tight text-neutral-950">
                  Drafted
                </span>
              </Link>

              {/* Thin Vertical Divider */}
              <div className="h-6 w-px bg-[#E5E0D8] hidden sm:block" />

              {/* My Studio Tab Button */}
              <Link
                to={currentProjectId ? `/projects/${currentProjectId}` : "/"}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors",
                  location.pathname === `/projects/${currentProjectId}` || location.pathname === '/'
                    ? "text-neutral-950 bg-[#F5F2EC]"
                    : "text-neutral-600 hover:text-neutral-950 hover:bg-[#FAF8F5]"
                )}
              >
                <Building2 className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>My Studio</span>
              </Link>

              {/* Project Selector Dropdown matching "PROJECT: dfgg ▾" in Screenshot 1 & 2 */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-[#F5F2EC] transition-colors border border-transparent hover:border-[#EAE6DF] text-left"
                >
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 font-bold leading-tight">
                      Project
                    </span>
                    <div className="flex items-center gap-1 text-xs font-semibold text-neutral-900 leading-tight">
                      <span className="max-w-[120px] sm:max-w-[180px] truncate">
                        {activeProject?.name || 'Select Project'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isProjectDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#EAE6DF] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Your Projects ({projects.length})
                    </div>

                    <div className="max-h-60 overflow-y-auto py-1">
                      {projects.map((p) => {
                        const isActive = p.id === activeProject?.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => handleSelectProject(p.id)}
                            className={clsx(
                              "w-full text-left px-3.5 py-2 text-xs flex items-center justify-between gap-2 hover:bg-[#FAF8F5] transition-colors",
                              isActive ? "font-bold text-neutral-950 bg-[#F5F2EC]/70" : "text-neutral-700"
                            )}
                          >
                            <span className="truncate">{p.name}</span>
                            {isActive && <Check className="w-3.5 h-3.5 text-neutral-950 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="border-t border-[#F2EFE9] mt-1 pt-1.5 px-2">
                      <Link
                        to="/projects/new"
                        onClick={() => setIsProjectDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-[#FAF8F5] rounded-xl transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-neutral-600" />
                        <span>Create New Project</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Middle: "+ New Design" Button matching Screenshot 1 & 2 */}
            <div className="flex items-center gap-3">
              <Link
                to={currentProjectId ? `/projects/${currentProjectId}` : "/projects/new"}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>New Design</span>
              </Link>
            </div>

            {/* Right: Learn Button, Credits Meter & User Avatar */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* "📖 Learn" Guide Button */}
              <button
                onClick={() => setIsLearnModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F2EC] text-neutral-800 rounded-xl text-xs font-semibold border border-[#DDD8CE] transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
                <span>Learn</span>
              </button>

              {/* Usage Credits Meter matching "⚡ ── 5 left" */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-xs font-medium text-neutral-700">
                <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <div className="w-8 h-1 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-neutral-800 rounded-full" />
                </div>
                <span className="text-[11px] font-mono text-neutral-600 font-semibold">5 left</span>
              </div>

              {/* User Avatar Circle "N" */}
              <div 
                className="w-8 h-8 rounded-full bg-[#7C8B99] text-white flex items-center justify-center font-bold text-xs shadow-xs select-none"
                title="Narayan (Architect)"
              >
                N
              </div>

            </div>

          </div>
        </div>

        {/* Feature Sub-Navigation Bar for seamless access to all current capabilities */}
        {isProjectView && (
          <div className="bg-[#FAF8F5] border-t border-[#EAE6DF] px-4 sm:px-6 lg:px-8 py-2">
            <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4 overflow-x-auto">
              <nav className="flex items-center gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        clsx(
                          'whitespace-nowrap flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all',
                          isActive
                            ? 'bg-neutral-950 text-white shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#ECE7DE]'
                        )
                      }
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="hidden xl:flex items-center gap-3 text-[11px] text-neutral-500 font-mono">
                <span>All Indian Vastu & Civil Tools Active</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* Learn Guide Modal */}
      <LearnModal 
        isOpen={isLearnModalOpen} 
        onClose={() => setIsLearnModalOpen(false)} 
      />

    </div>
  );
};

