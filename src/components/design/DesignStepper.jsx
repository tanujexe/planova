import React from 'react';
import { 
  Users, 
  Shapes, 
  Sparkles, 
  Box, 
  ArrowRight, 
  Check, 
  Compass, 
  Layers,
  IndianRupee,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DesignStepper = ({
  projectId,
  currentStep = 'shapes',
  onOpenStudio,
  onOpen3D,
}) => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 'rooms',
      title: 'Create a Room List',
      status: 'completed',
      icon: Users,
      desc: 'BHK & spatial requirements validated',
    },
    {
      id: 'shapes',
      title: 'Shapes and Rooms',
      subtitle: 'Next Up',
      status: 'active',
      icon: Shapes,
      desc: 'Spatial zoning & bubble allocation',
    },
    {
      id: 'iterate',
      title: 'Create and Iterate',
      status: 'upcoming',
      icon: Sparkles,
      desc: 'Interactive 2D blueprint drafting',
      action: () => onOpenStudio ? onOpenStudio() : navigate(`/projects/${projectId}/design`),
    },
    {
      id: 'render',
      title: 'Render Design',
      status: 'upcoming',
      icon: Box,
      desc: 'Procedural 3D model & walkthrough',
      action: () => onOpen3D ? onOpen3D() : navigate(`/projects/${projectId}/3d`),
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE6DF] shadow-sm flex flex-col justify-between h-full min-w-[280px]">
      
      {/* Stepper Header */}
      <div>
        <h3 className="font-serif text-lg font-bold text-neutral-900 mb-1">
          Design Workflow
        </h3>
        <p className="text-xs text-neutral-500 mb-6">
          Architectural planning progress
        </p>

        {/* Steps List */}
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-[#EAE6DF] -z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active';

            return (
              <div 
                key={step.id} 
                onClick={step.action}
                className={`relative z-10 flex items-start gap-4 transition-all ${
                  step.action ? 'cursor-pointer hover:translate-x-0.5' : ''
                }`}
              >
                {/* Step Circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all shadow-xs
                    ${
                      isActive
                        ? 'bg-neutral-950 text-white ring-4 ring-neutral-200'
                        : isCompleted
                        ? 'bg-[#E3E8DE] text-neutral-800'
                        : 'bg-[#F2EFE9] text-neutral-500 hover:bg-[#EAE6DF]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-neutral-800 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Step Text */}
                <div className="pt-0.5 space-y-0.5">
                  {step.subtitle && (
                    <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                      {step.subtitle}
                    </span>
                  )}
                  <h4 className={`text-sm font-semibold ${isActive ? 'text-neutral-950 font-bold' : 'text-neutral-700'}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-8 space-y-2 border-t border-[#F2EFE9] mt-6">
        <button
          onClick={onOpenStudio ? onOpenStudio : () => navigate(`/projects/${projectId}/design`)}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-xs font-semibold transition-all shadow-sm"
        >
          <span>Open 2D Blueprint Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpen3D ? onOpen3D : () => navigate(`/projects/${projectId}/3d`)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#F5F2EC] hover:bg-[#EAE6DF] text-neutral-800 rounded-2xl text-xs font-semibold transition-all"
        >
          <Box className="w-3.5 h-3.5 text-neutral-600" />
          <span>View 3D Model & Walkthrough</span>
        </button>
      </div>

    </div>
  );
};
