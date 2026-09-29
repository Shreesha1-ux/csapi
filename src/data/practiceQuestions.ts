import { PracticeQuestion } from '../types';

export const PRACTICE_QUESTIONS_POOL: PracticeQuestion[] = [
  {
    id: 101,
    category: 'Bitwise Logic',
    difficulty: 'Easy',
    title: 'What does the bitwise operation (x & -x) isolate for any 32-bit signed integer x?',
    codeSnippet: 'int isolateBit(int x) {\n    return x & -x;\n}',
    options: [
      { id: 'A', text: 'The most significant set bit (MSB)' },
      { id: 'B', text: 'The lowest (least significant) set bit (LSB)' },
      { id: 'C', text: 'Clears all odd-positioned bits' },
      { id: 'D', text: 'Inverts all bits of x' },
    ],
    correctOptionId: 'B',
    explanation:
      'In two\'s complement representation, -x equals (~x + 1). This flips all bits before the least significant 1-bit and preserves that 1-bit. Performing an AND operation with x isolates that single lowest set bit.',
    tips: {
      title: 'Two’s Complement LSB Isolation Shortcut',
      shortcut: 'x & -x = Lowest 1-bit alone (Power of 2 component)',
      steps: [
        'Write out a sample number in binary, e.g., x = 12 (0000 1100).',
        'Negate it: -12 in two\'s complement is ~12 + 1 = (1111 0011) + 1 = 1111 0100.',
        'Bitwise AND (0000 1100 & 1111 0100) = 0000 0100 (which is 4, the lowest set bit).',
        'Use this trick instantly in Fenwick Trees / Binary Indexed Trees (BIT) to find parent nodes in O(1)!',
      ],
    },
  },
  {
    id: 102,
    category: 'Algorithms',
    difficulty: 'Medium',
    title: 'What is the maximum number of nodes in a full binary tree of height h (where a tree with just the root has height 0)?',
    options: [
      { id: 'A', text: '2ʰ' },
      { id: 'B', text: '2ʰ⁺¹ - 1' },
      { id: 'C', text: '2ʰ - 1' },
      { id: 'D', text: '2h + 1' },
    ],
    correctOptionId: 'B',
    explanation:
      'Level 0 has 2⁰ = 1 node, Level 1 has 2¹ = 2 nodes, ..., Level h has 2ʰ nodes. The sum of this geometric series 2⁰ + 2¹ + ... + 2ʰ is 2ʰ⁺¹ - 1.',
    tips: {
      title: 'Geometric Series Powers-of-Two Shortcut',
      shortcut: 'Sum of powers 2⁰ to 2ʰ is always the next power minus 1: (2ʰ⁺¹ - 1)',
      steps: [
        'Test with small values: if height = 0 (just root), nodes = 1. Formula 2⁰⁺¹ - 1 = 2 - 1 = 1 (Matches!).',
        'If height = 1, root + 2 children = 3 nodes. Formula 2² - 1 = 4 - 1 = 3 (Matches!).',
        'Whenever you see sum of 1 + 2 + 4 + 8 + ... + 2ⁿ, immediately write 2ⁿ⁺¹ - 1 without doing manual algebra.',
      ],
    },
  },
  {
    id: 103,
    category: 'Quantitative',
    difficulty: 'Medium',
    title: 'If 6 developers take 10 days to build 3 microservices working 8 hours/day, how many days will 10 developers take to build 5 microservices working 6 hours/day?',
    options: [
      { id: 'A', text: '10.5 days' },
      { id: 'B', text: '13.33 days' },
      { id: 'C', text: '12 days' },
      { id: 'D', text: '15 days' },
    ],
    correctOptionId: 'B',
    explanation:
      'Using the Man-Hours-Work equation (M₁ × D₁ × H₁) / W₁ = (M₂ × D₂ × H₂) / W₂: (6 × 10 × 8) / 3 = 160. Then (10 × D₂ × 6) / 5 = 12 × D₂. Setting 12 × D₂ = 160 yields D₂ = 160 / 12 = 13.33 days.',
    tips: {
      title: 'Chain Rule (MDH/W) Fast Formula',
      shortcut: '(M₁ × D₁ × H₁) / W₁ = (M₂ × D₂ × H₂) / W₂',
      steps: [
        'Identify: M = Men/Workers, D = Days, H = Hours/day, W = Work produced.',
        'Left side: (6 × 10 × 8) / 3 = 480 / 3 = 160 constant rate units.',
        'Right side: (10 × D₂ × 6) / 5 = 60 × D₂ / 5 = 12 × D₂.',
        'Solve 12 × D₂ = 160 -> D₂ = 40/3 = 13.33 days in under 20 seconds.',
      ],
    },
  },
  {
    id: 104,
    category: 'Logical Reasoning',
    difficulty: 'Easy',
    title: 'At what time between 3:00 and 4:00 will the hour hand and the minute hand of a clock coincide?',
    options: [
      { id: 'A', text: '3:15 exactly' },
      { id: 'B', text: '3:16 ⁴/₁₁ minutes' },
      { id: 'C', text: '3:17 ¹/₁₁ minutes' },
      { id: 'D', text: '3:18 minutes' },
    ],
    correctOptionId: 'B',
    explanation:
      'At 3:00, the minute hand is 15 minute-spaces behind the hour hand. The relative speed between the minute hand and hour hand is 55/60 minute-spaces/minute = 11/12. Time taken = 15 ÷ (11/12) = 180 / 11 = 16 ⁴/₁₁ minutes.',
    tips: {
      title: 'Clock Coincidence 12/11 Multiplier Trick',
      shortcut: 'Minutes = (Hour × 5) × 12/11',
      steps: [
        'For hour H, hands start separated by 5 × H minute spaces. Here H = 3, so 3 × 5 = 15.',
        'Multiply 15 by the universal clock constant (12/11): 15 × 12 / 11 = 180 / 11.',
        '180 / 11 = 16 remainder 4, giving 16 ⁴/₁₁ minutes past 3.',
        'This 12/11 trick works for ANY clock overlap problem from 1:00 to 11:00 without trigonometry!',
      ],
    },
  },
  {
    id: 105,
    category: 'CS Core',
    difficulty: 'Medium',
    title: 'In a 64-bit operating system with 4KB page size and a single-level page table, how many page table entries (PTEs) would be required to map the entire 48-bit canonical virtual address space?',
    options: [
      { id: 'A', text: '2³⁶ entries' },
      { id: 'B', text: '2⁴⁸ entries' },
      { id: 'C', text: '2¹² entries' },
      { id: 'D', text: '2²⁴ entries' },
    ],
    correctOptionId: 'A',
    explanation:
      'Page size is 4KB = 2¹² bytes, so the page offset requires 12 bits. The remaining bits in the 48-bit virtual address represent the virtual page number (VPN): 48 - 12 = 36 bits. Therefore, 2³⁶ page table entries are required.',
    tips: {
      title: 'Virtual Memory Bit-Splitting Rule',
      shortcut: 'VPN Bits = (Total Address Bits) - log₂(Page Size)',
      steps: [
        'Recognize standard powers of 2: 4KB = 4 × 1024 = 2² × 2¹⁰ = 2¹² bytes.',
        'Offset bits = 12 bits.',
        'PTEs needed = 2^(Virtual Address Bits - Offset Bits) = 2^(48 - 12) = 2³⁶.',
        'This is why modern 64-bit architectures use 4-level or 5-level paging instead of single-level paging!',
      ],
    },
  },
  {
    id: 106,
    category: 'Algorithms',
    difficulty: 'Hard',
    title: 'What is the minimum number of comparisons needed to find both the maximum and minimum elements in an unsorted array of n numbers?',
    options: [
      { id: 'A', text: '2n - 2 comparisons' },
      { id: 'B', text: '⌈3n/2⌉ - 2 comparisons' },
      { id: 'C', text: 'n log n comparisons' },
      { id: 'D', text: 'n - 1 comparisons' },
    ],
    correctOptionId: 'B',
    explanation:
      'Instead of comparing each element to both max and min (which takes 2(n-1) = 2n - 2), process elements in pairs: 1 comparison between the pair, 1 comparison with current max, and 1 comparison with current min. Total comparisons = 3 comparisons per 2 elements = ⌈3n/2⌉ - 2.',
    tips: {
      title: 'Pairwise Comparison Tournament Trick',
      shortcut: 'Compare in pairs: 3 comparisons for every 2 elements instead of 4',
      steps: [
        'Naive approach: find min (n-1 comparisons), find max (n-1 comparisons) = 2n - 2.',
        'Optimized trick: compare elements A and B with each other (1 check).',
        'Compare the larger one only against current max (1 check).',
        'Compare the smaller one only against current min (1 check).',
        'Total: 3 checks for 2 elements ≈ 1.5n comparisons! Saves 25% CPU branch instructions.',
      ],
    },
  },
  {
    id: 107,
    category: 'Bitwise Logic',
    difficulty: 'Medium',
    title: 'Given an array where every integer appears three times except for one unique integer that appears only once, what bitwise algorithm finds the unique element in O(n) time and O(1) space?',
    codeSnippet: 'int findSingleNumber(int[] nums) {\n    int ones = 0, twos = 0;\n    for (int n : nums) {\n        twos |= ones & n;\n        ones ^= n;\n        int notThrees = ~(ones & twos);\n        ones &= notThrees;\n        twos &= notThrees;\n    }\n    return ones;\n}',
    options: [
      { id: 'A', text: 'Standard XOR cumulative reduction' },
      { id: 'B', text: 'Finite State Machine using modulo-3 bit accumulators (ones, twos)' },
      { id: 'C', text: 'Bit inversion masking with ~x' },
      { id: 'D', text: 'Hamming distance sum reduction' },
    ],
    correctOptionId: 'B',
    explanation:
      'Because elements appear 3 times, standard XOR (which cancels out in pairs of 2) cannot be used alone. We maintain two bitmasks (ones, twos) that count occurrences modulo 3. When a bit appears a third time, both ones and twos have it, and we reset it to 0.',
    tips: {
      title: 'Modulo-K Bit Counter State Machine',
      shortcut: 'Use 2 bits to count up to 3: (00 -> 01 -> 10 -> reset to 00)',
      steps: [
        'Bit count mod 2 uses 1 integer (standard XOR).',
        'Bit count mod 3 requires 2 bits of state per position: variable `ones` and variable `twos`.',
        'Transition: if bit comes in, update twos if it was in ones; toggle ones.',
        'Clear bits when both ones & twos are 1 (reach 3 occurrences).',
        'Return `ones`, which holds the element that appeared only once!',
      ],
    },
  },
  {
    id: 108,
    category: 'Quantitative',
    difficulty: 'Easy',
    title: 'Two trains of length 150m and 250m travel in opposite directions on parallel tracks at 54 km/h and 90 km/h respectively. How long does it take for them to cross each other completely?',
    options: [
      { id: 'A', text: '8 seconds' },
      { id: 'B', text: '10 seconds' },
      { id: 'C', text: '12 seconds' },
      { id: 'D', text: '15 seconds' },
    ],
    correctOptionId: 'B',
    explanation:
      'Relative speed in opposite directions = 54 + 90 = 144 km/h. Convert to m/s by multiplying by 5/18: 144 × 5/18 = 8 × 5 = 40 m/s. Total distance to cross = 150 + 250 = 400m. Time = 400m / (40 m/s) = 10 seconds.',
    tips: {
      title: 'The Universal 5/18 km/h to m/s Rule',
      shortcut: 'Multiply km/h by 5/18 to get m/s instantly (18 km/h = 5 m/s)',
      steps: [
        'Notice 144 is 8 × 18. Since 18 km/h = 5 m/s, 144 km/h = 8 × 5 = 40 m/s.',
        'Opposite directions: Add speeds (54 + 90 = 144 km/h). Same direction: Subtract speeds.',
        'Total distance is ALWAYS length(Train A) + length(Train B) = 150 + 250 = 400m.',
        'Time = 400 / 40 = 10 seconds. Calculated without scratch paper in seconds!',
      ],
    },
  },
  {
    id: 109,
    category: 'Logical Reasoning',
    difficulty: 'Hard',
    title: 'There are 100 closed lockers in a row numbered 1 to 100. Person 1 toggles every locker. Person 2 toggles every 2nd locker. This continues until Person 100 toggles locker 100. How many lockers remain OPEN at the end?',
    options: [
      { id: 'A', text: '10 lockers' },
      { id: 'B', text: '50 lockers' },
      { id: 'C', text: '25 lockers' },
      { id: 'D', text: '1 locker' },
    ],
    correctOptionId: 'A',
    explanation:
      'A locker is toggled once for every factor it has. Most numbers have an even number of factors (in pairs like a × b). Only perfect squares (like 16 = 4 × 4) have an odd number of factors. A locker toggled an odd number of times ends up OPEN. The perfect squares up to 100 are 1², 2², ..., 10² = 10 lockers.',
    tips: {
      title: 'Odd Factors = Perfect Squares Theorem',
      shortcut: 'Count of open lockers = ⌊√N⌋',
      steps: [
        'Every divisor d has a matching pair N/d.',
        'If d ≠ N/d, divisors come in pairs of 2, leading to an even number of toggles (ends closed).',
        'Only when d = N/d (meaning N = d², a perfect square) is there an unpaired divisor (odd toggles -> stays open).',
        'For N = 100: √100 = 10. Open lockers are 1, 4, 9, 16, 25, 36, 49, 64, 81, 100. Answer is 10!',
      ],
    },
  },
  {
    id: 110,
    category: 'CS Core',
    difficulty: 'Medium',
    title: 'In a 5-stage classic RISC processor pipeline (IF, ID, EX, MEM, WB), how many stall cycles are incurred by a Data Hazard when an instruction depends directly on the result of the immediately preceding LOAD instruction (assuming operand forwarding is supported)?',
    codeSnippet: 'LW   R1, 0(R2)    // Load word into R1\nADD  R3, R1, R4   // Dependent instruction',
    options: [
      { id: 'A', text: '0 cycles' },
      { id: 'B', text: '1 cycle (Load-Use Stall)' },
      { id: 'C', text: '2 cycles' },
      { id: 'D', text: '3 cycles' },
    ],
    correctOptionId: 'B',
    explanation:
      'With operand forwarding, ALU instructions have 0 stalls. However, a LOAD instruction does not have its data ready until the end of the MEM stage (stage 4), whereas the dependent ADD instruction needs the operand at the start of its EX stage (stage 3). This creates a mandatory 1-cycle Load-Use stall.',
    tips: {
      title: 'Pipeline Load-Use Invariant',
      shortcut: 'Forwarding eliminates ALL ALU stalls, but Load-to-Use ALWAYS incurs 1 stall',
      steps: [
        'ALU-to-ALU hazard with forwarding = 0 stalls (forwarded from EX/MEM stage directly to EX stage).',
        'Load-to-ALU hazard with forwarding = 1 stall (data arrives at MEM stage, needed at EX stage: 1 cycle gap).',
        'Load-to-ALU without forwarding = 2 stalls.',
        'Remember this rule for compiler scheduling: always schedule an independent instruction between a LOAD and its USE!',
      ],
    },
  },
];
