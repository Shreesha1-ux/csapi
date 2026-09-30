import React from 'react';
import { X, Info } from 'lucide-react';

interface ConstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConstructionModal: React.FC<ConstructionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-7 text-slate-900 overflow-hidden text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 mb-4">
          <Info className="w-6 h-6 text-slate-600" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Dominate Everyone
        </h3>

        {/* Exact required text specified in user prompt */}
        <div className="p-4 my-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm leading-relaxed">
          &ldquo;Sorry, under construction note by shreesha&rdquo;
        </div>

        <p className="text-xs text-slate-500 mb-6">
          Global multi-tier competition across other groups is coming soon. You can continue practicing and competing in Dominate Class.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
