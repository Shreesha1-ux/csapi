import React from 'react';
import { UserProfile, LeaderboardUser, SolvedTodayFlags } from '../types';
import { Leaderboard } from './Leaderboard';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Play,
  BookOpen
} from 'lucide-react';

interface DominateClassProps {
  user: UserProfile;
  leaderboard: LeaderboardUser[];
  todayFlags: SolvedTodayFlags | null;
  onEnterTheGrind: () => void;
  onBackToDashboard: () => void;
  onRefreshLeaderboard: () => void;
  onOpenPractice?: () => void;
  isRefreshing?: boolean;
}

export const DominateClass: React.FC<DominateClassProps> = ({
  user,
  leaderboard,
  todayFlags,
  onEnterTheGrind,
  onBackToDashboard,
  onRefreshLeaderboard,
  onOpenPractice,
  isRefreshing,
}) => {
  const isCompletedToday = todayFlags?.completed ?? false;
  const solvedCountToday = todayFlags?.answers.length ?? 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-500">Section A • Live Sync</span>
        </div>
      </div>

      {/* Main Workspace Hero Card: Clean flat white card with light border */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
              <span>Dominate Class Workspace</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Classroom Aptitude Arena
            </h1>

            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Test your logic, algorithms, and speed with today&apos;s daily pool of 5 questions. Points decay over time—faster accurate answers yield higher scores.
            </p>

            {/* Anti-Exploit Status Pill */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {isCompletedToday
                    ? 'Today’s pool locked: Anti-exploit protection active'
                    : '1 attempt per day: Anti-exploit protection active'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>5 Questions Daily Pool</span>
              </div>
            </div>
          </div>

          {/* Action CTA: Action button named "Enter the Grind" (Strict prompt requirement) */}
          <div className="shrink-0 flex flex-col sm:items-start lg:items-end gap-2">
            {isCompletedToday ? (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Pool completed ({todayFlags?.totalScore.toLocaleString()} pts)</span>
                </div>

                <button
                  onClick={onEnterTheGrind}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter the Grind (Review Solutions)</span>
                </button>

                {onOpenPractice && (
                  <button
                    onClick={onOpenPractice}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Practice Arena (Study &amp; Tips)</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400 text-center lg:text-right">
                  Untimed practice &bull; Shortcut tricks
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <button
                  onClick={onEnterTheGrind}
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Enter the Grind</span>
                </button>
                <div className="text-xs text-slate-500 font-medium text-center lg:text-right">
                  {solvedCountToday > 0
                    ? `Resume Question ${solvedCountToday + 1} of 5`
                    : '5 Questions • Speed Decay Scoring'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Flat info tiles */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block font-medium">Daily Pool</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">5 Questions</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block font-medium">Scoring Engine</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">1000 to 200 pts</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block font-medium">Exploit Guard</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">solved_today_flags</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-slate-500 block font-medium">Leaderboard</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">Live Dynamic</span>
          </div>
        </div>
      </div>

      {/* Embedded Real-Time Leaderboard Component */}
      <div>
        <Leaderboard
          entries={leaderboard}
          currentUserId={user.id}
          onRefresh={onRefreshLeaderboard}
          isRefreshing={isRefreshing}
        />
      </div>
    </div>
  );
};
