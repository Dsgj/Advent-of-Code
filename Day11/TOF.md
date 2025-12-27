# Train of Thought - Day 11: Reactor

## Problem Understanding

The core problem is finding the number of distinct paths in a directed acyclic graph (DAG) from a start node to an end node.

- **Part 1**: Find all paths from `you` to `out`.
- **Part 2**: Find all paths from `svr` to `out` that pass through _both_ `dac` and `fft`.

## Thinking Process

1.  **Graph Representation**: The input is a disguised adjacency list. Parsing it into a Map structure (`Map<string, string[]>`) is straightforward.
2.  **Part 1 Strategy**:
    - Since "Data ... can't flow backwards", we assume a DAG.
    - Path counting in a DAG can be done with strict DFS or dynamic programming with memoization.
    - Given the potentially large number of paths (combinatorial explosion), simple DFS will be too slow (`O(2^N)`).
    - Memoization (`O(V+E)`) is required. `countPaths(node)` = `sum(countPaths(neighbor))`.
3.  **Part 2 Strategy**:
    - Requirement: Visit `dac` and `fft`.
    - In a DAG, there is a strict topological ordering. Thus, a path can't visit `dac` -> `fft` -> `dac`.
    - It must be either `svr` -> ... -> `dac` -> ... -> `fft` -> ... -> `out` OR `svr` -> ... -> `fft` -> ... -> `dac` -> ... -> `out`.
    - We can calculate the number of paths for each segment separately using the same `countPaths` logic:
      - `A = Paths(svr->dac) * Paths(dac->fft) * Paths(fft->out)`
      - `B = Paths(svr->fft) * Paths(fft->dac) * Paths(dac->out)`
    - Total valid paths = `A + B`. (One of A or B will likely be 0 if the other is non-zero, unless `dac` and `fft` are in parallel branches, in which case both would be 0 because you can't visit both).
    - Actually, if they are parallel, you can't visit both. So one order MUST be valid for any valid path.

## Key Insight

The problem of "visiting specific nodes" in a DAG breaks down into multiplying the path counts of the segments between those nodes. This transforms a potentially complex constraint into simple modular path counting.

## Algorithm

- **Data Structure**: Adjacency List.
- **Algorithm**: Recursive Depth First Search with Memoization.
- **Complexity**: Time `O(V + E)`, Space `O(V)` (recursion stack + memo map).

## Visualization Approach

- Visualized the graph using a layered layout (Topological sort approximation).
- For Part 2, the visualization simulates a "Key Collection" process where the traversing packet "picks up" the `dac` and `fft` keys. Only traversing agents with both keys are counted at the exit.
