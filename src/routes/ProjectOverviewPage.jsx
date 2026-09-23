import React, { useEffect, useState, useRef } from 'react';
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
  RotateCcw,
  Image as ImageIcon,
  Edit2,
  Bed,
  Bath,
  Plus,
  Bookmark,
  Zap,
  FileDown,
  Check,
  Home,
  Square,
  Maximize2
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';
import { RenameModal } from '../components/project/RenameModal.jsx';
import { GenerationService } from '../services/generation.js';

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

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [selectedDesignIdx, setSelectedDesignIdx] = useState(1); // Default to Design 2 like in screenshot
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedList, setInvitedList] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverPhoto(url);
    }
  };

  const handleRenameConfirm = (newName) => {
    if (activeProject) {
      renameProject(activeProject.id, newName);
      setIsRenameOpen(false);
    }
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (inviteEmail.trim()) {
      setInvitedList([...invitedList, { email: inviteEmail.trim(), role: 'Collaborator' }]);
      setInviteEmail('');
      setInviteModalOpen(false);
    }
  };

  if (isLoading || !activeProject) {
    return (
      <div className="flex-1 flex items-center justify-center p-12 bg-linen">
        <div className="text-center space-y-3">
          <Compass className="w-8 h-8 text-dark animate-spin mx-auto" />
          <p className="text-xs font-mono text-ink-muted">Loading Drafted Studio...</p>
        </div>
      </div>
    );
  }

  const project = activeProject;
  const plot = project.plot || { width: 30, length: 50, unit: 'ft', floors: 2, facing: 'north' };
  const req = project.requirements || { bhk: 2, bathrooms: 2, budgetInr: 3500000, vastu: 'basic' };
  const heatedArea = project.design?.builtUpAreaSqFt || 2443;
  const totalArea = Math.round(heatedArea * 1.05);

  return (
    <div className="flex-1 bg-linen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT SIDEBAR (Cols 1-3 on LG) */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* Project Details Card */}
            <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-subtle space-y-5">
              
              {/* Cover Photo Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-36 bg-[#F5F2EA] hover:bg-[#EFEBE0] rounded-xl border border-dashed border-sand-300 flex flex-col items-center justify-center cursor-pointer transition-colors relative overflow-hidden group text-center p-3"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleCoverUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                {coverPhoto ? (
                  <img src={coverPhoto} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-white border border-sand-300 flex items-center justify-center text-ink-muted mb-2 shadow-subtle group-hover:scale-105 transition-transform">
                      <ImageIcon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <span className="font-semibold text-xs text-ink">Add Cover Photo</span>
                    <span className="text-[10px] text-ink-muted mt-0.5">Click or drop image to upload</span>
                  </>
                )}
              </div>

              {/* Project Title & Edit Icon */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h1 className="font-serif text-2xl font-bold text-ink tracking-tight">
                    {project.name || 'Spano Ka Ghar'}
                  </h1>
                  <button
                    onClick={() => setIsRenameOpen(true)}
                    className="p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-sand-100 border border-sand-200 transition-colors"
                    title="Rename Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Heated Area Metric */}
              <div className="pt-1">
                <div className="font-serif text-3xl font-bold text-ink">
                  {heatedArea.toLocaleString('en-IN')} ft²
                </div>
                <span className="text-xs text-ink-muted font-normal block mt-0.5">
                  Heated Area
                </span>
              </div>

              {/* Beds & Baths Badges */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs font-semibold text-ink shadow-subtle">
                  <Bed className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{req.bhk || 2} Beds</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-sand-300 rounded-lg text-xs font-semibold text-ink shadow-subtle">
                  <Bath className="w-3.5 h-3.5 text-ink-muted" />
                  <span>{req.bathrooms || 2} Baths</span>
                </div>
              </div>

              {/* Buildable Area / Specs Footer */}
              <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-xs">
                <span className="text-ink-muted">Buildable Area</span>
                <span className="font-semibold text-ink">Flexible</span>
              </div>
            </div>

            {/* Project Team Card */}
            <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-ink">Project Team</h3>
                <button
                  onClick={() => setInviteModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white hover:bg-sand-50 border border-sand-300 rounded-lg text-ink transition-colors shadow-subtle"
                >
                  <Plus className="w-3 h-3" />
                  <span>Invite</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* Member 1: Tanuj */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-terracotta text-white font-bold text-xs flex items-center justify-center shadow-subtle">
                      T
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-ink leading-tight">Tanuj</div>
                      <div className="text-[11px] text-ink-muted">Homebuyer</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Now</span>
                  </div>
                </div>

                {/* Additional Invited Members */}
                {invitedList.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs pt-1 border-t border-sand-100">
                    <div className="truncate max-w-[140px] text-ink-muted font-mono text-[11px]">{m.email}</div>
                    <span className="text-[10px] bg-sand-100 text-ink-muted px-1.5 py-0.5 rounded">Invited</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation Panel */}
            <div className="bg-white rounded-2xl border border-sand-300 p-4 shadow-subtle space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-ink-muted px-1 pb-1">
                Studio Modules
              </div>
              <Link
                to={`/projects/${project.id}/design`}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sand-100 text-xs font-semibold text-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layout className="w-3.5 h-3.5 text-ink-muted" />
                  <span>2D Workspace</span>
                </div>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
              </Link>
              <Link
                to={`/projects/${project.id}/3d`}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sand-100 text-xs font-semibold text-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Box className="w-3.5 h-3.5 text-ink-muted" />
                  <span>3D Concept</span>
                </div>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
              </Link>
              <Link
                to={`/projects/${project.id}/cost`}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sand-100 text-xs font-semibold text-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Cost & Budget</span>
                </div>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
              </Link>
              <Link
                to={`/projects/${project.id}/boq`}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sand-100 text-xs font-semibold text-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ScrollText className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Preliminary BOQ</span>
                </div>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
              </Link>
              <Link
                to={`/projects/${project.id}/export`}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-sand-100 text-xs font-semibold text-ink transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Export Files</span>
                </div>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
              </Link>
            </div>

          </div>

          {/* CENTER FEED (Cols 4-9 on LG) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header: My Designs (2) & New Design Button */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
                My Designs (2)
              </h2>
              <Link
                to={`/projects/${project.id}/design`}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-dark hover:bg-dark-hover text-white rounded-lg text-xs font-semibold shadow-subtle transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Design</span>
              </Link>
            </div>

            {/* Banner: Explore three different design directions */}
            <div className="bg-white rounded-2xl border border-sand-300 p-6 shadow-subtle relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Text & Steps */}
              <div className="space-y-4 max-w-xs">
                <h3 className="font-serif text-xl font-bold text-ink leading-snug">
                  Explore three different design directions.
                </h3>
                {/* Stepper Dots */}
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-400 flex items-center justify-center text-[10px] text-amber-800 font-bold">
                    ✓
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                  <div className="w-5 h-5 rounded-full border border-sand-400 flex items-center justify-center text-[9px] text-ink-muted">
                    ⭘
                  </div>
                  <div className="w-5 h-5 rounded-full border border-sand-400 flex items-center justify-center text-[9px] text-ink-muted">
                    ⭘
                  </div>
                </div>
              </div>

              {/* Overlapping Ideas Fan Graphic + Badge */}
              <div className="flex items-center gap-4">
                {/* 3 cards fan */}
                <div className="relative w-48 h-28 flex items-center justify-center">
                  {/* Idea 1 */}
                  <div className="absolute left-0 w-24 h-24 bg-sand-50 border border-sand-300 rounded-lg p-1.5 shadow-sm transform -rotate-6 transition-transform hover:-translate-y-1">
                    <div className="text-[8px] font-mono text-ink-muted">✨ Idea 1</div>
                    <div className="w-full h-14 mt-1 bg-gradient-to-br from-amber-100/60 to-emerald-100/60 rounded flex items-center justify-center text-[8px] text-ink-muted">
                      Elevation 1
                    </div>
                  </div>
                  {/* Idea 2 */}
                  <div className="absolute left-10 z-10 w-28 h-26 bg-white border border-sand-300 rounded-lg p-1.5 shadow-md transform hover:-translate-y-1 transition-transform">
                    <div className="text-[8px] font-mono font-bold text-ink">✨ Idea 2</div>
                    <div className="w-full h-16 mt-1 bg-gradient-to-br from-orange-100/60 via-amber-50 to-emerald-100/60 rounded flex items-center justify-center text-[9px] font-semibold text-ink">
                      Active
                    </div>
                  </div>
                  {/* Idea 3 */}
                  <div className="absolute right-0 w-24 h-24 bg-sand-50 border border-sand-300 rounded-lg p-1.5 shadow-sm transform rotate-6 transition-transform hover:-translate-y-1">
                    <div className="text-[8px] font-mono text-ink-muted">✨ Idea 3</div>
                    <div className="w-full h-14 mt-1 bg-gradient-to-br from-sky-100/60 to-emerald-100/60 rounded flex items-center justify-center text-[8px] text-ink-muted">
                      Elevation 3
                    </div>
                  </div>
                </div>

                {/* Circular 2/3 Ring Badge */}
                <div className="relative w-14 h-14 rounded-full border-4 border-amber-500/80 flex items-center justify-center bg-amber-50/50 shadow-subtle shrink-0">
                  <span className="font-serif text-base font-bold text-amber-900">
                    2/3
                  </span>
                </div>
              </div>

            </div>

            {/* Subheader: ✨ New (1) */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Sparkles className="w-3.5 h-3.5 text-ink" />
              <span>New (1)</span>
            </div>

            {/* MAIN DESIGN CARD (Design 2) */}
            <div className="bg-white rounded-2xl border border-sand-300 shadow-subtle overflow-hidden">
              
              {/* Card Header Bar */}
              <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-sand-200">
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-ink fill-ink/10" />
                  <h3 className="font-serif text-lg font-bold text-ink">
                    Design 2
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                    <div className="w-5 h-5 rounded-full bg-terracotta text-white font-bold text-[10px] flex items-center justify-center">
                      T
                    </div>
                    <span>Tanuj • 1d ago</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/projects/${project.id}/design`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-dark hover:bg-dark-hover text-white rounded-lg text-xs font-semibold shadow-subtle transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Remix</span>
                  </Link>

                  <Link
                    to={`/projects/${project.id}/export`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-sand-50 text-ink rounded-lg text-xs font-medium border border-sand-300 shadow-subtle transition-colors"
                  >
                    <FileDown className="w-3.5 h-3.5 text-ink-muted" />
                    <span>Download Files</span>
                  </Link>
                </div>
              </div>

              {/* Side-by-Side Visual Preview: 3D Exterior Elevation + 2D Floor Plan */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#FAF9F5]">
                
                {/* Left: 3D Exterior Elevation Watercolor Artwork */}
                <div className="h-64 sm:h-72 bg-gradient-to-b from-sky-50/50 via-white to-amber-50/40 rounded-xl border border-sand-300 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner group">
                  <div className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-white/90 text-ink px-2 py-0.5 rounded border border-sand-200 shadow-subtle">
                    ✨ Exterior Elevation
                  </div>

                  {/* SVG Illustration of Watercolor Home */}
                  <div className="w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 300 200" className="w-full h-full max-h-56">
                      {/* Sky & Clouds Watercolor washes */}
                      <ellipse cx="150" cy="50" rx="130" ry="40" fill="#EBF4F6" opacity="0.6" />
                      <ellipse cx="220" cy="40" rx="60" ry="25" fill="#E3EFF3" opacity="0.7" />
                      
                      {/* Background Trees & Foliage watercolor */}
                      <circle cx="50" cy="110" r="35" fill="#C3DAC3" opacity="0.7" />
                      <circle cx="80" cy="95" r="40" fill="#A8CDA9" opacity="0.8" />
                      <circle cx="230" cy="100" r="45" fill="#BFDABF" opacity="0.75" />
                      <circle cx="265" cy="115" r="30" fill="#ADCBAE" opacity="0.8" />
                      
                      {/* Roof of House */}
                      <polygon points="40,115 150,60 260,115" fill="#B98A60" />
                      <polygon points="45,115 150,65 255,115" fill="#C8966E" />
                      <line x1="150" y1="60" x2="150" y2="115" stroke="#9E6E45" strokeWidth="1" strokeDasharray="3,3" />

                      {/* House Facade Main Body */}
                      <rect x="55" y="115" width="190" height="60" fill="#FDFCF9" stroke="#DFD8CC" strokeWidth="1.5" />
                      
                      {/* Windows */}
                      <rect x="75" y="125" width="28" height="25" fill="#D6E6EB" stroke="#7A8E99" strokeWidth="1.5" rx="1" />
                      <line x1="89" y1="125" x2="89" y2="150" stroke="#7A8E99" strokeWidth="1" />
                      <line x1="75" y1="137" x2="103" y2="137" stroke="#7A8E99" strokeWidth="1" />

                      <rect x="115" y="125" width="28" height="25" fill="#D6E6EB" stroke="#7A8E99" strokeWidth="1.5" rx="1" />
                      <line x1="129" y1="125" x2="129" y2="150" stroke="#7A8E99" strokeWidth="1" />
                      <line x1="115" y1="137" x2="143" y2="137" stroke="#7A8E99" strokeWidth="1" />

                      {/* Main Entrance Door */}
                      <rect x="165" y="125" width="22" height="50" fill="#9E6E45" stroke="#724825" strokeWidth="1.5" rx="1" />
                      <circle cx="170" cy="150" r="1.5" fill="#FDE68A" />

                      {/* Garage / Side Wing */}
                      <rect x="195" y="128" width="40" height="47" fill="#F7F5F0" stroke="#DFD8CC" strokeWidth="1" />
                      <line x1="195" y1="138" x2="235" y2="138" stroke="#E5E0D6" strokeWidth="1" />
                      <line x1="195" y1="148" x2="235" y2="148" stroke="#E5E0D6" strokeWidth="1" />
                      <line x1="195" y1="158" x2="235" y2="158" stroke="#E5E0D6" strokeWidth="1" />

                      {/* Lawn & Flower Bed */}
                      <ellipse cx="150" cy="180" rx="140" ry="16" fill="#A7C9A4" opacity="0.9" />
                      <ellipse cx="120" cy="178" rx="80" ry="8" fill="#88B485" opacity="0.95" />
                      <circle cx="110" cy="175" r="4" fill="#E0582B" opacity="0.8" />
                      <circle cx="130" cy="176" r="3.5" fill="#D97706" opacity="0.8" />
                      <circle cx="150" cy="175" r="4" fill="#E0582B" opacity="0.8" />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-ink-muted">
                    <span>Front Elevation</span>
                    <Link 
                      to={`/projects/${project.id}/3d`} 
                      className="font-semibold text-ink hover:underline flex items-center gap-1"
                    >
                      <span>Explore 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Right: 2D Floor Plan Schematic View */}
                <div className="h-64 sm:h-72 bg-white rounded-xl border border-sand-300 p-4 flex flex-col justify-between relative overflow-hidden shadow-inner group">
                  <div className="absolute top-3 left-3 text-[10px] font-mono font-bold bg-white text-ink px-2 py-0.5 rounded border border-sand-200 shadow-subtle">
                    📐 2D Layout Plan
                  </div>

                  {/* Architectural 2D Plan Graphic */}
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <svg viewBox="0 0 240 200" className="w-full h-full max-h-56">
                      {/* Outer boundary wall */}
                      <rect x="20" y="20" width="200" height="160" fill="#FDFCFA" stroke="#141414" strokeWidth="3" rx="2" />

                      {/* Master Bedroom */}
                      <rect x="25" y="25" width="85" height="70" fill="#FAF6F0" stroke="#141414" strokeWidth="1.5" />
                      <text x="67" y="55" textAnchor="middle" fontSize="9" fontWeight="600" fill="#141414" fontFamily="sans-serif">Master Bed</text>
                      <text x="67" y="68" textAnchor="middle" fontSize="7" fill="#666666" fontFamily="monospace">14&apos; × 12&apos;</text>

                      {/* Bedroom 2 */}
                      <rect x="25" y="100" width="85" height="75" fill="#FAF6F0" stroke="#141414" strokeWidth="1.5" />
                      <text x="67" y="135" textAnchor="middle" fontSize="9" fontWeight="600" fill="#141414" fontFamily="sans-serif">Bed 2</text>
                      <text x="67" y="148" textAnchor="middle" fontSize="7" fill="#666666" fontFamily="monospace">12&apos; × 11&apos;</text>

                      {/* Living & Dining Hall */}
                      <rect x="115" y="25" width="100" height="95" fill="#FFFFFF" stroke="#141414" strokeWidth="1.5" />
                      <text x="165" y="65" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#141414" fontFamily="sans-serif">Living & Dining</text>
                      <text x="165" y="78" textAnchor="middle" fontSize="7" fill="#666666" fontFamily="monospace">16&apos; × 18&apos;</text>

                      {/* Kitchen & Bath */}
                      <rect x="115" y="125" width="60" height="50" fill="#F7F2EA" stroke="#141414" strokeWidth="1.5" />
                      <text x="145" y="152" textAnchor="middle" fontSize="8" fontWeight="600" fill="#141414" fontFamily="sans-serif">Kitchen</text>

                      <rect x="180" y="125" width="35" height="50" fill="#F2EFE8" stroke="#141414" strokeWidth="1.5" />
                      <text x="197" y="152" textAnchor="middle" fontSize="8" fontWeight="600" fill="#141414" fontFamily="sans-serif">Bath</text>

                      {/* Door swings indicators */}
                      <path d="M 110,60 A 15,15 0 0,0 110,75" fill="none" stroke="#666666" strokeWidth="1" strokeDasharray="2,2" />
                      <path d="M 110,130 A 15,15 0 0,0 110,145" fill="none" stroke="#666666" strokeWidth="1" strokeDasharray="2,2" />
                    </svg>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-ink-muted">
                    <span>Ground Floor</span>
                    <Link 
                      to={`/projects/${project.id}/design`} 
                      className="font-semibold text-ink hover:underline flex items-center gap-1"
                    >
                      <span>Open in 2D Editor</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

              {/* Card Footer Dimensions Bar */}
              <div className="px-5 py-3.5 bg-white border-t border-sand-200 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-ink">
                <div className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="font-bold">{heatedArea.toLocaleString('en-IN')} ft²</span>
                  <span className="text-ink-muted font-normal">Heated Area</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="font-bold">{totalArea.toLocaleString('en-IN')} ft²</span>
                  <span className="text-ink-muted font-normal">Total Area</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Maximize2 className="w-3.5 h-3.5 text-ink-muted" />
                  <span className="font-bold">53 ft 0 in x 58 ft 8 in</span>
                  <span className="text-ink-muted font-sans font-normal">Width x Depth</span>
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN (Inspiration 0, Cols 10-12 on LG) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Header: Inspiration (0) */}
            <h2 className="font-serif text-lg font-bold text-ink">
              Inspiration (0)
            </h2>

            {/* Inspiration Card Frame */}
            <div className="bg-white rounded-2xl border border-sand-300 p-6 shadow-subtle flex flex-col items-center justify-center text-center relative overflow-hidden group min-h-[380px] bg-gradient-to-b from-amber-50/20 via-white to-sand-50/30">
              
              {/* Artistic architectural sketch background */}
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none p-4">
                <svg viewBox="0 0 200 300" className="w-full h-full">
                  <path d="M 20,100 L 100,50 L 180,100 L 180,240 L 20,240 Z" fill="none" stroke="#CFC5B4" strokeWidth="1" strokeDasharray="3,3" />
                  <circle cx="100" cy="50" r="40" fill="#FAF5EA" opacity="0.5" />
                  <ellipse cx="100" cy="250" rx="70" ry="20" fill="#E8E2D5" opacity="0.6" />
                </svg>
              </div>

              {/* Center Plus & Action */}
              <div className="relative z-10 space-y-3">
                <button
                  onClick={() => navigate(`/projects/${project.id}/design`)}
                  className="w-12 h-12 rounded-full bg-white border border-sand-300 shadow-elevated flex items-center justify-center mx-auto text-ink hover:scale-110 hover:border-dark transition-all"
                >
                  <Plus className="w-6 h-6 stroke-[1.5]" />
                </button>
                <h4 className="font-serif text-base font-bold text-ink">
                  Explore Other Designs
                </h4>
                <p className="text-[11px] text-ink-muted max-w-[180px] mx-auto leading-relaxed">
                  Browse architectural concept variations, elevations, and layout directions.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Rename Modal */}
      <RenameModal
        isOpen={isRenameOpen}
        initialName={project.name || 'Spano Ka Ghar'}
        onRename={handleRenameConfirm}
        onCancel={() => setIsRenameOpen(false)}
      />

      {/* Invite Member Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div className="bg-white rounded-2xl border border-sand-300 p-6 max-w-sm w-full shadow-elevated space-y-4">
            <h3 className="font-serif text-lg font-bold text-ink">
              Invite Team Member
            </h3>
            <p className="text-xs text-ink-muted">
              Add a co-planner, architect, or family member to collaborate on this design.
            </p>
            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-sand-50 border border-sand-300 rounded-lg focus:outline-none focus:border-dark font-sans"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-dark hover:bg-dark-hover text-white rounded-lg shadow-subtle"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

