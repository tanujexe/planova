import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ChevronRight, 
  Plus, 
  Sparkles, 
  Edit3, 
  Bed, 
  Bath, 
  Maximize2, 
  Home, 
  Check, 
  Clock, 
  Layers, 
  Layout, 
  Box, 
  IndianRupee, 
  ScrollText, 
  Download, 
  UserPlus, 
  ArrowRight, 
  MessageSquare, 
  X, 
  Image as ImageIcon,
  CheckCircle2,
  SlidersHorizontal,
  Compass,
  Grid
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { GenerationService } from '../services/generation.js';
import { ShapesAndRoomsView } from '../components/design/ShapesAndRoomsView.jsx';
import { DesignStepper } from '../components/design/DesignStepper.jsx';
import { DesignConceptCard, StartNewDesignCard, WatercolorFacade } from '../components/design/DesignConceptCard.jsx';
import { NaturalLanguageAssistant } from '../components/assistant/NaturalLanguageAssistant.jsx';

export const ProjectOverviewPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { 
    activeProject, 
    loadProject, 
    saveActiveProject, 
    renameProject,
    isLoading 
  } = useProjectStore();

  const [activeFloorLevel, setActiveFloorLevel] = useState(0);
  const [activeTab, setActiveTab] = useState('in_progress'); // 'new' | 'in_progress' | 'shortlisted'
  const [viewMode, setViewMode] = useState('stepper'); // 'stepper' (Screenshot 1) | 'gallery' (Screenshot 2)
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  useEffect(() => {
    if (activeProject) {
      setEditedTitle(activeProject.name || 'Untitled Project');
      if (activeProject.coverPhoto) {
        setCoverPhoto(activeProject.coverPhoto);
      }
    }
  }, [activeProject]);

  // Ensure 3 concept options exist
  useEffect(() => {
    if (activeProject && (!activeProject.designOptions || activeProject.designOptions.length === 0)) {
      GenerationService.generate(
        { plot: activeProject.plot, requirements: activeProject.requirements },
        () => {}
      ).then(({ options, defaultDesign }) => {
        const updated = {
          ...activeProject,
          designOptions: options,
          selectedOptionId: options[0].id,
          design: activeProject.design || defaultDesign,
        };
        saveActiveProject(updated);
      });
    }
  }, [activeProject, saveActiveProject]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const project = activeProject || {
    id: projectId || 'proj-demo',
    name: 'dfgg',
    plot: { width: 30, length: 50, floors: 2 },
    requirements: { bhk: 3, bathrooms: 2, budgetInr: 3500000 },
    designOptions: [],
  };

  const currentPlan = project.design || project.designOptions?.[0]?.floorPlan || { floors: [] };
  const designOptions = project.designOptions || [];
  const selectedOptionId = project.selectedOptionId || designOptions[0]?.id;

  // Calculate Bed & Bath count dynamically from active plan
  const allRooms = currentPlan.floors?.flatMap((f) => f.rooms || []) || [];
  const bedCount = allRooms.filter((r) => r.type.includes('bedroom')).length || project.requirements?.bhk || 3;
  const bathCount = allRooms.filter((r) => r.type.includes('bathroom')).length || project.requirements?.bathrooms || 2;
  const heatedArea = currentPlan.builtUpAreaSqFt || (project.plot?.width * project.plot?.length * (project.plot?.floors || 1)) || 1471;

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      renameProject(project.id, editedTitle.trim());
      setIsEditingTitle(false);
      showToast('Project renamed successfully');
    }
  };

  const handleSelectConcept = (opt) => {
    const updated = {
      ...project,
      selectedOptionId: opt.id,
      design: opt.floorPlan,
    };
    saveActiveProject(updated);
    navigate(`/projects/${project.id}/drafts/${opt.id}`);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        setCoverPhoto(url);
        saveActiveProject({ ...project, coverPhoto: url });
        showToast('Updated cover photo!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 bg-[#F7F5F0] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1700px] mx-auto">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-20 right-6 z-50 bg-neutral-950 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 3-Column Studio Grid Layout (Matching Drafted Screenshots) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: Project Profile, Metrics, Team, & Design Filters (Cols 1-3)
             ========================================================================= */}
          <aside className="lg:col-span-3 space-y-5">
            
            {/* Project Card */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE6DF] shadow-xs space-y-5">
              
              {/* Cover Photo Area */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group relative w-full h-36 rounded-2xl bg-[#F5F2EC] hover:bg-[#EAE6DF] border border-dashed border-[#DDD7CD] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden"
              >
                {coverPhoto ? (
                  <>
                    <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                      Change Cover Photo
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <div className="w-9 h-9 rounded-xl bg-white shadow-2xs text-neutral-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neutral-800">Add Cover Photo</p>
                      <p className="text-[11px] text-neutral-400">Click or drop image to upload</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleCoverUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Project Title with inline Rename */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {isEditingTitle ? (
                  <form onSubmit={handleTitleSubmit} className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full text-xl font-serif font-bold text-neutral-900 border-b border-neutral-900 focus:outline-hidden bg-transparent"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingTitle(false)}
                      className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-neutral-950 truncate">
                      {project.name}
                    </h2>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-[#F5F2EC] transition-colors"
                      title="Rename Project"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Area & Badges */}
              <div className="space-y-3">
                <div>
                  <div className="font-serif text-2xl font-bold text-neutral-950">
                    {heatedArea.toLocaleString()} ft²
                  </div>
                  <div className="text-xs text-neutral-500 font-medium">
                    Heated Area
                  </div>
                </div>

                {/* Beds & Baths Badges matching Screenshot 1 & 2 */}
                <div className="flex items-center gap-4 text-xs font-semibold text-neutral-800 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Bed className="w-4 h-4 text-neutral-600" />
                    <span>{bedCount} Beds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bath className="w-4 h-4 text-neutral-600" />
                    <span>{bathCount} Baths</span>
                  </div>
                </div>

                {/* Buildable Area */}
                <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Buildable Area</span>
                  <span className="font-semibold text-neutral-900 font-mono">
                    {project.plot?.width || 30} × {project.plot?.length || 50} ft (Flexible)
                  </span>
                </div>
              </div>

            </div>

            {/* Project Team Card matching Screenshot 1 & 2 */}
            <div className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                  Project Team
                </h3>
                <button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 px-2.5 py-1 rounded-lg hover:bg-[#F5F2EC] transition-colors border border-[#EAE6DF]"
                >
                  <Plus className="w-3 h-3" />
                  <span>Invite</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#7C8B99] text-white font-bold text-xs flex items-center justify-center">
                    N
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">Narayan</h4>
                    <p className="text-[11px] text-neutral-400">Architect</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Now</span>
                </div>
              </div>
            </div>

            {/* My Designs Filter Menu matching Screenshot 1 & 2 */}
            <div className="bg-white rounded-3xl p-4 border border-[#EAE6DF] shadow-xs space-y-1">
              <div className="px-3 py-2 text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                My Designs ({designOptions.length || 2})
              </div>

              <button
                onClick={() => setActiveTab('new')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'new'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-900'
                }`}
              >
                <Sparkles className="w-4 h-4 opacity-70" />
                <span>New (0)</span>
              </button>

              <button
                onClick={() => setActiveTab('in_progress')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'in_progress'
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 opacity-80" />
                  <span>In-Progress ({designOptions.length || 1})</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('shortlisted')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all text-left ${
                  activeTab === 'shortlisted'
                    ? 'bg-neutral-950 text-white'
                    : 'text-neutral-600 hover:bg-[#FAF8F5] hover:text-neutral-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 opacity-70" />
                <span>Shortlisted (0)</span>
              </button>
            </div>

          </aside>

          {/* =========================================================================
              CENTER COLUMN: Main Studio, Banners, Shapes & Rooms / Gallery (Cols 4-10)
             ========================================================================= */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* Header: "My Designs (2)" with "+ New Design" & View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                  My Designs ({designOptions.length || 2})
                </h1>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Switch between Screenshot 1 (Shapes & Rooms + Stepper) and Screenshot 2 (Gallery) */}
                <div className="flex items-center gap-1 bg-white border border-[#EAE6DF] p-1 rounded-xl shadow-2xs">
                  <button
                    onClick={() => setViewMode('stepper')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'stepper'
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    Studio & Stepper
                  </button>
                  <button
                    onClick={() => setViewMode('gallery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === 'gallery'
                        ? 'bg-neutral-950 text-white shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-950'
                    }`}
                  >
                    Explore Gallery
                  </button>
                </div>

                <button
                  onClick={() => navigate('/projects/new')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Design</span>
                </button>
              </div>
            </div>

            {/* Top Banner: "Explore three different design directions" matching Screenshot 1 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#EAE6DF] shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Left: Title & Progress Circles */}
                <div className="space-y-3">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
                    Explore three different <br className="hidden sm:inline" />
                    design directions.
                  </h3>
                  
                  {/* Circular Step Indicator: "✔ ○ ○ ○" */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#E3E8DE] flex items-center justify-center text-neutral-800 text-[11px] font-bold">
                      ✓
                    </div>
                    <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-400">
                      ○
                    </div>
                    <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-400">
                      ○
                    </div>
                    <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-[10px] text-neutral-400">
                      ○
                    </div>
                  </div>
                </div>

                {/* Middle: Idea 1, Idea 2, Idea 3 Preview Cards */}
                <div className="flex items-center -space-x-4 sm:-space-x-6 hover:space-x-2 transition-all">
                  {['Balanced Concept', 'Open Living', 'Vastu Priority'].map((title, idx) => (
                    <div
                      key={title}
                      onClick={() => {
                        if (designOptions[idx]) handleSelectConcept(designOptions[idx]);
                      }}
                      className="w-24 sm:w-28 bg-[#FAF8F5] rounded-2xl border border-[#EAE6DF] shadow-md p-2 hover:-translate-y-2 transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] font-serif font-bold text-neutral-700 text-center mb-1">
                        Idea {idx + 1}
                      </div>
                      <div className="rounded-xl overflow-hidden bg-white border border-[#EAE6DF]">
                        <WatercolorFacade variant={idx === 0 ? 'modern_wood' : idx === 1 ? 'open_living' : 'vastu_priority'} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right: Circular 1/3 Progress Ring */}
                <div className="flex items-center justify-center shrink-0">
                  <div className="relative w-16 h-16 rounded-full border-4 border-[#C99C6A] flex items-center justify-center">
                    <span className="font-serif text-lg font-bold text-[#8C6033]">
                      1/3
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* In-Progress Section Title */}
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
              <Layers className="w-4 h-4 text-neutral-600" />
              <span>In-Progress ({designOptions.length || 1})</span>
            </div>

            {/* ==========================================================
                VIEW MODE 1: Shapes & Rooms + 4-Step Stepper (Screenshot 1)
               ========================================================== */}
            {viewMode === 'stepper' && (
              <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs p-6 sm:p-7 space-y-6">
                
                {/* Design Header: "Design 2", "Last Active", Author */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#F2EFE9]">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl font-bold text-neutral-950">
                      {designOptions.find(o => o.id === selectedOptionId)?.title || 'Design 2'}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A]">
                      Last Active
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <div className="w-5 h-5 rounded-full bg-[#7C8B99] text-white text-[10px] font-bold flex items-center justify-center">
                      N
                    </div>
                    <span>Narayan · updated moments ago</span>
                  </div>
                </div>

                {/* Main Split: Left Shapes & Rooms Bubble Canvas, Right Stepper */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Left: Shapes & Rooms View */}
                  <div className="xl:col-span-7">
                    <ShapesAndRoomsView 
                      floorPlan={currentPlan}
                      activeFloorLevel={activeFloorLevel}
                      onSelectFloorLevel={(level) => setActiveFloorLevel(level)}
                      onOpenStudio={() => navigate(`/projects/${project.id}/design`)}
                    />
                  </div>

                  {/* Right: Design Stepper */}
                  <div className="xl:col-span-5">
                    <DesignStepper 
                      projectId={project.id}
                      currentStep="shapes"
                      onOpenStudio={() => navigate(`/projects/${project.id}/design`)}
                      onOpen3D={() => navigate(`/projects/${project.id}/3d`)}
                    />
                  </div>

                </div>

              </div>
            )}

            {/* ==========================================================
                VIEW MODE 2: Design Concept Cards Gallery (Screenshot 2)
               ========================================================== */}
            {viewMode === 'gallery' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {designOptions.map((opt, idx) => (
                  <DesignConceptCard
                    key={opt.id}
                    option={opt}
                    isSelected={opt.id === selectedOptionId}
                    onSelect={handleSelectConcept}
                    variant={idx === 0 ? 'modern_wood' : idx === 1 ? 'open_living' : 'vastu_priority'}
                  />
                ))}

                {/* Start New Design Card */}
                <StartNewDesignCard onClick={() => navigate('/projects/new')} />
              </div>
            )}

          </main>

          {/* =========================================================================
              RIGHT COLUMN: Inspiration & Architectural Ideas (Cols 11-12)
             ========================================================================= */}
          <aside className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-3xl p-5 border border-[#EAE6DF] shadow-xs space-y-4">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                Inspiration (0)
              </h3>

              {/* Inspiration Card matching Screenshot 1 & 2 */}
              <div className="group rounded-2xl border border-[#EAE6DF] bg-[#FAF8F5] p-3 text-center space-y-3 cursor-pointer hover:shadow-md transition-all">
                <div className="rounded-xl overflow-hidden bg-white border border-[#EAE6DF]">
                  <WatercolorFacade variant="modern_wood" />
                </div>
                
                <div className="space-y-1">
                  <div className="w-8 h-8 rounded-full bg-white border border-[#EAE6DF] text-neutral-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-2xs">
                    <Plus className="w-4 h-4 stroke-[2]" />
                  </div>
                  <h4 className="font-serif text-sm font-semibold text-neutral-900">
                    Explore Other Designs
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Modern wood facades & Indian living concepts
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Feature Direct Links */}
            <div className="bg-white rounded-3xl p-4 border border-[#EAE6DF] shadow-xs space-y-2 text-xs">
              <h4 className="font-mono text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2">
                Quick Tools
              </h4>
              <Link
                to={`/projects/${project.id}/cost`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-neutral-700 hover:text-neutral-950 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Cost Estimate</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </Link>
              <Link
                to={`/projects/${project.id}/boq`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-neutral-700 hover:text-neutral-950 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ScrollText className="w-3.5 h-3.5 text-neutral-500" />
                  <span>BOQ Takeoff</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </Link>
              <Link
                to={`/projects/${project.id}/export`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] text-neutral-700 hover:text-neutral-950 font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-neutral-500" />
                  <span>AutoCAD DXF & PDF</span>
                </div>
                <ArrowRight className="w-3 h-3 text-neutral-400" />
              </Link>
            </div>
          </aside>

        </div>

      </div>

      {/* =========================================================================
          FLOATING AI ASSISTANT BUTTON (Blue Chat Icon matching Screenshot 1 & 2)
         ========================================================================= */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
          className="w-13 h-13 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-200"
          title="Planova AI Architectural Assistant"
        >
          {isAiAssistantOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6 fill-white stroke-none" />
          )}
        </button>
      </div>

      {/* Slide-out AI Assistant Drawer */}
      {isAiAssistantOpen && (
        <div className="fixed bottom-22 right-6 z-50 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EAE6DF] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#FAF8F5] px-5 py-4 border-b border-[#EAE6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#0284C7] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-neutral-900">
                Planova AI Architectural Copilot
              </h3>
            </div>
            <button
              onClick={() => setIsAiAssistantOpen(false)}
              className="text-neutral-400 hover:text-neutral-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 max-h-[500px] overflow-y-auto">
            <NaturalLanguageAssistant
              plan={currentPlan}
              requirements={project.requirements}
              onApplyMutation={(newPlan) => {
                const updated = {
                  ...project,
                  design: newPlan,
                };
                saveActiveProject(updated);
                showToast('Applied architectural mutation to layout!');
                setIsAiAssistantOpen(false);
              }}
              onPreviewMutation={() => {}}
              onClearPreview={() => {}}
            />
          </div>

        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#EAE6DF] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-neutral-900">Invite Collaborator</h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-neutral-400 hover:text-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">
              Invite your co-architect, client, or civil contractor to review this layout.
            </p>
            <input
              type="email"
              placeholder="name@architecture.com"
              className="w-full px-3.5 py-2 rounded-xl border border-[#DDD7CD] text-xs focus:outline-hidden focus:border-neutral-900"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsInviteModalOpen(false);
                  showToast('Invitation sent!');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-950 text-white hover:bg-neutral-800"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

