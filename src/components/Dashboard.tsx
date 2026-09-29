import React from 'react';
import { UserProfile, SolvedTodayFlags } from '../types';
import { ANIMAL_AVATARS } from '../data/questions';
import { Users, Globe, ArrowRight, Flame, Award, Clock, BookOpen } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  todayFlags: SolvedTodayFlags | null;
  onSelectOptionA: () => void; // Dominate Class
  onSelectOptionB: () => void; // Dominate Everyone (triggers "Sorry, under construction note by shreesha")
  onSelectPractice: () => void; // Practice Arena (Study & Tips)
  onOpenProfile: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  todayFlags,
  onSelectOptionA,
  onSelectOptionB,
  onSelectPractice,
  onOpenProfile,
}) => {
  const avatar = ANIMAL_AVATARS.find((a) => a.id === user.avatarId) || ANIMAL_AVATARS[0];
  const isSolvedToday = todayFlags?.completed ?? false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Welcome Banner: Clean white card with soft shadow and light border */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenProfile}
              className={`w-14 h-14 rounded-2xl ${avatar.bgColor} flex items-center justify-center text-3xl shadow-xs transition-opacity hover:opacity-90`}
              title="Click to view full profile and streak stats"
            >
              {avatar.emoji}
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Classroom Arena
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back, {user.name}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Practice daily aptitude and climb your class rankings.
              </p>
            </div>
          </div>

          {/* Clean status indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <div className="text-xs">
                <span className="text-slate-500 block font-medium">Streak</span>
                <span className="text-slate-900 font-bold">{user.currentStreak} Days</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="text-xs">
                <span className="text-slate-500 block font-medium">Daily Pool</span>
                <span className="text-slate-900 font-bold">
                  {isSolvedToday ? '5/5 Solved' : `${todayFlags?.answers.length ?? 0}/5 Solved`}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-500" />
              <div className="text-xs">
                <span className="text-slate-500 block font-medium">High Score</span>
                <span className="text-slate-900 font-bold">{user.highScore.toLocaleString()} pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">
          Competitive Arena
        </h2>
        <p className="text-sm text-slate-500">
          Choose between your active classroom workspace or global challenges.
        </p>
      </div>

      {/* Two Primary Navigation Options (Prompt Requirement) */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* OPTION A: "Dominate Class" */}
        <div
          onClick={onSelectOptionA}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectOptionA();
          }}
          className="group bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-7 flex flex-col justify-between transition-colors shadow-xs cursor-pointer text-left"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Class
              </span>
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 block mb-1">
              Option A
            </span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              Dominate Class
            </h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Step into the active workspace. Enter &ldquo;The Grind&rdquo;, solve today&apos;s 5 CS aptitude challenges, and claim top ranking on your classroom leaderboard.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              5 Daily Questions • Real-Time Leaderboard
            </span>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors">
              <span>Open Class</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* OPTION B: "Dominate Everyone" */}
        <div
          onClick={onSelectOptionB}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectOptionB();
          }}
          className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-7 flex flex-col justify-between transition-colors shadow-xs cursor-pointer text-left"
        >
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <Globe className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold">
                Global Arena
              </span>
            </div>

            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Option B
            </span>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
              Dominate Everyone
            </h3>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              Global multi-institution ranked ladder where you challenge peers from all campuses and leagues across the world.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">
              Worldwide League
            </span>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors">
              <span>View Notice</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* NEW FEATURE: Practice Arena (Study & Tips) Navigation Card */}
      <div className="mt-8 bg-white border border-slate-200 hover:border-emerald-300 rounded-2xl p-6 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Practice Arena (Study &amp; Tips)
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  Untimed &bull; Stress-Free
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
                Cycle through CS aptitude problems with zero time penalty or leaderboard pressure. Each answer reveals step-by-step shortcut tricks &amp; tips.
              </p>
            </div>
          </div>

          <button
            onClick={onSelectPractice}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Arena (Study &amp; Tips)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
