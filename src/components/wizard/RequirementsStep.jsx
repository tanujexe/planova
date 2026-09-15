import React from 'react';
import { 
  Home, 
  Car, 
  Wind, 
  Sparkles, 
  IndianRupee, 
  Check,
  ShieldAlert,
  Sliders
} from 'lucide-react';
import { formatInr, formatInrShorthand } from '../../lib/currency.js';

const BUDGET_PRESETS = [
  2500000,
  3000000,
  3500000,
  4500000,
  6000000,
];

export const RequirementsStep = ({
  formData,
  errors,
  onChange,
}) => {
  const req = formData.requirements;

  const toggleRoom = (type) => {
    const existing = req.rooms || [];
    const foundIndex = existing.findIndex(r => r.type === type);
    let updated;
    if (foundIndex >= 0) {
      updated = existing.filter(r => r.type !== type);
    } else {
      updated = [...existing, { type, count: 1 }];
    }
    onChange('requirements.rooms', updated);
  };

  const hasRoom = (type) => {
    return Boolean(req.rooms?.some(r => r.type === type));
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      
      {/* BHK & Room Structure */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-sand-300 shadow-subtle space-y-5">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Home className="w-4 h-4 text-sage-600" />
          <span>BHK & Indian Living Spaces</span>
        </h3>

        {/* BHK Selector */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-2">
            Select Configuration (BHK)
          </label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((bhk) => (
              <button
                key={bhk}
                type="button"
                onClick={() => onChange('requirements.bhk', bhk)}
                className={`py-3 px-4 rounded-xl border text-center transition-all ${
                  req.bhk === bhk
                    ? 'bg-sage-100 border-sage-500 text-sage-900 font-bold shadow-subtle'
                    : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                }`}
              >
                <span className="block font-display text-lg">{bhk} BHK</span>
                <span className="text-[10px] text-ink-muted block mt-0.5">
                  {bhk === 1 ? 'Compact' : bhk === 2 ? 'Couple' : bhk === 3 ? 'Standard Family' : 'Large Family'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms & Attached */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Total Bathrooms
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChange('requirements.bathrooms', cnt)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    req.bathrooms === cnt
                      ? 'bg-sage-500 text-white border-sage-600'
                      : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                  }`}
                >
                  {cnt} Bath
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Attached Bathrooms
            </label>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChange('requirements.attachedBathrooms', cnt)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${
                    req.attachedBathrooms === cnt
                      ? 'bg-sage-500 text-white border-sage-600'
                      : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Indian Specific Room Features */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-ink-muted mb-2">
            Specialized Indian Residential Spaces
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => toggleRoom('pooja')}
              className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                hasRoom('pooja') 
                  ? 'bg-sage-50 border-sage-400 text-ink shadow-subtle' 
                  : 'bg-linen border-sand-200 text-ink-muted hover:border-sand-300'
              }`}
            >
              <div>
                <span className="font-semibold text-xs text-ink block">Pooja Room / Mandir</span>
                <span className="text-[11px] text-ink-muted">Auspicious North-East zone orientation</span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                hasRoom('pooja') ? 'bg-sage-500 border-sage-600 text-white' : 'border-sand-400 bg-white'
              }`}>
                {hasRoom('pooja') && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleRoom('utility')}
              className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                hasRoom('utility') 
                  ? 'bg-sage-50 border-sage-400 text-ink shadow-subtle' 
                  : 'bg-linen border-sand-200 text-ink-muted hover:border-sand-300'
              }`}
            >
              <div>
                <span className="font-semibold text-xs text-ink block">Utility & Wash Area</span>
                <span className="text-[11px] text-ink-muted">Attached to kitchen for washing & storage</span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                hasRoom('utility') ? 'bg-sage-500 border-sage-600 text-white' : 'border-sand-400 bg-white'
              }`}>
                {hasRoom('utility') && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleRoom('balcony')}
              className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                hasRoom('balcony') 
                  ? 'bg-sage-50 border-sage-400 text-ink shadow-subtle' 
                  : 'bg-linen border-sand-200 text-ink-muted hover:border-sand-300'
              }`}
            >
              <div>
                <span className="font-semibold text-xs text-ink block">Balcony / Open Sit-out</span>
                <span className="text-[11px] text-ink-muted">Front road or garden facing balcony</span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                hasRoom('balcony') ? 'bg-sage-500 border-sage-600 text-white' : 'border-sand-400 bg-white'
              }`}>
                {hasRoom('balcony') && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => toggleRoom('study')}
              className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all ${
                hasRoom('study') 
                  ? 'bg-sage-50 border-sage-400 text-ink shadow-subtle' 
                  : 'bg-linen border-sand-200 text-ink-muted hover:border-sand-300'
              }`}
            >
              <div>
                <span className="font-semibold text-xs text-ink block">Study / Home Office</span>
                <span className="text-[11px] text-ink-muted">Quiet corner for work and study</span>
              </div>
              <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                hasRoom('study') ? 'bg-sage-500 border-sage-600 text-white' : 'border-sand-400 bg-white'
              }`}>
                {hasRoom('study') && <Check className="w-3.5 h-3.5" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Parking & Ventilation */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-sand-300 shadow-subtle space-y-5">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Car className="w-4 h-4 text-sage-600" />
          <span>Vehicles & Indian Climate Comfort</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Car Parking (Ground Floor)
            </label>
            <div className="flex gap-2">
              {[0, 1, 2].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChange('requirements.parking.cars', cnt)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    req.parking?.cars === cnt
                      ? 'bg-sage-500 text-white border-sage-600'
                      : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                  }`}
                >
                  {cnt === 0 ? 'No Car' : cnt === 1 ? '1 Car' : '2 Cars'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Two-Wheeler / Bike Parking
            </label>
            <div className="flex gap-2">
              {[0, 1, 2].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => onChange('requirements.parking.twoWheelers', cnt)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    req.parking?.twoWheelers === cnt
                      ? 'bg-sage-500 text-white border-sage-600'
                      : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                  }`}
                >
                  {cnt === 0 ? 'None' : cnt === 1 ? '1 Bike' : '2 Bikes'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-sand-500" />
            <span>Cross Ventilation & Shading Priority</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => onChange('requirements.ventilation', 'high')}
              className={`p-3 rounded-xl border text-left transition-all ${
                req.ventilation === 'high'
                  ? 'bg-sage-100 border-sage-500 text-ink font-semibold'
                  : 'bg-linen border-sand-300 text-ink-muted hover:bg-sand-100'
              }`}
            >
              <span className="block text-xs text-ink">High (Recommended)</span>
              <span className="text-[10px] text-ink-muted">Dual aspect windows for Indian hot climate cross-breeze</span>
            </button>

            <button
              type="button"
              onClick={() => onChange('requirements.ventilation', 'standard')}
              className={`p-3 rounded-xl border text-left transition-all ${
                req.ventilation === 'standard'
                  ? 'bg-sage-100 border-sage-500 text-ink font-semibold'
                  : 'bg-linen border-sand-300 text-ink-muted hover:bg-sand-100'
              }`}
            >
              <span className="block text-xs text-ink">Standard</span>
              <span className="text-[10px] text-ink-muted">Single wall openings where adequate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vastu & Budget Section */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-sand-300 shadow-subtle space-y-5">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sage-600" />
          <span>Vastu Preference & Construction Budget</span>
        </h3>

        {/* Vastu Selector */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-1.5">
            Vastu Alignment Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'off', label: 'Off', desc: 'Prioritize pure space efficiency' },
              { val: 'basic', label: 'Basic', desc: 'Align Pooja in NE, Master in SW, Kitchen in SE' },
              { val: 'high', label: 'High', desc: 'Strict traditional directional alignment' },
            ].map((v) => (
              <button
                key={v.val}
                type="button"
                onClick={() => onChange('requirements.vastu', v.val)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  req.vastu === v.val
                    ? 'bg-sage-100 border-sage-500 text-ink font-semibold'
                    : 'bg-linen border-sand-300 text-ink-muted hover:bg-sand-100'
                }`}
              >
                <span className="block text-xs font-bold text-ink capitalize">{v.label}</span>
                <span className="text-[10px] text-ink-muted block mt-0.5 leading-tight">{v.desc}</span>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-ink-muted mt-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-sage-600 shrink-0" />
            <span>Vastu is treated as a user preference layer with transparent spatial trade-offs.</span>
          </p>
        </div>

        {/* Budget in INR */}
        <div className="pt-2 border-t border-sand-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-ink-muted flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5 text-sand-500" />
              <span>Target Construction Budget (INR ₹)</span>
            </label>
            <span className="font-display font-bold text-base text-ink">
              {formatInr(req.budgetInr)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            {BUDGET_PRESETS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => onChange('requirements.budgetInr', amt)}
                className={`text-xs px-3 py-1 rounded-lg border font-mono transition-all ${
                  req.budgetInr === amt
                    ? 'bg-sage-500 text-white border-sage-600 font-bold'
                    : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                }`}
              >
                {formatInrShorthand(amt)}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="1500000"
            max="10000000"
            step="100000"
            value={req.budgetInr || 3500000}
            onChange={(e) => onChange('requirements.budgetInr', parseInt(e.target.value, 10))}
            className="w-full accent-sage-600 h-2 bg-sand-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Quality Tier */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-ink-muted mb-1.5">
            Construction & Finish Quality Tier
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'economy', label: 'Economy', rate: '₹1,500/sq.ft' },
              { val: 'standard', label: 'Standard', rate: '₹1,900/sq.ft' },
              { val: 'premium', label: 'Premium', rate: '₹2,500/sq.ft' },
            ].map((q) => (
              <button
                key={q.val}
                type="button"
                onClick={() => onChange('requirements.quality', q.val)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  req.quality === q.val
                    ? 'bg-sage-500 text-white border-sage-600 font-bold'
                    : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
                }`}
              >
                <span className="block text-xs capitalize">{q.label}</span>
                <span className="text-[10px] opacity-80 font-mono block mt-0.5">{q.rate}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
