import React from 'react';
import { Layout, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PlanCanvas } from '../design/PlanCanvas.jsx';

export const Fallback2DView = ({
  floorPlan,
  projectId,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-linen">
      {/* Notice Banner */}
      <div className="bg-sand-200 border-b border-sand-300 p-3 text-xs text-ink flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-terracotta-700 shrink-0" />
          <span>
            <strong>3D Acceleration Fallback:</strong> 3D hardware rendering is running in 2D preview mode on this device. Full geometric editing and cost calculations remain 100% active.
          </span>
        </div>

        <Link
          to={`/projects/${projectId}/design`}
          className="px-3 py-1 bg-white hover:bg-sand-100 rounded-lg text-xs font-semibold border border-sand-300 flex items-center gap-1 shrink-0"
        >
          <span>Open 2D Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Embedded 2D Plan View */}
      <div className="flex-1 relative overflow-hidden">
        <PlanCanvas floorPlan={floorPlan} readOnly={true} />
      </div>
    </div>
  );
};
