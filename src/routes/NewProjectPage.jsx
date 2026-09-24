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
import { useProjectStore } from '../store/useProjectStore.js';
import { GenerationService } from '../services/generation.js';

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { createProject, saveActiveProject } = useProjectStore();

  const [isBuilding, setIsBuilding] = useState(false);
  const [progressStage, setProgressStage] = useState('');

  // Directly generate project from Room Catalog selections
  const handleBuildProject = async (projectData) => {
    setIsBuilding(true);
    setProgressStage('Initializing architectural spatial boundaries...');

    try {
      const finalProjectData = {
        ...(projectData || {}),
        plot: projectData?.plot || { width: 30, length: 50, floors: 2 },
        requirements: {
          ...(projectData?.requirements || { bhk: 3, budgetInr: 3500000 }),
          rooms: projectData?.requirements?.rooms || [],
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

  // Room Catalog Builder
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
                Select your rooms, customize their sizes (S/M/L), and decide your plot area.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Spatial Brief</span>
          </div>
        </div>

        <RoomCatalogBuilder onBuildProject={handleBuildProject} />

      </div>
    </div>
  );
};
