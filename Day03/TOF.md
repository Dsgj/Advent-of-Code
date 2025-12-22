# Day 03: Power Station - Train of Thought

## Problem Understanding

Each battery bank is a string of digits. Select batteries (in order) to form the maximum joltage number.

- Part 1: Pick exactly 2 batteries
- Part 2: Pick exactly 12 batteries

## Part 1: Maximum Two-Digit Number

### Thinking Process

1. Need to pick two digits at positions i < j to form `digits[i] * 10 + digits[j]`
2. Brute force: O(n²) - check all pairs

### Key Insight

For any position j (second digit), the best first digit is the maximum digit seen at any position < j.

### Algorithm: **Single Pass with Running Maximum**

```
maxFirstDigit = digits[0]
for j = 1 to n-1:
    result = max(result, maxFirstDigit * 10 + digits[j])
    maxFirstDigit = max(maxFirstDigit, digits[j])
```

**Complexity:** O(n)

---

## Part 2: Maximum N-Digit Number

### Thinking Process

1. Picking 12 digits optimally is harder - can't just use running max
2. Greedy approach: at each step, pick the highest digit available

### Key Insight

When picking digit k of N total, you must leave room for remaining digits. Can only pick from positions [current, length - (N - k)].

### Algorithm: **Greedy Selection with Constraint**

```
for i = 1 to N:
    digitsRemaining = N - i
    endPos = length - digitsRemaining
    pick max digit in [startPos, endPos]
    startPos = picked position + 1
```

**Complexity:** O(n × N) naive, can be O(n log n) with segment tree
