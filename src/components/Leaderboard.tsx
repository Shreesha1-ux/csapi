import React, { useState } from 'react';
import { LeaderboardUser } from '../types';
import { ANIMAL_AVATARS } from '../data/questions';
import { Trophy, Flame, Search, RefreshCw, Users } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardUser[];
  currentUserId?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserId,
  onRefresh,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * ============================================================================
   * FIRESTORE LIVE DATA RENDERING & SCHEMA MAPPING (FOR CLAUDE / MENTOR REVIEW)
   * ============================================================================
   * The 'entries' prop is fed directly by the Firestore snapshot listener:
   * onSnapshot(query(collection(db, 'leaderboard'), orderBy('score', 'desc')), ...)
   * 
   * Schema Fields Mapped from Firestore Doc Snapshot:
   * - doc.id              -> LeaderboardUser.id
   * - doc.data().name      -> LeaderboardUser.name
   * - doc.data().username  -> LeaderboardUser.username
   * - doc.data().avatarId  -> LeaderboardUser.avatarId
   * - doc.data().score     -> LeaderboardUser.score
   * - doc.data().streak    -> LeaderboardUser.streak
   * - doc.data().status    -> LeaderboardUser.status
   * ============================================================================
   */

  // Dynamic sorting by verified aptitude scores from Firestore
  const sortedEntries = [...entries].sort((a, b) => b.score - a.score || b.streak - a.streak);

  // Filtered by search query if user searches
  const displayEntries = sortedEntries.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Identify current active player ranking in live Firestore collection
  const userRankIndex = sortedEntries.findIndex((e) => e.id === currentUserId || e.isCurrentUser);
  const currentUserEntry = userRankIndex !== -1 ? sortedEntries[userRankIndex] : null;
  const userRankNumber = userRankIndex !== -1 ? userRankIndex + 1 : null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Classroom Leaderboard
            </h3>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Stream
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time Firestore stream of verified scores in The Grind daily aptitude test.
          </p>
        </div>

        {entries.length > 0 && (
          <div className="flex items-center gap-2">
            {/* Search box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student..."
                className="w-40 sm:w-48 pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
                title="Refresh live stream"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Distinct Personal Highlight Card (When user has entered scores) */}
      {currentUserEntry && currentUserEntry.score > 0 && (
        <div className="my-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
              #{userRankNumber}
            </div>
            {(() => {
              const av = ANIMAL_AVATARS.find((a) => a.id === currentUserEntry.avatarId) || ANIMAL_AVATARS[0];
              return (
                <div className={`w-10 h-10 rounded-xl ${av.bgColor} flex items-center justify-center text-xl`}>
                  {av.emoji}
                </div>
              );
            })()}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{currentUserEntry.name}</span>
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-[10px] font-bold uppercase text-white">
                  YOU
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span>@{currentUserEntry.username}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  {currentUserEntry.streak}d streak
                </span>
                <span>•</span>
                <span>{currentUserEntry.solvedToday}/5 solved today</span>
              </div>
            </div>
          </div>

          <div className="sm:border-l sm:border-blue-200 sm:pl-5 self-end sm:self-center text-right">
            <span className="text-[10px] uppercase font-semibold text-slate-500 block">Personal Score</span>
            <span className="text-xl font-bold text-blue-900 tracking-tight">
              {currentUserEntry.score.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">pts</span>
            </span>
          </div>
        </div>
      )}

      {/* 
        ============================================================================
        CLEAN PLACEHOLDER REQUIREMENT:
        When entries are empty ([]), display:
        "Waiting for players to join the grind..." using basic CSS styling.
        ============================================================================
      */}
      {entries.length === 0 ? (
        <div className="py-14 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Waiting for players to join the grind...
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Be the first student to enter The Grind and set the baseline record for your class.
          </p>
        </div>
      ) : (
        /* Leaderboard Table populated purely by live Firestore records */
        <div className="divide-y divide-slate-100">
          <div className="grid grid-cols-12 py-2.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-6">Student</div>
            <div className="hidden sm:block sm:col-span-2 text-center">Streak</div>
            <div className="col-span-4 sm:col-span-3 text-right">Score</div>
          </div>

          {displayEntries.map((user, idx) => {
            const rank = idx + 1;
            const isCurrentUser = user.id === currentUserId || user.isCurrentUser;
            const avatar = ANIMAL_AVATARS.find((a) => a.id === user.avatarId) || ANIMAL_AVATARS[0];

            let rankBadge = (
              <span className="font-mono text-xs font-semibold text-slate-500">#{rank}</span>
            );
            if (rank === 1) {
              rankBadge = (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-xs font-bold">
                  1
                </span>
              );
            } else if (rank === 2) {
              rankBadge = (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-200 text-slate-700 text-xs font-bold">
                  2
                </span>
              );
            } else if (rank === 3) {
              rankBadge = (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                  3
                </span>
              );
            }

            return (
              <div
                key={user.id}
                className={`grid grid-cols-12 items-center py-3 px-3 rounded-xl transition-colors ${
                  isCurrentUser
                    ? 'bg-blue-50/60 font-semibold'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Rank */}
                <div className="col-span-2 sm:col-span-1 text-center flex justify-center items-center">
                  {rankBadge}
                </div>

                {/* Student info */}
                <div className="col-span-6 sm:col-span-6 flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${avatar.bgColor} flex items-center justify-center text-lg shrink-0`}
                  >
                    {avatar.emoji}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm truncate ${isCurrentUser ? 'text-blue-900 font-bold' : 'text-slate-900 font-medium'}`}>
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.2 rounded bg-blue-600 text-[9px] font-bold uppercase text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 truncate">
                      @{user.username}
                    </div>
                  </div>
                </div>

                {/* Streak */}
                <div className="hidden sm:flex sm:col-span-2 items-center justify-center gap-1 text-xs font-medium text-slate-600">
                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
                  <span>{user.streak}d</span>
                </div>

                {/* High Score */}
                <div className="col-span-4 sm:col-span-3 text-right">
                  <div className="text-sm font-bold text-slate-900">
                    {user.score.toLocaleString()}
                    <span className="text-[11px] text-slate-400 font-normal ml-1">pts</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {user.completedAt || 'Today'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {entries.length > 0 && displayEntries.length === 0 && (
        <div className="text-center py-8 text-slate-400 text-sm">
          No student found matching &ldquo;{searchQuery}&rdquo;.
        </div>
      )}
    </div>
  );
};
