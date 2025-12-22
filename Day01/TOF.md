# Day 01: Secret Entrance - Train of Thought

## Problem Understanding

You have a circular dial (0-99) that rotates based on instructions (L/R + amount). The dial wraps around: going left from 0 → 99, right from 99 → 0.

## Part 1: Final Position Check

### Thinking Process

1. Parse each instruction: direction (L/R) and amount
2. Calculate new position after each rotation
3. Count when final position equals 0

### Key Insight

You don't need to simulate each "click" - just jump to the final position using modular arithmetic.

### Algorithm: **Modular Arithmetic**

```
position = (position ± amount) mod 100
```

Handle negative modulo carefully in JavaScript: `((n % 100) + 100) % 100`

**Complexity:** O(n) where n = number of instructions

---

## Part 2: Count All Crossings

### Thinking Process

1. Now we need to count every time the dial touches 0 during any rotation
2. Simulating each click would be too slow for large amounts

### Key Insight

Calculate how many times we cross 0 mathematically by counting how many multiples of 100 we pass through.

### Algorithm: **Range Crossing Count**

- Moving right: `crossings = floor((position + amount) / 100)`
- Moving left: `crossings = floor((position - 1) / 100) - floor((position - amount - 1) / 100)`

**Complexity:** O(1) per instruction → O(n) total
