import React from 'react';
import { UserProfile } from '../types';
import { ANIMAL_AVATARS } from '../data/questions';
import { Flame, Trophy } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onOpenProfile: () => void;
  onNavigateHome?: () => void;
  currentScreen?: 'dashboard' | 'dominate_class' | 'the_grind' | 'practice_arena';
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenProfile,
  onNavigateHome,
  currentScreen,
}) => {
  const avatar = ANIMAL_AVATARS.find((a) => a.id === user.avatarId) || ANIMAL_AVATARS[0];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm font-bold text-sm tracking-tight">
              CS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900">CSApti</span>
                <span className="px-1.5 py-0.5 text-[11px] font-semibold rounded bg-slate-100 text-slate-600 border border-slate-200">
                  Arena
                </span>
              </div>
            </div>
          </button>

          {currentScreen && currentScreen !== 'dashboard' && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-xs font-semibold text-slate-600">
                {currentScreen === 'dominate_class'
                  ? 'Dominate Class'
                  : currentScreen === 'the_grind'
                  ? 'The Grind'
                  : 'Practice Arena'}
              </span>
            </div>
          )}
        </div>

        {/* Right: Streak & Clean Minimalist Animal Logo Icon Profile Button */}
        <div className="flex items-center gap-3">
          {/* Quick Streak Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>{user.currentStreak} day streak</span>
          </div>

          {/* User Score Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>{user.highScore.toLocaleString()} pts</span>
          </div>

          {/* Profile Section in Top Right Corner Featuring Clean Animal Logo Icon */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            aria-label="Open Profile Details"
            title="View User Profile, Streak, and Solved Stats"
          >
            <div className="flex flex-col text-right hidden sm:block mr-0.5">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {user.name}
              </span>
              <span className="text-[11px] text-slate-500 leading-none">
                {user.totalSolvedToday}/5 solved
              </span>
            </div>

            {/* Flat Minimalist Animal Logo Badge */}
            <div
              className={`w-8 h-8 rounded-full ${avatar.bgColor} flex items-center justify-center text-base`}
            >
              {avatar.emoji}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
