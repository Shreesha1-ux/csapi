export interface AnimalAvatar {
  id: string;
  name: string;
  emoji: string;
  bgColor: string;
  textColor: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarId: string;
  currentStreak: number;
  totalSolvedAllTime: number;
  totalSolvedToday: number;
  highScore: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface PracticeTip {
  title: string;
  shortcut: string;
  steps: string[];
}

export interface PracticeQuestion {
  id: number;
  category: 'CS Core' | 'Algorithms' | 'Quantitative' | 'Logical Reasoning' | 'Bitwise Logic';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  tips: PracticeTip;
}

export interface Question {
  id: number;
  category: 'CS Core' | 'Algorithms' | 'Quantitative' | 'Logical Reasoning' | 'Bitwise Logic';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  codeSnippet?: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  timeLimitSec: number;
  maxPoints: number;
}

export interface AnswerRecord {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  timeTakenSec: number;
  pointsEarned: number;
}

export interface SolvedTodayFlags {
  date: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string;
  totalScore: number;
  correctCount: number;
  answers: AnswerRecord[];
  isLocked: boolean; // Anti-exploit lock
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username: string;
  avatarId: string;
  score: number;
  solvedToday: number;
  streak: number;
  completedAt?: string;
  isCurrentUser?: boolean;
  status?: 'grinding' | 'completed' | 'idle';
}
