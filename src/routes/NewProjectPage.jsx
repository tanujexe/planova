import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Compass,
  Ruler
} from 'lucide-react';
import { RoomCatalogBuilder } from '../components/wizard/RoomCatalogBuilder.jsx';
import { PlaceRoomsWorkspace } from '../components/design/PlaceRoomsWorkspace.jsx';
import { useProjectStore } from '../store/useProjectStore.js';
import { GenerationService } from '../services/generation.js';

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { createProject, saveActiveProject } = useProjectStore();

  const [currentStep, setCurrentStep] = useState(1); // 1: RoomCatalogBuilder, 2: PlaceRoomsWorkspace
  const [projectDataState, setProjectDataState] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progressStage, setProgressStage] = useState('');

  // Step 1 -> Step 2 transition
  const handleRoomCatalogContinue = (projectData) => {
    setProjectDataState(projectData);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 -> Step 3 (Furnish & Render)
  const handleCompleteWorkspace = async (workspaceData) => {
    setIsBuilding(true);
    setProgressStage('Initializing architectural spatial boundaries...');

    try {
      const finalProjectData = {
        ...(projectDataState || {}),
        plot: workspaceData.plot || projectDataState?.plot || { width: 30, length: 50, floors: 2 },
        requirements: {
          ...(projectDataState?.requirements || { bhk: 3, budgetInr: 3500000 }),
          rooms: (workspaceData.placedRooms || []).map((r) => ({
            type: r.typeId || r.type || 'bedroom',
            count: 1,
            size: r.size || 'M',
            x: r.x,
            y: r.y,
            width: r.width,
            height: r.height,
          })),
        },
      };

      // 1. Create project in repository & store
      const newProjectId = createProject(finalProjectData);

      // 2. Deterministically generate the 3 concepts (Balanced, Open Living, Vastu Priority)
      setProgressStage('Generating constraint-validated layouts with Vastu...');
      const { options, defaultDesign } = await GenerationService.generate(
        { plot: finalProjectData.plot, requirements: finalProjectData.requirements },
        (stageIdx) => {
          if (stageIdx === 1) setProgressStage('Allocating circulation and room envelopes...');
          if (stageIdx === 2) setProgressStage('Aligning Vastu quadrants and openings...');
          if (stageIdx === 3) setProgressStage('Finalizing 3D massing and preliminary BOQ...');
        }
      );

      // 3. Save generated concepts to the project
      const updatedProject = {
        ...finalProjectData,
        id: newProjectId,
        designOptions: options,
        selectedOptionId: options[0].id,
        design: defaultDesign,
      };

      saveActiveProject(updatedProject);

      // 4. Navigate directly to the new project studio
      navigate(`/projects/${newProjectId}`);
    } catch (err) {
      console.error('Error generating project:', err);
      setIsBuilding(false);
    }
  };

  // Loading Overlay
  if (isBuilding) {
    return (
      <div className="flex-1 bg-[#F7F5F0] py-16 px-4 flex items-center justify-center">
        <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xl p-16 flex flex-col items-center justify-center text-center space-y-4 max-w-lg w-full">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center text-neutral-950 shadow-sm animate-spin">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl font-bold text-neutral-950">
              Building Your Architectural Home...
            </h3>
            <p className="text-xs text-neutral-500 font-mono">
              {progressStage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: The Moveable PlaceRoomsWorkspace matching user's screenshots
  if (currentStep === 2) {
    return (
      <PlaceRoomsWorkspace
        initialPlot={projectDataState?.plot || { width: 30, length: 50, floors: 2, facing: 'north' }}
        initialRooms={projectDataState?.requirements?.rooms || []}
        onBackToRoomList={() => setCurrentStep(1)}
        onCompleteToResults={handleCompleteWorkspace}
      />
    );
  }

  // Step 1: The RoomCatalogBuilder
  return (
    <div className="flex-1 bg-[#F7F5F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1550px] mx-auto space-y-6">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-9 h-9 rounded-xl bg-white hover:bg-[#F5F2EC] border border-[#DDD7CD] flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
              title="Back to Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-950">
                Design Your Home
              </h1>
              <p className="text-xs text-neutral-500">
                Step 1: Select your rooms, customize their sizes (S/M/L), and decide your plot area.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Step 1 of 2 • Spatial Brief</span>
          </div>
        </div>

        <RoomCatalogBuilder onBuildProject={handleRoomCatalogContinue} />

      </div>
    </div>
  );
};
