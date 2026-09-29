import React from 'react';
import { UserProfile } from '../types';
import { ANIMAL_AVATARS } from '../data/questions';
import { Flame, CheckCircle2, Trophy, Calendar, X, LogOut, User } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateAvatar: (avatarId: string) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateAvatar,
  onLogout,
}) => {
  if (!isOpen) return null;

  const currentAvatar = ANIMAL_AVATARS.find((a) => a.id === user.avatarId) || ANIMAL_AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">User Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar & Main Info */}
        <div className="py-6 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl ${currentAvatar.bgColor} flex items-center justify-center text-4xl shadow-sm`}>
            {currentAvatar.emoji}
          </div>

          <h3 className="mt-3.5 text-xl font-bold text-slate-900">{user.name}</h3>
          <p className="text-sm text-slate-500 font-medium">@{user.username} • {currentAvatar.name}</p>
        </div>

        {/* Key Metrics Modal Section (Strictly matching prompt specs) */}
        <div className="grid grid-cols-2 gap-3 my-2">
          {/* 1. User Name Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>User Name</span>
              <Trophy className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-base font-bold text-slate-900 truncate" title={user.name}>
              {user.name}
            </div>
            <div className="text-xs text-slate-500 truncate">@{user.username}</div>
          </div>

          {/* 2. Current Streak (days) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Current Streak</span>
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 flex items-baseline gap-1">
              {user.currentStreak}
              <span className="text-xs font-semibold text-slate-500">days</span>
            </div>
            <div className="text-xs text-slate-500">Daily streak active</div>
          </div>

          {/* 3. Total Questions Solved (all-time) */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Total Solved (All-Time)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 flex items-baseline gap-1">
              {user.totalSolvedAllTime}
              <span className="text-xs font-semibold text-slate-500">questions</span>
            </div>
            <div className="text-xs text-slate-500">Verified mastery</div>
          </div>

          {/* 4. Total Number of Questions Solved Today */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <span>Solved Today</span>
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900 flex items-baseline gap-1">
              {user.totalSolvedToday}
              <span className="text-xs font-semibold text-slate-500">/ 5 daily</span>
            </div>
            <div className="text-xs text-slate-500">
              {user.totalSolvedToday >= 5 ? 'Completed today' : `${5 - user.totalSolvedToday} remaining`}
            </div>
          </div>
        </div>

        {/* Minimalist Animal Avatar Switcher */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Switch Avatar Badge
          </label>
          <div className="grid grid-cols-4 gap-2">
            {ANIMAL_AVATARS.map((avatar) => {
              const isSelected = avatar.id === user.avatarId;
              return (
                <button
                  key={avatar.id}
                  onClick={() => onUpdateAvatar(avatar.id)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-1 ring-blue-600 text-blue-900'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span className="text-2xl">{avatar.emoji}</span>
                  <span className="text-[11px] font-medium mt-1 truncate max-w-full">
                    {avatar.name.split(' ')[1] || avatar.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
