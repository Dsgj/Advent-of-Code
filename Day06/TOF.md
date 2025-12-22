# Day 06: Trash Compactor - Train of Thought

## Problem Understanding

ASCII art shows calculation blocks with stacked numbers and an operator (+/\*).

- Part 1: Numbers are read horizontally (left-to-right)
- Part 2: Numbers are read vertically (top-to-bottom), columns right-to-left

## Part 1: Horizontal Parsing

### Thinking Process

1. Split input into separate calculation blocks (separated by empty columns)
2. Extract all tokens (numbers and operators) from each block
3. Apply the operator to all numbers

### Algorithm: **Column-Based Block Detection**

```
1. Find columns that are entirely whitespace (separators)
2. Group contiguous non-separator columns into blocks
3. Parse each block's content as tokens
4. Apply operator (+ or *) to number tokens
```

**Complexity:** O(rows × cols)

---

## Part 2: Vertical Column Reading

### Thinking Process

1. Instead of reading horizontally, read each column top-to-bottom
2. Each column's digits form one number
3. Process columns right-to-left

### Key Insight

The visual stacking represents place values - each column is a complete number, not individual digits of one number.

### Algorithm: **Vertical Columnar Parsing**

```
for each column from RIGHT to LEFT:
    digitStr = ""
    for each row TOP to BOTTOM:
        if char is digit: digitStr += char
    if digitStr not empty: numbers.add(parseInt(digitStr))
```

**Complexity:** O(rows × cols)

---

## Alternative Approach

Could use **Regular Expressions** for token extraction, but visual/positional parsing is more reliable for ASCII art.
