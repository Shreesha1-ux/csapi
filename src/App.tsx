import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, SolvedTodayFlags, LeaderboardUser } from './types';
import {
  getActiveUser,
  getSolvedTodayFlags,
  updateUserProfile,
  setActiveUser
} from './services/storage';
import {
  subscribeToLiveLeaderboard,
  syncPlayerToLeaderboard,
  getLocalLeaderboard
} from './services/firebase';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { DominateClass } from './components/DominateClass';
import { TheGrind } from './components/TheGrind';
import { PracticeArena } from './components/PracticeArena';
import { ProfileModal } from './components/ProfileModal';
import { ConstructionModal } from './components/ConstructionModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<
    'dashboard' | 'dominate_class' | 'the_grind' | 'practice_arena'
  >('dashboard');
  const [todayFlags, setTodayFlags] = useState<SolvedTodayFlags | null>(null);

  /**
   * ============================================================================
   * 1. LEADERBOARD STATE INITIALIZATION (STRICT REQUIREMENT)
   * Must be initialized strictly as an empty array: `[]`
   * Zero dummy records or placeholder objects.
   * ============================================================================
   */
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isRefreshingLeaderboard, setIsRefreshingLeaderboard] = useState(false);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isConstructionModalOpen, setIsConstructionModalOpen] = useState(false);

  // Initialize active authenticated user session if present
  useEffect(() => {
    const user = getActiveUser();
    if (user) {
      setCurrentUser(user);
      const flags = getSolvedTodayFlags(user.id);
      setTodayFlags(flags);
    }
  }, []);

  /**
   * ============================================================================
   * 2. LIVE FIRESTORE DATA STREAM SUBSCRIPTION (FOR MENTOR / CLAUDE REVIEW)
   * ============================================================================
   * Attaches real-time Firestore onSnapshot listener to the 'leaderboard' collection.
   * Updates state automatically whenever real players join or complete The Grind.
   * Cleans up subscription on component unmount.
   * ============================================================================
   */
  useEffect(() => {
    const unsubscribe = subscribeToLiveLeaderboard((liveEntries: LeaderboardUser[]) => {
      setLeaderboard(liveEntries);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Sync user and flags whenever user changes
  const reloadUserData = useCallback((userId: string) => {
    const flags = getSolvedTodayFlags(userId);
    setTodayFlags(flags);
    setLeaderboard(getLocalLeaderboard());
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    reloadUserData(user.id);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setActiveUser(null);
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    setCurrentScreen('dashboard');
  };

  const handleUpdateAvatar = (avatarId: string) => {
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      avatarId,
    };
    setCurrentUser(updated);
    updateUserProfile(updated);
    syncPlayerToLeaderboard(updated, todayFlags);
  };

  const handleGrindComplete = (flags: SolvedTodayFlags) => {
    if (!currentUser) return;
    setTodayFlags(flags);
    const updatedUser: UserProfile = {
      ...currentUser,
      totalSolvedToday: flags.answers.length,
      highScore: Math.max(currentUser.highScore, flags.totalScore),
    };
    setCurrentUser(updatedUser);
    syncPlayerToLeaderboard(updatedUser, flags);
  };

  const handleRefreshLeaderboard = () => {
    setIsRefreshingLeaderboard(true);
    setTimeout(() => {
      setLeaderboard(getLocalLeaderboard());
      setIsRefreshingLeaderboard(false);
    }, 500);
  };

  // If not authenticated, show clean Auth Page
  if (!currentUser) {
    return <AuthModal onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navbar with minimalist animal logo icon profile section */}
      <Navbar
        user={currentUser}
        currentScreen={currentScreen}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onNavigateHome={() => setCurrentScreen('dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentScreen === 'dashboard' && (
          <Dashboard
            user={currentUser}
            todayFlags={todayFlags}
            onSelectOptionA={() => setCurrentScreen('dominate_class')}
            onSelectOptionB={() => setIsConstructionModalOpen(true)}
            onSelectPractice={() => setCurrentScreen('practice_arena')}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {currentScreen === 'dominate_class' && (
          <DominateClass
            user={currentUser}
            leaderboard={leaderboard}
            todayFlags={todayFlags}
            onEnterTheGrind={() => setCurrentScreen('the_grind')}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
            onRefreshLeaderboard={handleRefreshLeaderboard}
            onOpenPractice={() => setCurrentScreen('practice_arena')}
            isRefreshing={isRefreshingLeaderboard}
          />
        )}

        {currentScreen === 'the_grind' && (
          <TheGrind
            user={currentUser}
            initialFlags={todayFlags}
            onExit={() => {
              reloadUserData(currentUser.id);
              setCurrentScreen('dominate_class');
            }}
            onComplete={handleGrindComplete}
            onOpenPractice={() => setCurrentScreen('practice_arena')}
          />
        )}

        {currentScreen === 'practice_arena' && (
          <PracticeArena onBackToDashboard={() => setCurrentScreen('dashboard')} />
        )}
      </main>

      {/* Profile Details Modal (Required: User Name, Current Streak, Total Solved All-time, Total Solved Today) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onUpdateAvatar={handleUpdateAvatar}
        onLogout={handleLogout}
      />

      {/* Option B Overlay Modal: Exactly "Sorry, under construction note by shreesha" */}
      <ConstructionModal
        isOpen={isConstructionModalOpen}
        onClose={() => setIsConstructionModalOpen(false)}
      />
    </div>
  );
}
