/**
 * Storage and State Synchronization for CSApti
 * 
 * ZERO DUMMY DATA POLICY:
 * - All user arrays and leaderboards initialize as pure empty arrays: `[]`
 * - No mock names, no placeholder classmates, no simulated scores.
 */

import { UserProfile, SolvedTodayFlags, LeaderboardUser } from '../types';
import { syncPlayerToLeaderboard, getLocalLeaderboard } from './firebase';

const USERS_KEY = 'csapti_registered_users';
const CURRENT_USER_KEY = 'csapti_active_user_id';
const SOLVED_FLAGS_PREFIX = 'csapti_solved_today_flags';

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns registered users from store; strictly defaults to empty array []
 */
export function getRegisteredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return []; // Strictly empty array: zero dummy users
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save users', e);
  }
}

export function getActiveUser(): UserProfile | null {
  try {
    const currentId = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentId) return null;
    const users = getRegisteredUsers();
    const found = users.find((u) => u.id === currentId);
    if (found) {
      return syncUserDailyStats(found);
    }
    return null;
  } catch {
    return null;
  }
}

export function setActiveUser(userId: string | null): void {
  if (userId) {
    localStorage.setItem(CURRENT_USER_KEY, userId);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function updateUserProfile(updated: UserProfile): void {
  const users = getRegisteredUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
  } else {
    users.push(updated);
  }
  saveRegisteredUsers(users);
}

// Anti-exploit: Solved Today Flags
export function getSolvedTodayFlags(userId: string): SolvedTodayFlags | null {
  try {
    const today = getTodayDateString();
    const key = `${SOLVED_FLAGS_PREFIX}_${userId}_${today}`;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSolvedTodayFlags(userId: string, flags: SolvedTodayFlags): void {
  try {
    const key = `${SOLVED_FLAGS_PREFIX}_${userId}_${flags.date}`;
    localStorage.setItem(key, JSON.stringify(flags));

    // Update user profile stats
    const active = getActiveUser();
    if (active && active.id === userId) {
      const todaySolved = flags.answers.length;
      const wasUpdatedToday = active.lastActiveDate === flags.date;
      
      const newTotalSolvedAllTime = wasUpdatedToday
        ? active.totalSolvedAllTime - active.totalSolvedToday + todaySolved
        : active.totalSolvedAllTime + todaySolved;

      const updatedUser: UserProfile = {
        ...active,
        totalSolvedToday: todaySolved,
        totalSolvedAllTime: newTotalSolvedAllTime,
        highScore: Math.max(active.highScore, flags.totalScore),
        lastActiveDate: flags.date,
        currentStreak: active.lastActiveDate === flags.date ? active.currentStreak : active.currentStreak + 1,
      };

      updateUserProfile(updatedUser);
      // Synchronize with Firestore live collection
      syncPlayerToLeaderboard(updatedUser, flags);
    }
  } catch (e) {
    console.error('Failed to save solved today flags', e);
  }
}

function syncUserDailyStats(user: UserProfile): UserProfile {
  const today = getTodayDateString();
  const flags = getSolvedTodayFlags(user.id);
  
  if (flags && flags.date === today) {
    user.totalSolvedToday = flags.answers.length;
  } else {
    if (user.lastActiveDate !== today) {
      user.totalSolvedToday = 0;
    }
  }
  return user;
}
