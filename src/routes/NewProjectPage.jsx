import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Layers, 
  Ruler, 
  Home,
  CheckCircle2
} from 'lucide-react';
import { PlotStep } from '../components/wizard/PlotStep.jsx';
import { RequirementsStep } from '../components/wizard/RequirementsStep.jsx';
import { FeasibilityModal } from '../components/wizard/FeasibilityModal.jsx';
import { checkBriefFeasibility } from '../services/feasibility.js';
import { useProjectStore } from '../store/useProjectStore.js';

export const NewProjectPage = () => {
  const navigate = useNavigate();
  const { createProject } = useProjectStore();

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [feasibilityResult, setFeasibilityResult] = useState(null);
  const [isFeasibilityModalOpen, setIsFeasibilityModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    location: 'Bhopal, Madhya Pradesh',
    plot: {
      width: 30,
      length: 50,
      unit: 'ft',
      floors: 2,
      roadSide: 'north',
      facing: 'north',
      setbacks: { front: 3, rear: 3, left: 2, right: 2 },
    },
    requirements: {
      bhk: 3,
      bathrooms: 2,
      attachedBathrooms: 1,
      rooms: [
        { type: 'pooja', count: 1 },
        { type: 'utility', count: 1 },
        { type: 'balcony', count: 1 },
      ],
      parking: { cars: 1, twoWheelers: 1 },
      ventilation: 'high',
      vastu: 'basic',
      budgetInr: 3500000,
      quality: 'standard',
    },
  });

  const handleFieldChange = (path, value) => {
    setFormData((prev) => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let current = next;
      for (let i = 0; i < parts.length - 1; i++) {
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return next;
    });

    // Clear error for that field
    if (errors[path] || errors[parts[0]]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[path];
        return next;
      });
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide a project name';
    }
    if (!formData.plot.width || formData.plot.width <= 0) {
      errs['plot.width'] = 'Width must be greater than 0';
    }
    if (!formData.plot.length || formData.plot.length <= 0) {
      errs['plot.length'] = 'Length must be greater than 0';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (step === 2) {
      // Evaluate feasibility
      const check = checkBriefFeasibility(formData.plot, formData.requirements);
      setFeasibilityResult(check);

      if (!check.isFeasible) {
        setIsFeasibilityModalOpen(true);
      } else {
        submitProject();
      }
    }
  };

  const submitProject = () => {
    const projectId = createProject(formData);
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="flex-1 bg-blueprint-grid py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Wizard Progress & Breadcrumb */}
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-500 text-white flex items-center justify-center font-display font-bold shadow-subtle">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
                Step {step} of 2
              </span>
              <h1 className="font-display text-lg font-bold text-ink">
                {step === 1 ? 'Plot Specification & Orientation' : 'Indian Residential Brief'}
              </h1>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => step === 2 && setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                step === 1
                  ? 'bg-sage-100 text-sage-900 border border-sage-300'
                  : 'bg-sand-100 text-ink-muted hover:text-ink'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>1. Plot & Site</span>
            </button>
            <div className="h-4 w-px bg-sand-300" />
            <button
              type="button"
              onClick={() => step === 1 && validateStep1() && setStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                step === 2
                  ? 'bg-sage-100 text-sage-900 border border-sage-300'
                  : 'bg-sand-100 text-ink-muted'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>2. Requirements</span>
            </button>
          </div>
        </div>

        {/* Wizard Step Content */}
        {step === 1 ? (
          <PlotStep
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        ) : (
          <RequirementsStep
            formData={formData}
            errors={errors}
            onChange={handleFieldChange}
          />
        )}

        {/* Navigation & Action Bar */}
        <div className="bg-white p-5 rounded-2xl border border-sand-300 shadow-subtle flex items-center justify-between">
          <div>
            {step === 2 ? (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-sand-100 hover:bg-sand-200 text-ink text-xs font-semibold rounded-xl border border-sand-300 transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Plot</span>
              </button>
            ) : (
              <Link
                to="/"
                className="text-xs text-ink-muted hover:text-ink font-semibold"
              >
                Cancel
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-subtle hover:shadow-elevated transition-all"
          >
            <span>{step === 1 ? 'Continue to Requirements' : 'Generate Design Options'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Feasibility Warning Modal */}
        <FeasibilityModal
          isOpen={isFeasibilityModalOpen}
          feasibilityResult={feasibilityResult}
          onProceedAnyway={() => {
            setIsFeasibilityModalOpen(false);
            submitProject();
          }}
          onEditRequirements={() => {
            setIsFeasibilityModalOpen(false);
          }}
        />

      </div>
    </div>
  );
};
