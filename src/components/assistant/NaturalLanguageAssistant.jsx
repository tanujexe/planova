import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Lock,
  RotateCcw
} from 'lucide-react';
import { EditService } from '../../services/edit.js';

const QUICK_PROMPTS = [
  'Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.',
  'Enlarge the kitchen with attached utility.',
  'Move master bedroom to rear South-West quadrant.',
  'Add a front terrace balcony.',
  'Optimize layout for ₹30L budget target.'
];

export const NaturalLanguageAssistant = ({
  plan,
  requirements,
  onApplyMutation,
  onPreviewMutation,
  onClearPreview,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentProposal, setCurrentProposal] = useState(null);
  const [historyLog, setHistoryLog] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your Drafted AI architectural assistant. You can ask me to expand rooms, reposition zones according to Vastu, add terraces, or optimize for a budget constraint.',
    },
  ]);

  const handleSubmit = async (promptText) => {
    const textToSubmit = promptText || prompt;
    if (!textToSubmit.trim() || isProcessing) return;

    setIsProcessing(true);
    setCurrentProposal(null);

    // Add user message to log
    setHistoryLog((prev) => [...prev, { sender: 'user', text: textToSubmit }]);

    try {
      const proposal = await EditService.propose({
        plan,
        prompt: textToSubmit,
        requirements,
      });

      setCurrentProposal(proposal);

      if (proposal.mutation && onPreviewMutation) {
        onPreviewMutation(proposal.mutation.newPlan, proposal.mutation.affectedRoomIds);
      }

      setHistoryLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: proposal.explanation,
          proposal,
        },
      ]);
    } catch (err) {
      console.error('Error in AI Assistant propose:', err);
    } finally {
      setIsProcessing(false);
      setPrompt('');
    }
  };

  const handleConfirm = () => {
    if (currentProposal && currentProposal.mutation) {
      onApplyMutation(currentProposal.mutation.newPlan);
      setCurrentProposal(null);
      if (onClearPreview) onClearPreview();
    }
  };

  const handleDiscard = () => {
    setCurrentProposal(null);
    if (onClearPreview) onClearPreview();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      
      {/* Header */}
      <div className="p-4 border-b border-sand-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-sage-500 text-white flex items-center justify-center shadow-subtle">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-sm text-ink">
              Planova AI Copilot
            </h3>
            <p className="text-[10px] uppercase tracking-wider text-sage-800 font-semibold">
              Spatial Mutation Engine
            </p>
          </div>
        </div>
      </div>

      {/* Messages Timeline */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {historyLog.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-sage-500 text-white font-medium rounded-br-none shadow-subtle'
                  : 'bg-linen border border-sand-300 text-ink rounded-bl-none'
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs text-ink-muted p-3 bg-sand-100 rounded-xl animate-pulse">
            <Sparkles className="w-4 h-4 text-sage-600 animate-spin" />
            <span>Analyzing spatial relationships and verifying boundaries...</span>
          </div>
        )}

        {/* Active Proposal Card */}
        {currentProposal && currentProposal.mutation && (
          <div className="bg-sage-50 rounded-2xl border-2 border-sage-500 p-4 shadow-elevated space-y-3.5 animate-in fade-in-50 duration-150">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase bg-sage-500 text-white px-2 py-0.5 rounded font-bold shadow-subtle">
                Proposed Mutation
              </span>
              <button
                onClick={handleDiscard}
                className="text-ink-muted hover:text-ink p-1 rounded hover:bg-sand-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-ink">
              <span className="font-bold block text-[11px]">Architectural Trade-offs:</span>
              {currentProposal.tradeoffs.map((item, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] leading-relaxed text-ink-muted">
                  <span className="text-sage-700 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-sage-200 flex gap-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="flex-1 py-2 bg-white hover:bg-sand-100 text-ink text-xs font-semibold rounded-xl border border-sand-300 transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-2 bg-sage-500 hover:bg-sage-600 text-white text-xs font-semibold rounded-xl shadow-subtle flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply Proposal</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase font-bold text-ink-muted block mb-2">
            Try a Quick Prompt:
          </span>
          <div className="space-y-2">
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(q);
                  handleSubmit(q);
                }}
                className="w-full p-2.5 bg-linen hover:bg-sand-100 rounded-xl border border-sand-200 text-left text-[11px] text-ink transition-all flex items-center justify-between group"
              >
                <span className="truncate pr-2 font-serif italic text-ink-muted group-hover:text-ink">
                  “{q}”
                </span>
                <ArrowRight className="w-3 h-3 text-sand-400 group-hover:text-sage-700 shrink-0" />
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="p-3 border-t border-sand-200 bg-sand-50"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask Drafted AI to modify layout..."
            className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500 text-ink"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isProcessing}
            className="px-4 py-2.5 bg-sage-500 hover:bg-sage-600 disabled:opacity-40 text-white rounded-xl text-xs font-semibold shadow-subtle transition-all flex items-center justify-center"
          >
            <Wand2 className="w-4 h-4" />
          </button>
        </div>
      </form>

    </div>
  );
};
