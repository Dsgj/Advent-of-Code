# Day 09: Movie Theater - Train of Thought

## Problem Understanding

Given coordinates of "red" tiles that form corners of a polygon:

- Part 1: Find largest rectangle with any two red tiles as corners
- Part 2: Find largest rectangle where ALL tiles inside are colored (red/green)

## Part 1: Maximum Rectangle Area

### Thinking Process

1. Any two red tiles can form opposite corners
2. Rectangle area = width × height
3. Remember: tiles are inclusive (+1 to each dimension)

### Algorithm: **Brute Force Pair Check**

```
maxArea = 0
for each pair (i, j) of red tiles:
    width = abs(x[j] - x[i]) + 1
    height = abs(y[j] - y[i]) + 1
    area = width * height
    maxArea = max(maxArea, area)
```

**Complexity:** O(n²) where n = number of red tiles

---

## Part 2: Constrained Rectangle

### Thinking Process

1. Green tiles form path between consecutive red tiles
2. Interior of the polygon is also green
3. Rectangle is valid only if ALL tiles within it are red or green

### Key Insight

The red tiles form a closed polygon. Valid rectangles must be entirely INSIDE this polygon (or on its boundary).

### Algorithm: **Ray Casting + Polygon Containment**

#### Step 1: Build Polygon

Connect consecutive red tiles with rectilinear segments.

#### Step 2: Point-in-Polygon Test (Ray Casting)

```
function isInside(x, y):
    count crossings of ray to the right
    return (crossings % 2 == 1) or isOnBoundary
```

#### Step 3: Rectangle Validation

For each candidate rectangle:

1. Check if all 4 corners are inside/on polygon
2. Sample points along edges and interior
3. Verify no exterior points exist within rectangle

### Optimization for Large Coordinates

- Don't create a grid (coordinates can be huge!)
- Use **coordinate compression** or segment-based checks
- Sample at polygon edge intersections, not every integer

**Complexity:** O(n² × S) where S = segments to check per rectangle
