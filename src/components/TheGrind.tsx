import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, Question, AnswerRecord, SolvedTodayFlags } from '../types';
import { DAILY_APTITUDE_POOL } from '../data/questions';
import { saveSolvedTodayFlags, getTodayDateString } from '../services/storage';
import { playTickSound, playCorrectSound, playIncorrectSound } from '../services/sound';
import {
  Timer,
  CheckCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Trophy,
  Flame,
  Info,
  Clock,
  ArrowLeft,
  BookOpen
} from 'lucide-react';

interface TheGrindProps {
  user: UserProfile;
  initialFlags: SolvedTodayFlags | null;
  onExit: () => void;
  onComplete: (flags: SolvedTodayFlags) => void;
  onOpenPractice?: () => void;
}

export const TheGrind: React.FC<TheGrindProps> = ({
  user,
  initialFlags,
  onExit,
  onComplete,
  onOpenPractice,
}) => {
  const questions = DAILY_APTITUDE_POOL;
  const totalQuestions = questions.length;

  // Check if user already solved today (Exploit prevention)
  const isAlreadyCompleted = initialFlags?.completed ?? false;

  // Restore partial progress if user refreshed mid-grind
  const restoredAnswers = initialFlags?.answers || [];
  const initialIndex = isAlreadyCompleted ? 0 : Math.min(restoredAnswers.length, totalQuestions - 1);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialIndex);
  const [answers, setAnswers] = useState<AnswerRecord[]>(restoredAnswers);
  const [isFinished, setIsFinished] = useState(isAlreadyCompleted);

  // Active question timer & dynamic scoring engine
  const currentQuestion: Question = questions[currentQuestionIndex];
  const timeLimitMs = (currentQuestion?.timeLimitSec || 25) * 1000;
  const [timeRemainingMs, setTimeRemainingMs] = useState(timeLimitMs);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [currentPointsAwarded, setCurrentPointsAwarded] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Dynamic decaying score calculation:
  // Decays from maxPoints (1000) down to floor (200) based on remaining time
  const calculateCurrentScore = useCallback(
    (remainingMs: number): number => {
      const ratio = Math.max(0, Math.min(1, remainingMs / timeLimitMs));
      return Math.round(200 + 800 * ratio);
    },
    [timeLimitMs]
  );

  const currentPotentialPoints = calculateCurrentScore(timeRemainingMs);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer loop for active question
  useEffect(() => {
    if (isFinished || isAlreadyCompleted || hasAnsweredCurrent) return;

    setTimeRemainingMs(timeLimitMs);
    startTimeRef.current = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeLimitMs - elapsed);
      setTimeRemainingMs(remaining);

      if (remaining > 0 && remaining <= 4000 && Math.floor(remaining) % 1000 < 50) {
        playTickSound();
      }

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        handleTimeout();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestionIndex, isFinished, isAlreadyCompleted, hasAnsweredCurrent, timeLimitMs]);

  // Handle Timeout
  const handleTimeout = () => {
    if (hasAnsweredCurrent) return;
    setHasAnsweredCurrent(true);
    setSelectedOptionId('TIMEOUT');
    setCurrentPointsAwarded(0);
    playIncorrectSound();

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOptionId: 'TIMEOUT',
      isCorrect: false,
      timeTakenSec: currentQuestion.timeLimitSec,
      pointsEarned: 0,
    };

    saveAnswerProgress(record);
  };

  // Dynamic Selection & Scoring Process
  const handleSelectOption = (optionId: string) => {
    if (hasAnsweredCurrent || isFinished || isAlreadyCompleted) return;

    if (timerRef.current) clearInterval(timerRef.current);

    const timeTakenSec = parseFloat(((Date.now() - startTimeRef.current) / 1000).toFixed(2));
    const isCorrect = optionId === currentQuestion.correctOptionId;
    const earnedPoints = isCorrect ? calculateCurrentScore(timeRemainingMs) : 0;

    setSelectedOptionId(optionId);
    setHasAnsweredCurrent(true);
    setCurrentPointsAwarded(earnedPoints);

    if (isCorrect) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
      timeTakenSec,
      pointsEarned: earnedPoints,
    };

    saveAnswerProgress(record);
  };

  // Anti-Exploit persistence
  const saveAnswerProgress = (newRecord: AnswerRecord) => {
    const updatedAnswers = [...answers, newRecord];
    setAnswers(updatedAnswers);

    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const totalScore = updatedAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const correctCount = updatedAnswers.filter((a) => a.isCorrect).length;

    const flags: SolvedTodayFlags = {
      date: getTodayDateString(),
      completed: isLastQuestion,
      completedAt: isLastQuestion ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      totalScore,
      correctCount,
      answers: updatedAnswers,
      isLocked: isLastQuestion,
    };

    saveSolvedTodayFlags(user.id, flags);

    if (isLastQuestion) {
      setTimeout(() => {
        setIsFinished(true);
        onComplete(flags);
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setHasAnsweredCurrent(false);
      setSelectedOptionId(null);
      setCurrentPointsAwarded(0);
    }
  };

  // If Grind is Finished or Already Completed (Exploit prevention view)
  if (isFinished || isAlreadyCompleted) {
    const finalAnswers = answers.length > 0 ? answers : initialFlags?.answers || [];
    const totalScore = finalAnswers.reduce((acc, a) => acc + a.pointsEarned, 0);
    const correctAnswers = finalAnswers.filter((a) => a.isCorrect).length;
    const avgSpeed =
      finalAnswers.length > 0
        ? (finalAnswers.reduce((acc, a) => acc + a.timeTakenSec, 0) / finalAnswers.length).toFixed(1)
        : '0.0';

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          {/* Header */}
          <div className="text-center pb-8 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Solved Today Flags: Verified &amp; Saved</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Grind Completed
            </h2>
            <p className="mt-1 text-slate-500 text-sm max-w-lg mx-auto">
              Your score has been registered to the classroom leaderboard. You have completed all 5 questions for today.
            </p>

            {/* Score Showcase */}
            <div className="mt-6 flex flex-col items-center">
              <div className="px-6 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider block">Today&apos;s Score</span>
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                  {totalScore.toLocaleString()}
                  <span className="text-sm font-medium text-slate-500 ml-1">pts</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 my-8">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-xs text-slate-500 block font-medium">Correct</span>
              <span className="text-xl font-bold text-slate-900">{correctAnswers} / {totalQuestions}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Timer className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-xs text-slate-500 block font-medium">Avg Speed</span>
              <span className="text-xl font-bold text-slate-900">{avgSpeed}s</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Flame className="w-5 h-5 text-orange-500 mx-auto mb-1 fill-orange-500" />
              <span className="text-xs text-slate-500 block font-medium">Streak</span>
              <span className="text-xl font-bold text-slate-900">{user.currentStreak} Days</span>
            </div>
          </div>

          {/* Explanations and Answers Review */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Questions &amp; Explanations Breakdown
            </h3>

            {questions.map((q, idx) => {
              const userAns = finalAnswers.find((a) => a.questionId === q.id);
              const isCorrect = userAns?.isCorrect ?? false;
              const points = userAns?.pointsEarned ?? 0;
              const selectedOpt = q.options.find((o) => o.id === userAns?.selectedOptionId);
              const correctOpt = q.options.find((o) => o.id === q.correctOptionId);

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-xl border ${
                    isCorrect
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : 'bg-rose-50/40 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white text-xs font-bold text-slate-700 border border-slate-200">
                        Q{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">{q.category}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {isCorrect ? `+${points} pts` : '+0 pts'}
                      </span>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mb-2">{q.title}</p>

                  <div className="text-xs space-y-1 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Your Answer:</span>
                      <span className={isCorrect ? 'text-emerald-800 font-semibold' : 'text-rose-800 line-through'}>
                        {selectedOpt ? `(${selectedOpt.id}) ${selectedOpt.text}` : 'Timeout (No answer)'}
                      </span>
                    </div>
                    {!isCorrect && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Correct Answer:</span>
                        <span className="text-emerald-800 font-semibold">
                          ({correctOpt?.id}) {correctOpt?.text}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{q.explanation}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Next daily aptitude pool unlocks tomorrow</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              {onOpenPractice && (
                <button
                  onClick={onOpenPractice}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Practice Arena (Study &amp; Tips)</span>
                </button>
              )}
              <button
                onClick={onExit}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Trophy className="w-4 h-4" />
                <span>Return to Leaderboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active testing interface
  const remainingSeconds = Math.ceil(timeRemainingMs / 1000);
  const timeProgressPercent = (timeRemainingMs / timeLimitMs) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Exploit Guard Active: solved_today_flags</span>
        </div>
      </div>

      {/* Main Question Card: Clean flat white card with light border */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Progress Bar & Header */}
        <div className="flex flex-col gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-xs">
                {currentQuestion.category}
              </span>
            </div>

            {/* Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold">
              <span>Current Score: +{currentPotentialPoints} pts</span>
            </div>
          </div>

          {/* Time Decay Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 font-medium">Speed Clock:</span>
              <span className={`font-semibold ${remainingSeconds <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                {remainingSeconds}s remaining
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-75 ease-linear rounded-full ${
                  remainingSeconds <= 5 ? 'bg-rose-500' : 'bg-blue-600'
                }`}
                style={{ width: `${timeProgressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question Statement */}
        <div className="py-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {currentQuestion.title}
          </h2>

          {/* Optional Code Snippet */}
          {currentQuestion.codeSnippet && (
            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs sm:text-sm text-slate-800 overflow-x-auto leading-relaxed">
              <pre>{currentQuestion.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* 4 Clean Interactive Option Cards */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === currentQuestion.correctOptionId;

            let cardStyle =
              'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800';

            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
              } else if (isSelected && !isCorrectOption) {
                cardStyle = 'border-rose-400 bg-rose-50 text-rose-900 font-semibold';
              } else {
                cardStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={option.id}
                disabled={hasAnsweredCurrent}
                onClick={() => handleSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-colors ${cardStyle} ${
                  !hasAnsweredCurrent ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                    hasAnsweredCurrent && isCorrectOption
                      ? 'bg-emerald-600 text-white'
                      : hasAnsweredCurrent && isSelected && !isCorrectOption
                      ? 'bg-rose-600 text-white'
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

        {/* Immediate Feedback Card after selection */}
        {hasAnsweredCurrent && (
          <div className="mt-6 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                {selectedOptionId === currentQuestion.correctOptionId ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-bold text-emerald-700 text-sm">
                      Correct! Awarded: +{currentPointsAwarded} pts
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span className="font-bold text-rose-700 text-sm">
                      Incorrect (0 pts). Correct Answer: ({currentQuestion.correctOptionId})
                    </span>
                  </>
                )}
              </div>

              {currentQuestionIndex < totalQuestions - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 self-end sm:self-center"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="mt-3 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Explanation:</strong> {currentQuestion.explanation}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 px-1 flex items-center justify-between text-xs text-slate-400">
        <span>Speed Scoring: 1000 max points decaying down to 200 base</span>
        <span>Anti-exploit lock active</span>
      </div>
    </div>
  );
};
