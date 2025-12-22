# Day 10: Factory — Train of Thought

## Problem Understanding

You have factory machines with indicator lights that need to be configured. Each machine has:

- A **target state** (which lights need to be ON or OFF)
- A set of **buttons** that toggle specific lights

The goal is to find the **minimum number of button presses** to reach the target state for all machines.

## Thinking Process

1. **Key insight**: Pressing a button twice cancels out (XOR property)

   - Therefore, each button is either pressed 0 or 1 times in an optimal solution

2. **This is a GF(2) linear algebra problem**:

   - Each light is a binary variable
   - Each button represents a vector of toggles
   - We need to find a linear combination that equals the target

3. **Approach options**:
   - **Brute force**: Try all 2^n button combinations — O(2^n)
   - **Gaussian elimination**: Reduce the matrix and find minimum-weight solution

## Key Insight

Since we only care whether each button is pressed or not (not how many times), the solution space is finite: only **2^numButtons** possibilities exist. For reasonable input sizes (≤20 buttons per machine), brute force is efficient.

## Algorithm

```typescript
function findMinPresses(machine: Machine): number {
  const { targetState, buttons } = machine;
  let minPresses = Infinity;

  // Try all 2^n combinations
  for (let mask = 0; mask < 1 << buttons.length; mask++) {
    const state = new Array(targetState.length).fill(false);
    let presses = popcount(mask);

    for (let b = 0; b < buttons.length; b++) {
      if (mask & (1 << b)) {
        for (const lightIdx of buttons[b]) {
          state[lightIdx] = !state[lightIdx];
        }
      }
    }

    if (arraysEqual(state, targetState)) {
      minPresses = Math.min(minPresses, presses);
    }
  }

  return minPresses;
}
```

## Complexity

- **Time**: O(M × 2^B × L) where M = machines, B = buttons per machine, L = lights
- **Space**: O(L) for the state array

For typical AoC inputs with ~10-15 buttons per machine, this is fast enough.
