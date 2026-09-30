import { AnimalAvatar, Question } from '../types';

export const ANIMAL_AVATARS: AnimalAvatar[] = [
  { id: 'fox', name: 'Swift Fox', emoji: '🦊', bgColor: 'bg-amber-50 border border-amber-200', textColor: 'text-amber-800' },
  { id: 'lion', name: 'Brave Lion', emoji: '🦁', bgColor: 'bg-yellow-50 border border-yellow-200', textColor: 'text-yellow-800' },
  { id: 'owl', name: 'Wise Owl', emoji: '🦉', bgColor: 'bg-emerald-50 border border-emerald-200', textColor: 'text-emerald-800' },
  { id: 'panda', name: 'Zen Panda', emoji: '🐼', bgColor: 'bg-slate-100 border border-slate-200', textColor: 'text-slate-800' },
  { id: 'tiger', name: 'Turbo Tiger', emoji: '🐯', bgColor: 'bg-orange-50 border border-orange-200', textColor: 'text-orange-800' },
  { id: 'falcon', name: 'Apex Falcon', emoji: '🦅', bgColor: 'bg-blue-50 border border-blue-200', textColor: 'text-blue-800' },
  { id: 'koala', name: 'Chill Koala', emoji: '🐨', bgColor: 'bg-teal-50 border border-teal-200', textColor: 'text-teal-800' },
  { id: 'wolf', name: 'Alpha Wolf', emoji: '🐺', bgColor: 'bg-slate-100 border border-slate-300', textColor: 'text-slate-800' },
];

export const DAILY_APTITUDE_POOL: Question[] = [
  {
    id: 1,
    category: 'Bitwise Logic',
    difficulty: 'Easy',
    title: 'What does the expression (n & (n - 1)) == 0 evaluate to for a non-zero positive integer n?',
    codeSnippet: 'bool checkValue(int n) {\n    return (n > 0) && ((n & (n - 1)) == 0);\n}',
    options: [
      { id: 'A', text: 'Checks if n is an odd prime number' },
      { id: 'B', text: 'Checks if n is a power of 2' },
      { id: 'C', text: 'Checks if n has an even number of set bits' },
      { id: 'D', text: 'Checks if n is divisible by 4' },
    ],
    correctOptionId: 'B',
    explanation:
      'Subtracting 1 from a number inverts all the bits after the least significant set bit (including that bit itself). If n is a power of 2, it has exactly one set bit, so n & (n - 1) clears it and yields 0.',
    timeLimitSec: 25,
    maxPoints: 1000,
  },
  {
    id: 2,
    category: 'Algorithms',
    difficulty: 'Medium',
    title: 'Given the recurrence relation T(n) = 2T(n/2) + O(n), what is the tight asymptotic time complexity by the Master Theorem?',
    options: [
      { id: 'A', text: 'O(n)' },
      { id: 'B', text: 'O(n log n)' },
      { id: 'C', text: 'O(n²)' },
      { id: 'D', text: 'O(log n)' },
    ],
    correctOptionId: 'B',
    explanation:
      'In Master Theorem T(n) = aT(n/b) + f(n), a=2, b=2, so n^(log_b a) = n^(log_2 2) = n^1. Since f(n) = Θ(n^1), this matches Case 2: T(n) = Θ(n log n), commonly seen in Merge Sort.',
    timeLimitSec: 25,
    maxPoints: 1000,
  },
  {
    id: 3,
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    title: 'In a room of 12 computer science students, every student shakes hands with every other student exactly once. How many total handshakes occur?',
    options: [
      { id: 'A', text: '132' },
      { id: 'B', text: '144' },
      { id: 'C', text: '66' },
      { id: 'D', text: '78' },
    ],
    correctOptionId: 'C',
    explanation:
      'The number of unique handshakes between n individuals is given by the combination formula C(n, 2) = n(n - 1)/2. For n = 12: 12 × 11 / 2 = 66 handshakes.',
    timeLimitSec: 25,
    maxPoints: 1000,
  },
  {
    id: 4,
    category: 'CS Core',
    difficulty: 'Hard',
    title: 'A CPU with 32-bit addresses uses a direct-mapped cache with 64KB capacity and 64-byte cache lines. How many bits are used for the Cache Index?',
    codeSnippet: '// Cache capacity = 64 KB = 2^16 bytes\n// Line size = 64 bytes = 2^6 bytes\n// Total Lines = 2^16 / 2^6 = 2^10 lines',
    options: [
      { id: 'A', text: '6 bits' },
      { id: 'B', text: '10 bits' },
      { id: 'C', text: '16 bits' },
      { id: 'D', text: '12 bits' },
    ],
    correctOptionId: 'B',
    explanation:
      'Number of cache lines = (Total Cache Size) / (Line Size) = 64KB / 64B = 65536 / 64 = 1024 lines = 2^10. Therefore, 10 bits are required for the cache index. The block offset is 6 bits (2^6 = 64B), and the tag gets 32 - 10 - 6 = 16 bits.',
    timeLimitSec: 30,
    maxPoints: 1000,
  },
  {
    id: 5,
    category: 'Quantitative',
    difficulty: 'Medium',
    title: 'A network packet queue processes 300 packets/minute. Incoming traffic enters at 450 packets/minute. If the buffer holds 900 packets and starts empty, in how many minutes will the buffer overflow?',
    options: [
      { id: 'A', text: '3 minutes' },
      { id: 'B', text: '4.5 minutes' },
      { id: 'C', text: '6 minutes' },
      { id: 'D', text: '2 minutes' },
    ],
    correctOptionId: 'C',
    explanation:
      'Net accumulation rate in buffer = (Arrival Rate) - (Processing Rate) = 450 - 300 = 150 packets/minute. Time to reach capacity = 900 / 150 = 6 minutes.',
    timeLimitSec: 25,
    maxPoints: 1000,
  },
];
