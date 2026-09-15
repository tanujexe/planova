import React from 'react';
import { 
  MapPin, 
  Compass, 
  Layers, 
  Ruler, 
  Building2, 
  Info,
  Check
} from 'lucide-react';
import { formatDimension, formatArea } from '../../lib/units.js';

const POPULAR_CITIES = [
  'Bhopal, MP',
  'Bengaluru, KA',
  'Pune, MH',
  'Hyderabad, TS',
  'Jaipur, RJ',
  'Ahmedabad, GJ',
  'Delhi NCR',
  'Lucknow, UP'
];

const PRESET_PLOTS = [
  { label: '20 × 40 ft', width: 20, length: 40 },
  { label: '30 × 50 ft', width: 30, length: 50 },
  { label: '40 × 60 ft', width: 40, length: 60 },
  { label: '30 × 40 ft', width: 30, length: 40 },
];

export const PlotStep = ({
  formData,
  errors,
  onChange,
}) => {
  const plotAreaSqFt = (Number(formData.plot.width) || 0) * (Number(formData.plot.length) || 0);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-150">
      
      {/* Basic Project Details */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-sand-300 shadow-subtle space-y-5">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
          <Building2 className="w-4 h-4 text-sage-600" />
          <span>Project Identity & Location</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Project Name <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
              placeholder="e.g. Sharma Residence"
              className={`w-full px-3.5 py-2.5 text-sm bg-linen border rounded-xl text-ink focus:outline-none focus:ring-2 transition-all ${
                errors.name 
                  ? 'border-terracotta focus:ring-terracotta/20 focus:border-terracotta' 
                  : 'border-sand-300 focus:ring-sage-500/20 focus:border-sage-500'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-terracotta mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Client / Family Name <span className="text-ink-muted font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => onChange('clientName', e.target.value)}
              placeholder="e.g. Dr. Anand Sharma"
              className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sand-500" />
            <span>City & State in India</span>
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="e.g. Bhopal, Madhya Pradesh"
            className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all"
          />
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] text-ink-muted">Popular:</span>
            {POPULAR_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => onChange('location', city)}
                className="text-[10px] px-2 py-0.5 rounded-md bg-sand-100 hover:bg-sand-200 border border-sand-200 text-ink-muted hover:text-ink transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plot Dimensions & Orientation */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-sand-300 shadow-subtle space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-bold text-ink flex items-center gap-2">
            <Ruler className="w-4 h-4 text-sage-600" />
            <span>Plot Dimensions & Unit</span>
          </h3>

          <div className="inline-flex rounded-lg bg-sand-100 p-0.5 border border-sand-200">
            <button
              type="button"
              onClick={() => onChange('plot.unit', 'ft')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                formData.plot.unit === 'ft' ? 'bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Feet (ft)
            </button>
            <button
              type="button"
              onClick={() => onChange('plot.unit', 'm')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                formData.plot.unit === 'm' ? 'bg-white text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Meters (m)
            </button>
          </div>
        </div>

        {/* Preset quick plot buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-ink-muted">Standard Indian Plots:</span>
          {PRESET_PLOTS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                onChange('plot.width', preset.width);
                onChange('plot.length', preset.length);
              }}
              className={`text-xs px-3 py-1 rounded-lg border font-mono transition-all ${
                formData.plot.width === preset.width && formData.plot.length === preset.length
                  ? 'bg-sage-100 border-sage-500 text-sage-900 font-bold'
                  : 'bg-linen border-sand-300 text-ink hover:bg-sand-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Plot Width (Frontage) <span className="text-terracotta">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="200"
                value={formData.plot.width}
                onChange={(e) => onChange('plot.width', parseFloat(e.target.value) || 0)}
                className={`w-full px-3.5 py-2.5 text-sm bg-linen border rounded-xl text-ink font-mono focus:outline-none focus:ring-2 transition-all ${
                  errors['plot.width'] 
                    ? 'border-terracotta focus:ring-terracotta/20 focus:border-terracotta' 
                    : 'border-sand-300 focus:ring-sage-500/20 focus:border-sage-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-ink-muted">
                {formData.plot.unit}
              </span>
            </div>
            {errors['plot.width'] && (
              <p className="text-[11px] text-terracotta mt-1">{errors['plot.width']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Plot Length (Depth) <span className="text-terracotta">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="15"
                max="300"
                value={formData.plot.length}
                onChange={(e) => onChange('plot.length', parseFloat(e.target.value) || 0)}
                className={`w-full px-3.5 py-2.5 text-sm bg-linen border rounded-xl text-ink font-mono focus:outline-none focus:ring-2 transition-all ${
                  errors['plot.length'] 
                    ? 'border-terracotta focus:ring-terracotta/20 focus:border-terracotta' 
                    : 'border-sand-300 focus:ring-sage-500/20 focus:border-sage-500'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-ink-muted">
                {formData.plot.unit}
              </span>
            </div>
            {errors['plot.length'] && (
              <p className="text-[11px] text-terracotta mt-1">{errors['plot.length']}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Total Ground Area
            </label>
            <div className="px-3.5 py-2.5 bg-sand-100 rounded-xl border border-sand-200 text-ink font-mono text-sm font-bold flex items-center justify-between">
              <span>{plotAreaSqFt.toLocaleString('en-IN')}</span>
              <span className="text-xs text-ink-muted font-normal">sq.{formData.plot.unit === 'ft' ? 'ft' : 'm'}</span>
            </div>
          </div>
        </div>

        {/* Floors & Orientation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sand-500" />
              <span>Number of Floors</span>
            </label>
            <select
              value={formData.plot.floors}
              onChange={(e) => onChange('plot.floors', parseInt(e.target.value, 10))}
              className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all font-sans"
            >
              <option value={1}>Ground Floor Only (G)</option>
              <option value={2}>Ground + 1 Floor (G+1)</option>
              <option value={3}>Ground + 2 Floors (G+2)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-sand-500" />
              <span>Plot Facing</span>
            </label>
            <select
              value={formData.plot.facing}
              onChange={(e) => onChange('plot.facing', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all font-sans capitalize"
            >
              <option value="north">North Facing</option>
              <option value="east">East Facing</option>
              <option value="south">South Facing</option>
              <option value="west">West Facing</option>
              <option value="northeast">North-East Facing</option>
              <option value="northwest">North-West Facing</option>
              <option value="southeast">South-East Facing</option>
              <option value="southwest">South-West Facing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1.5">
              Access Road Direction
            </label>
            <select
              value={formData.plot.roadSide}
              onChange={(e) => onChange('plot.roadSide', e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 transition-all font-sans capitalize"
            >
              <option value="north">North Road</option>
              <option value="east">East Road</option>
              <option value="south">South Road</option>
              <option value="west">West Road</option>
            </select>
          </div>
        </div>

      </div>

    </div>
  );
};
