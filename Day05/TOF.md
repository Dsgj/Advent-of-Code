# Day 05: Cafeteria - Train of Thought

## Problem Understanding

Given "fresh" ID ranges and a list of IDs:

- Part 1: Count how many listed IDs are in any fresh range
- Part 2: Count total unique fresh IDs across all ranges

## Part 1: Range Membership Check

### Thinking Process

1. For each ID, check if it falls within any range
2. Simple containment check: `start <= id <= end`

### Algorithm: **Linear Range Search**

```
for each id:
    for each range:
        if id in range: count++, break
```

**Complexity:** O(ids × ranges), can be O(ids × log(ranges)) with binary search on sorted ranges

---

## Part 2: Total Unique IDs

### Thinking Process

1. Ranges may overlap - can't just sum (end - start + 1)
2. Need to merge overlapping ranges first

### Key Insight

Sort ranges by start, then merge overlapping/touching ranges into contiguous blocks.

### Algorithm: **Interval Merging**

```
1. Sort ranges by start
2. For each range:
   if overlaps or touches previous: extend previous
   else: start new merged range
3. Sum lengths of merged ranges
```

### Merge Condition

Two ranges overlap or touch if: `current.start <= previous.end + 1`

**Complexity:** O(n log n) for sorting + O(n) for merging
