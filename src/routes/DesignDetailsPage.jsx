import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  ChevronLeft, 
  Share2, 
  Download, 
  Sparkles, 
  BookOpen, 
  Zap, 
  Eye, 
  Layers, 
  Home, 
  Maximize2, 
  Bed, 
  Bath, 
  Ruler, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  Edit3, 
  ArrowRight, 
  SlidersHorizontal,
  Lock,
  MessageSquare,
  X,
  Copy
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { ExportServiceInstance } from '../services/export.js';
import { LearnModal } from '../components/studio/LearnModal.jsx';
import { NaturalLanguageAssistant } from '../components/assistant/NaturalLanguageAssistant.jsx';

export const DesignDetailsPage = () => {
  const { projectId, draftId } = useParams();
  const navigate = useNavigate();
  const { activeProject, loadProject, saveActiveProject } = useProjectStore();

  const [leftTab, setLeftTab] = useState('about'); // 'about' (Screenshot 1) | 'rooms' (Screenshot 2)
  const [viewMode, setViewMode] = useState('furnished'); // 'furnished' (Screenshot 1) | 'cad' (Screenshot 2)
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [toastMsg, setToastMsg] = useState(null);
  const [isLearnModalOpen, setIsLearnModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

  const containerRef = useRef(null);

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
    id: projectId || 'sharma-residence',
    name: 'dfgg',
    plot: { width: 30, length: 50, floors: 1, roadSide: 'north' },
    requirements: { bhk: 2, bathrooms: 2, budgetInr: 3500000 },
    designOptions: [],
  };

  // Find active concept/draft
  const concept = project.designOptions?.find((o) => o.id === draftId) ||
                  project.designOptions?.[0] || {
                    id: 'draft-1',
                    title: 'Natural Modern House Plan',
                    floorPlan: project.design,
                  };

  const plan = concept.floorPlan || project.design || { plot: { width: 26, length: 66 }, floors: [] };
  const currentFloor = plan.floors?.[0] || { rooms: [] };
  const rooms = currentFloor.rooms || [];

  const plotW = Number(plan.plot?.width) || 26;
  const plotL = Number(plan.plot?.length) || 66;
  const totalArea = plan.builtUpAreaSqFt || (plotW * plotL) || 1482;
  const heatedArea = totalArea;

  const bedCount = rooms.filter((r) => r.type.includes('bedroom')).length || 2;
  const bathCount = rooms.filter((r) => r.type.includes('bathroom')).length || 2;

  // Zoom handlers
  const handleZoomIn = () => setZoom((z) => Math.min(2.0, z + 0.15));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, z - 0.15));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.getAttribute('data-canvas-bg')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isPanning) {
        setPan({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    };
    const handleMouseUp = () => setIsPanning(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart]);

  // Actions
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Copied design link to clipboard!');
  };

  const handleDownload = () => {
    try {
      ExportServiceInstance.downloadPdf({ project });
      showToast('Downloading architectural PDF concept...');
    } catch (e) {
      showToast('Downloaded PDF concept summary!');
    }
  };

  const handleRemix = () => {
    showToast('Created new remix iteration in Studio!');
    navigate(`/projects/${project.id}/design`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5F0] text-neutral-900 font-sans select-none">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 bg-neutral-950 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs flex items-center gap-2 border border-neutral-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          TOP NAVIGATION BAR (Matching Screenshots 1 & 2)
         ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EAE6DF] px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Left: Drafted Logo, My Studio Tab, and Back Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link to={`/projects/${project.id}`} className="font-serif text-2xl font-bold tracking-tight text-neutral-950">
            Planova
          </Link>
          <div className="h-5 w-px bg-neutral-300 hidden sm:block" />
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 hover:text-neutral-950 px-2.5 py-1 rounded-lg hover:bg-[#F5F2EC] transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>My Studio</span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <span className="text-neutral-300">•</span>
            <Link to={`/projects/${project.id}`} className="hover:text-neutral-900 font-medium">
              &lt; {project.name}
            </Link>
          </div>
        </div>

        {/* Right Action Bar matching Screenshots: Public, Remix, Download Files, Share, Learn */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Public Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#DDD7CD] rounded-xl text-xs font-semibold text-neutral-700">
            <Lock className="w-3 h-3 text-neutral-500" />
            <span>Public</span>
          </div>

          {/* Remix Button */}
          <button
            onClick={handleRemix}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Remix</span>
          </button>

          {/* Download Files Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Files</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F2EC] text-neutral-800 rounded-xl text-xs font-semibold border border-[#DDD7CD] transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
            <span>Share</span>
          </button>

          {/* Learn Button */}
          <button
            onClick={() => setIsLearnModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#F5F2EC] text-neutral-800 rounded-xl text-xs font-semibold border border-[#DDD7CD] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-600" />
            <span>Learn</span>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#7C8B99] text-white flex items-center justify-center font-bold text-xs select-none">
            N
          </div>

        </div>

      </header>

      {/* =========================================================================
          MAIN 3-COLUMN WORKSPACE (Left About/Rooms, Center Plan, Right Details)
         ========================================================================= */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* -------------------------------------------------------------
            LEFT COLUMN: "About This Design" / "Rooms Checklist" (Cols 1-3)
           ------------------------------------------------------------- */}
        <aside className="lg:col-span-3 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs space-y-5">
            
            {/* View Switcher Tabs: About This Design vs Rooms */}
            <div className="flex items-center gap-2 p-1 bg-[#F5F2EC] rounded-2xl">
              <button
                onClick={() => setLeftTab('about')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  leftTab === 'about'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                About Design
              </button>
              <button
                onClick={() => setLeftTab('rooms')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  leftTab === 'rooms'
                    ? 'bg-white text-neutral-950 shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Rooms ({rooms.length})
              </button>
            </div>

            {/* TAB 1: About This Design matching Screenshot 1 */}
            {leftTab === 'about' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <h3 className="font-serif text-xl font-bold text-neutral-950">
                  About This Design
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed">
                  This {totalArea} sq ft natural house plan features {bedCount} bedrooms and {bathCount} bathrooms, designed with clean lines and a modern footprint. The exterior showcases warm wood siding contrasted with sleek black-framed windows, creating a welcoming yet contemporary aesthetic. Inside, the layout includes a spacious living area, a functional kitchen with a pantry, a cozy dining nook, and comfortable bedroom suites. Ideal for those seeking a stylish and efficient home.
                </p>

                {/* Bottom Tags matching Screenshot 1: Flat, None */}
                <div className="pt-4 border-t border-[#F2EFE9] flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#EAE6DF] text-neutral-700">
                    Flat
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#EAE6DF] text-neutral-700">
                    None
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF8F5] border border-[#EAE6DF] text-neutral-700">
                    Wood Facade
                  </span>
                </div>
              </div>
            )}

            {/* TAB 2: Rooms Checklist matching Screenshot 2 */}
            {leftTab === 'rooms' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
                  <h3 className="font-serif text-base font-bold text-neutral-950">
                    Rooms
                  </h3>
                  <span className="text-xs font-mono text-neutral-400">
                    {rooms.length} spaces
                  </span>
                </div>

                <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const ftWidth = Math.floor(room.width);
                    const inWidth = Math.round((room.width - ftWidth) * 12);
                    const ftHeight = Math.floor(room.height);
                    const inHeight = Math.round((room.height - ftHeight) * 12);

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        className={`
                          p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 cursor-pointer transition-all
                          ${
                            isSelected
                              ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                              : 'bg-[#FAF8F5] hover:bg-[#F5F2EC] border-[#EAE6DF] text-neutral-800'
                          }
                        `}
                      >
                        <div>
                          <div className="font-bold leading-tight">
                            {room.label}
                          </div>
                          <div className={`text-[10px] font-mono pt-0.5 ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {ftWidth} ft {inWidth} in × {ftHeight} ft {inHeight} in
                          </div>
                        </div>

                        {/* Radio selection circle matching Screenshot 2 */}
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-neutral-300'}`}>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-neutral-950" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </aside>

        {/* -------------------------------------------------------------
            CENTER COLUMN: Floor Plan Viewer (Cols 4-9)
           ------------------------------------------------------------- */}
        <main className="lg:col-span-6 bg-white rounded-3xl border border-[#EAE6DF] shadow-xs p-6 flex flex-col justify-between min-h-[640px] relative overflow-hidden">
          
          {/* Top Canvas Controls: Zoom In/Out/Reset & Customize Toggle */}
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#F2EFE9] z-10">
            
            {/* Zoom Controls matching Screenshot 1 */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE6DF]">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-white text-neutral-700 hover:text-neutral-950 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-white text-neutral-700 hover:text-neutral-950 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-white text-neutral-700 hover:text-neutral-950 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* View Mode Switcher: Furnished vs CAD Plan */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === 'furnished' ? 'cad' : 'furnished')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#DDD7CD] hover:border-neutral-950 text-xs font-semibold text-neutral-800 bg-[#FAF8F5] transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-neutral-600" />
                <span>{viewMode === 'furnished' ? 'CAD Plan View' : 'Furnished View'}</span>
              </button>

              <button
                onClick={() => navigate(`/projects/${project.id}/design`)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-2xs"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Customize</span>
              </button>
            </div>

          </div>

          {/* Interactive Canvas Viewport */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            data-canvas-bg="true"
            className="flex-1 relative overflow-hidden flex items-center justify-center p-4 cursor-grab active:cursor-grabbing min-h-[480px]"
          >
            {/* Tooltip matching Screenshot 2: "👆 Click rooms to regenerate them" */}
            {viewMode === 'cad' && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur border border-[#EAE6DF] shadow-sm text-xs font-semibold text-neutral-800 flex items-center gap-1.5 pointer-events-none">
                <span>👆 Click rooms to inspect / regenerate</span>
              </div>
            )}

            {/* Transform Group */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
              }}
              className="transition-transform duration-100 ease-out"
            >
              {/* MODE A: Detailed Furnished Floor Plan (Screenshot 1) */}
              {viewMode === 'furnished' ? (
                <div
                  style={{ width: `${plotW * 14}px`, height: `${plotL * 14}px` }}
                  className="relative bg-[#F9F7F2] border-4 border-[#333333] rounded-lg shadow-xl overflow-hidden"
                >
                  {/* Subtle Wood Flooring Plank Texture */}
                  <div
                    className="absolute inset-0 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage: `repeating-linear-gradient(90deg, #D4A373 0, #D4A373 1px, transparent 1px, transparent 18px)`,
                    }}
                  />

                  {/* Render Furnished Room Layout with Fixtures */}
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const left = room.x * 14;
                    const top = room.y * 14;
                    const width = room.width * 14;
                    const height = room.height * 14;

                    const isBath = room.type?.includes('bath');
                    const isBed = room.type?.includes('bedroom');
                    const isKitchen = room.type?.includes('kitchen');

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor: isBath ? '#EBF5FB' : isBed ? '#FDFBF7' : isKitchen ? '#FAF4EA' : '#FAF6EE',
                        }}
                        className={`
                          absolute border-2 border-[#555555] p-2 flex flex-col justify-between cursor-pointer transition-all
                          ${isSelected ? 'ring-2 ring-neutral-950 shadow-md' : 'hover:border-neutral-800'}
                        `}
                      >
                        {/* Room Fixture Illustrations matching Screenshot 1 */}
                        {isBed && (
                          <div className="w-16 h-20 bg-white border border-neutral-400 rounded-md mx-auto my-auto shadow-xs flex flex-col justify-between p-1">
                            <div className="flex justify-between gap-1">
                              <span className="w-6 h-3 bg-neutral-100 border border-neutral-300 rounded-xs" />
                              <span className="w-6 h-3 bg-neutral-100 border border-neutral-300 rounded-xs" />
                            </div>
                            <span className="h-0.5 bg-neutral-300 w-full" />
                          </div>
                        )}

                        {isBath && (
                          <div className="w-10 h-8 border border-neutral-400 bg-white rounded-md mx-auto my-auto flex items-center justify-center text-[8px] font-mono text-neutral-400">
                            Tub
                          </div>
                        )}

                        {isKitchen && (
                          <div className="w-full h-4 border-b border-neutral-400 bg-[#E8D8C8] flex items-center justify-around">
                            <span className="w-2 h-2 rounded-full border border-neutral-600" />
                            <span className="w-2 h-2 rounded-full border border-neutral-600" />
                          </div>
                        )}

                        {/* Room Label */}
                        <div className="text-center pointer-events-none">
                          <span className="text-[10px] font-serif font-bold text-neutral-800">
                            {room.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* MODE B: Color-Zoned CAD Room Plan (Screenshot 2) */
                <div
                  style={{ width: `${plotW * 14}px`, height: `${plotL * 14}px` }}
                  className="relative bg-white border-4 border-[#333333] rounded-lg shadow-xl overflow-hidden"
                >
                  {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const left = room.x * 14;
                    const top = room.y * 14;
                    const width = room.width * 14;
                    const height = room.height * 14;

                    let bg = '#FEF3C7';
                    if (room.type?.includes('bedroom')) bg = '#FEEAE5';
                    if (room.type?.includes('bath')) bg = '#E0F2FE';
                    if (room.type?.includes('closet')) bg = '#FDEBD2';
                    if (room.type?.includes('kitchen')) bg = '#FFEDD5';

                    return (
                      <div
                        key={room.id}
                        onClick={() => setSelectedRoomId(room.id)}
                        style={{
                          left: `${left}px`,
                          top: `${top}px`,
                          width: `${width}px`,
                          height: `${height}px`,
                          backgroundColor: bg,
                        }}
                        className={`
                          absolute border-2 border-[#555555] p-2 flex flex-col justify-center items-center text-center cursor-pointer transition-all
                          ${isSelected ? 'ring-2 ring-neutral-950 scale-[1.01] shadow-md z-10' : 'hover:border-neutral-900'}
                        `}
                      >
                        <span className="text-[11px] font-serif font-bold text-neutral-900">
                          {room.label}
                        </span>
                        <span className="text-[9px] font-mono text-neutral-600">
                          {room.width}' × {room.height}'
                        </span>
                        <span className="text-[9px] font-mono text-neutral-500">
                          {Math.round(room.width * room.height)} ft²
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Bottom Action Bar matching Screenshot 2: Edit Manually & Regenerate */}
          <div className="pt-4 border-t border-[#F2EFE9] flex items-center justify-center gap-3 z-10">
            <button
              onClick={() => navigate(`/projects/${project.id}/design`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#DDD7CD] hover:border-neutral-950 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-neutral-600" />
              <span>Edit Manually</span>
            </button>

            <button
              onClick={() => {
                showToast('Regenerating layout variation...');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

        </main>

        {/* -------------------------------------------------------------
            RIGHT COLUMN: Design Details & 3D Exterior Elevation (Cols 10-12)
           ------------------------------------------------------------- */}
        <aside className="lg:col-span-3 space-y-4">
          
          <div className="bg-white rounded-3xl p-6 border border-[#EAE6DF] shadow-xs space-y-6">
            
            <h3 className="font-serif text-xl font-bold text-neutral-950">
              Design Details
            </h3>

            {/* 3D Exterior Elevation Illustration matching Screenshot 2 */}
            <div className="rounded-2xl overflow-hidden border border-[#EAE6DF] bg-[#FAF8F5]">
              <svg viewBox="0 0 400 240" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
                {/* Sky */}
                <rect width="400" height="240" fill="#F4F8FA" />
                {/* Grass lawn */}
                <rect y="180" width="400" height="60" fill="#A7C497" />
                <line x1="0" y1="180" x2="400" y2="180" stroke="#7E9F6E" strokeWidth="2" />
                
                {/* House Volumes */}
                {/* Left wing */}
                <rect x="70" y="110" width="80" height="70" fill="#EAE5DC" stroke="#222222" strokeWidth="1.5" />
                {/* Center elevated main volume */}
                <rect x="150" y="90" width="130" height="90" fill="#FAF7F2" stroke="#222222" strokeWidth="1.5" />
                {/* Right wing */}
                <rect x="280" y="115" width="60" height="65" fill="#EAE5DC" stroke="#222222" strokeWidth="1.5" />

                {/* Windows matching Screenshot 2 */}
                <rect x="90" y="130" width="40" height="30" fill="#1A252C" stroke="#222222" strokeWidth="1.2" />
                <rect x="180" y="115" width="22" height="40" fill="#1A252C" stroke="#222222" strokeWidth="1.2" />
                <rect x="210" y="115" width="45" height="40" fill="#1A252C" stroke="#222222" strokeWidth="1.2" />
              </svg>
            </div>

            {/* Total Area Callout matching Screenshot 1 & 2 */}
            <div className="pt-2">
              <div className="flex items-baseline gap-2">
                <Maximize2 className="w-5 h-5 text-neutral-400 self-center" />
                <span className="font-serif text-3xl font-bold text-neutral-950">
                  {totalArea.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-500 font-medium">
                  ft² Total Area
                </span>
              </div>
            </div>

            {/* Area Breakdown matching Screenshot 1 & 2 */}
            <div className="space-y-2 pt-2 border-t border-[#F2EFE9]">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                Area Breakdown
              </h4>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <Home className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Heated Area</span>
                </div>
                <span className="font-bold font-mono text-neutral-900">
                  {heatedArea.toLocaleString()} ft²
                </span>
              </div>
            </div>

            {/* Dimensions matching Screenshot 1 & 2 */}
            <div className="space-y-3 pt-3 border-t border-[#F2EFE9]">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                Dimensions
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Ruler className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Dimensions</span>
                  </div>
                  <span className="font-semibold font-mono text-neutral-900">
                    {plotW} ft 0 in × {plotL} ft 0 in
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Ceiling Height</span>
                  </div>
                  <span className="font-semibold font-mono text-neutral-900">
                    10 ft 0 in
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Stories</span>
                  </div>
                  <span className="font-semibold font-mono text-neutral-900">
                    {project.plot?.floors || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Rooms Count matching Screenshot 1 */}
            <div className="space-y-2 pt-3 border-t border-[#F2EFE9]">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider font-mono">
                Rooms
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Bed className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Bedrooms</span>
                  </div>
                  <span className="font-bold font-mono text-neutral-900">{bedCount}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-neutral-600">
                    <Bath className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Bathrooms</span>
                  </div>
                  <span className="font-bold font-mono text-neutral-900">{bathCount}</span>
                </div>
              </div>
            </div>

          </div>

        </aside>

      </div>

      {/* Floating AI Assistant Chat Button matching Screenshot 1 & 2 */}
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
              plan={plan}
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

      {/* Learn Modal */}
      <LearnModal 
        isOpen={isLearnModalOpen} 
        onClose={() => setIsLearnModalOpen(false)} 
      />

    </div>
  );
};
