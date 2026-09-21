import React, { useState } from 'react';
import { 
  Armchair, 
  Bed, 
  Sparkles, 
  Trash2, 
  Plus, 
  RotateCw, 
  X, 
  ChevronRight,
  CookingPot,
  Bath,
  UtensilsCrossed,
  Layers,
  Search
} from 'lucide-react';
import { FURNITURE_CATALOG, FURNITURE_CATEGORIES } from '../../domain/furnitureCatalog.js';

export const FurnitureDrawer = ({
  isOpen,
  onClose,
  onAutoStage,
  onClearStaging,
  onAddFurniture,
  selectedRoom = null,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Items', icon: Layers },
    { id: FURNITURE_CATEGORIES.BEDROOM, label: 'Bedroom', icon: Bed },
    { id: FURNITURE_CATEGORIES.LIVING, label: 'Living Room', icon: Armchair },
    { id: FURNITURE_CATEGORIES.DINING, label: 'Dining', icon: UtensilsCrossed },
    { id: FURNITURE_CATEGORIES.KITCHEN, label: 'Kitchen & Utility', icon: CookingPot },
    { id: FURNITURE_CATEGORIES.BATHROOM, label: 'Bathroom', icon: Bath },
    { id: FURNITURE_CATEGORIES.ENTRY_POOJA, label: 'Pooja & Foyer', icon: Sparkles },
  ];

  const filteredCatalog = FURNITURE_CATALOG.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="absolute top-16 right-4 bottom-4 w-84 bg-white/95 backdrop-blur border border-sand-300 rounded-2xl shadow-elevated z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-4">
      {/* Header */}
      <div className="p-4 border-b border-sand-200 flex items-center justify-between bg-sand-50/70">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sage-100 text-sage-700 rounded-lg">
            <Armchair className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-ink">Interior Staging</h3>
            <p className="text-[10px] text-ink-muted">Architectural Furniture Catalog</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1 text-ink-muted hover:text-ink hover:bg-sand-200/60 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Stage Quick Actions */}
      <div className="p-3 bg-sage-50/50 border-b border-sage-100 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onAutoStage}
            className="flex-1 py-2 px-3 bg-sage-600 hover:bg-sage-700 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01]"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto-Stage Floor</span>
          </button>
          <button
            onClick={onClearStaging}
            className="py-2 px-3 bg-sand-100 hover:bg-terracotta/10 text-ink-muted hover:text-terracotta rounded-xl font-medium text-xs flex items-center gap-1 transition-colors"
            title="Clear all furniture on this floor"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
        {selectedRoom && (
          <div className="text-[11px] text-sage-800 bg-sage-100/70 px-2 py-1 rounded-lg flex items-center justify-between">
            <span>Targeting: <strong>{selectedRoom.label}</strong></span>
            <span className="text-[10px] opacity-75">{selectedRoom.width}&apos; × {selectedRoom.height}&apos;</span>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="p-2 border-b border-sand-200 flex gap-1 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`py-1 px-2.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isSelected 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-ink-muted hover:text-ink hover:bg-sand-100'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Catalog Items List */}
      <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5">
        {filteredCatalog.map((item) => (
          <div
            key={item.type}
            className="p-2.5 rounded-xl border border-sand-200 bg-white hover:border-sage-400 hover:shadow-subtle transition-all flex items-center justify-between group"
          >
            <div className="flex-1 pr-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-ink">{item.label}</span>
                <span className="text-[10px] font-mono text-ink-muted bg-sand-100 px-1.5 py-0.5 rounded">
                  {item.width}&apos; × {item.length}&apos;
                </span>
              </div>
              <p className="text-[10px] text-ink-muted mt-0.5 line-clamp-1">{item.description}</p>
            </div>
            <button
              onClick={() => onAddFurniture(item.type)}
              className="p-1.5 bg-sand-100 group-hover:bg-sage-600 group-hover:text-white text-ink-muted rounded-lg transition-colors shrink-0 shadow-2xs"
              title="Add furniture to floor"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
