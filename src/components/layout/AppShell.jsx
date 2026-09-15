import React from 'react';
import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import { 
  Compass, 
  Layout, 
  Box, 
  IndianRupee, 
  ScrollText, 
  Download, 
  PlusCircle, 
  Layers,
  Info,
  ChevronRight
} from 'lucide-react';
import clsx from 'clsx';

export const AppShell = ({ children }) => {
  const { projectId } = useParams();
  const location = useLocation();

  const isProjectView = Boolean(projectId && location.pathname.startsWith('/projects/'));

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
    <div className="min-h-screen flex flex-col bg-linen text-ink font-sans">
      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur border-b border-sand-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Breadcrumb */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-sage-500 text-white flex items-center justify-center shadow-subtle group-hover:bg-sage-600 transition-colors">
                  <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
                </div>
                <div>
                  <span className="font-display text-xl font-bold tracking-tight text-ink">Planova</span>
                  <span className="hidden sm:inline-block ml-2 text-[10px] tracking-widest uppercase bg-sand-200 text-ink-muted px-1.5 py-0.5 rounded border border-sand-300 font-semibold">
                    India MVP
                  </span>
                </div>
              </Link>

              {isProjectView && (
                <div className="hidden md:flex items-center gap-2 text-sm text-ink-muted">
                  <ChevronRight className="w-4 h-4 text-sand-400" />
                  <span className="font-medium text-ink bg-sand-100 px-2.5 py-1 rounded-md border border-sand-200 text-xs">
                    Active Project
                  </span>
                </div>
              )}
            </div>

            {/* Context Navigation if inside project */}
            {isProjectView && (
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                          isActive
                            ? 'bg-sage-500 text-white shadow-subtle'
                            : 'text-ink-muted hover:text-ink hover:bg-sand-200'
                        )
                      }
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            )}

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg text-xs font-medium transition-all shadow-subtle hover:shadow-elevated"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Project</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Sub-nav for Project Pages */}
        {isProjectView && (
          <div className="lg:hidden border-t border-sand-200 bg-sand-100 px-4 py-2 overflow-x-auto flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'whitespace-nowrap flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-sage-500 text-white'
                        : 'text-ink-muted hover:bg-sand-200'
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
    </div>
  );
};
