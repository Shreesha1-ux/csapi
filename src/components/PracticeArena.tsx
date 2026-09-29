import React, { useState } from 'react';
import { PracticeQuestion } from '../types';
import { PRACTICE_QUESTIONS_POOL } from '../data/practiceQuestions';
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  CheckCircle,
  XCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

interface PracticeArenaProps {
  onBackToDashboard: () => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({ onBackToDashboard }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  // Filter pool by category if selected
  const filteredPool =
    selectedCategory === 'All'
      ? PRACTICE_QUESTIONS_POOL
      : PRACTICE_QUESTIONS_POOL.filter((q) => q.category === selectedCategory);

  const activeQuestion: PracticeQuestion =
    filteredPool[currentIndex] || PRACTICE_QUESTIONS_POOL[0];

  const categories = [
    'All',
    'Bitwise Logic',
    'Algorithms',
    'Quantitative',
    'Logical Reasoning',
    'CS Core',
  ];

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasAnswered(true);
    setIsAccordionOpen(true); // Automatically open the Tricks & Tips accordion on answer
  };

  const handleNext = () => {
    setHasAnswered(false);
    setSelectedOptionId(null);
    setIsAccordionOpen(false);
    setCurrentIndex((prev) => (prev + 1) % filteredPool.length);
  };

  const handlePrev = () => {
    setHasAnswered(false);
    setSelectedOptionId(null);
    setIsAccordionOpen(false);
    setCurrentIndex((prev) => (prev - 1 + filteredPool.length) % filteredPool.length);
  };

  const handleRandom = () => {
    if (filteredPool.length <= 1) return;
    setHasAnswered(false);
    setSelectedOptionId(null);
    setIsAccordionOpen(false);
    let nextIdx = Math.floor(Math.random() * filteredPool.length);
    if (nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % filteredPool.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    setHasAnswered(false);
    setSelectedOptionId(null);
    setIsAccordionOpen(false);
  };

  const isCorrect = selectedOptionId === activeQuestion.correctOptionId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-6">
      {/* Top Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium self-start sm:self-auto">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stress-Free Study Arena • Zero Time Penalty</span>
        </div>
      </div>

      {/* Main Title & Description */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Practice Arena (Study &amp; Tips)
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Explore practice aptitude problems at your own pace. Solve without timers or score penalties, and learn step-by-step shortcut tricks for competitive exams.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Practice Question Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Card Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
              Practice #{currentIndex + 1} of {filteredPool.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-xs">
              {activeQuestion.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
              {activeQuestion.difficulty}
            </span>
          </div>

          {/* Quick cycle controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition-colors"
              title="Previous question"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleRandom}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition-colors"
              title="Pick a random question"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Shuffle</span>
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium transition-colors"
              title="Next question"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Content */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {activeQuestion.title}
          </h2>

          {activeQuestion.codeSnippet && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto leading-relaxed">
              <pre>{activeQuestion.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* 4 Interactive Option Cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          {activeQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === activeQuestion.correctOptionId;

            let cardStyle =
              'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800';

            if (hasAnswered) {
              if (isCorrectOption) {
                // Learning overlay: Soft green interface for correct answer
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                cardStyle = 'border-rose-300 bg-rose-50 text-rose-900';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${cardStyle} cursor-pointer`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasAnswered && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : hasAnswered && isSelected && !isCorrectOption
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {option.id}
                </div>
                <div className="text-sm leading-snug pt-0.5">{option.text}</div>
              </button>
            );
          })}
        </div>

        {/* Learning Overlays when user answers */}
        {hasAnswered && (
          <div className="space-y-4 pt-2">
            {/* 1. Correct Answer Soft Green Interface */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-emerald-900 block text-sm">
                  {isCorrect ? 'Correct choice!' : 'Correct Solution Revealed'}
                </span>
                <p className="mt-1 text-emerald-800">
                  <strong className="text-emerald-900">
                    Option ({activeQuestion.correctOptionId}):
                  </strong>{' '}
                  {activeQuestion.options.find((o) => o.id === activeQuestion.correctOptionId)?.text}
                </p>
                <p className="mt-1 text-emerald-700 text-[11px]">
                  {activeQuestion.explanation}
                </p>
              </div>
            </div>

            {/* 2. "Tricks & Tips" Dropdown Card (Toggle Accordion) */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 overflow-hidden transition-all">
              <button
                type="button"
                onClick={() => setIsAccordionOpen((prev) => !prev)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-blue-100/50 transition-colors"
                aria-expanded={isAccordionOpen}
              >
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-slate-900">
                    Tricks &amp; Tips: {activeQuestion.tips.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                  <span>{isAccordionOpen ? 'Hide Shortcut' : 'Show Shortcut'}</span>
                  {isAccordionOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Accordion Content */}
              {isAccordionOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-blue-100 text-xs text-slate-700 space-y-3">
                  {/* Quick Formula Banner */}
                  <div className="p-3 rounded-lg bg-white border border-blue-200 font-mono text-xs font-semibold text-blue-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Shortcut: {activeQuestion.tips.shortcut}</span>
                  </div>

                  {/* Step-by-Step Short-cut Method */}
                  <div>
                    <span className="font-semibold text-slate-900 block mb-1.5 text-xs">
                      Step-by-Step Fast Method:
                    </span>
                    <ol className="list-decimal pl-5 space-y-1.5 text-slate-600">
                      {activeQuestion.tips.steps.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Cycle to Next Question Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shadow-xs"
              >
                <span>Next Practice Problem</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Learning Footnote */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Pro-Tip:</strong> Reviewing these shortcut methods trains your intuition so you can solve problems under 15 seconds in the daily competitive &ldquo;Dominate Class&rdquo; arena.
        </span>
      </div>
    </div>
  );
};
