# 🎄 Advent of Code 2025 - Antigravity IDE Test

> **Testing Google's Antigravity IDE** through Advent of Code puzzles

This repository serves as a test case for evaluating **Google's Antigravity IDE** — an AI-powered development environment. The testing is focused on two aspects:

1. **Problem Solving** — How well the AI solves the Advent of Code puzzles
2. **Visualization Creation** — How effectively the AI creates clear, interactive visualizations of these problems

## 🎯 Purpose

[Advent of Code](https://adventofcode.com/2025) provides an excellent benchmark for AI-assisted development because it requires:

- Understanding complex problem descriptions
- Implementing correct algorithms
- Creating engaging visual representations
- Iterating based on user feedback

Each day's solution and visualization was developed through pair-programming between the user and the AI within the Antigravity environment.

## 📁 Project Structure

For each day (e.g., `Day01`, `Day02`, ...), you will find:

| File                 | Description                               |
| -------------------- | ----------------------------------------- |
| `puzzle.md`          | The original puzzle description           |
| `solution.ts`        | TypeScript solution for Part 1 and Part 2 |
| `visualization.html` | Interactive web visualization             |
| `style.css`          | Day-specific styling                      |
| `input.txt`          | Puzzle input                              |
| `exampleInput.txt`   | Example input from problem description    |
| `TOF.md`             | Train of Thought - algorithm & approach   |

## 🚀 How to Run

### Solutions

```bash
npx ts-node DayXX/solution.ts
```

### Visualizations

Simply open `visualization.html` in your browser — no build step required.

## 🌐 Live Demo

**[View All Visualizations →](https://dsgj.github.io/Advent-of-Code/)**

## 📊 Visualizations Gallery

| Day | Title                                         | Theme                   |
| --- | --------------------------------------------- | ----------------------- |
| 01  | [Secret Entrance](./Day01/visualization.html) | Vault cracker dial      |
| 02  | [Gift Shop](./Day02/visualization.html)       | Retro ASCII terminal    |
| 03  | [Lobby](./Day03/visualization.html)           | Power station batteries |
| 04  | [Escalators](./Day04/visualization.html)      | Grid pathfinding        |
| 05  | [Sorting](./Day05/visualization.html)         | Rule-based sorting      |
| 06  | [Guard](./Day06/visualization.html)           | Patrol simulation       |
| 07  | [Laboratories](./Day07/visualization.html)    | Tachyon beam splitting  |
| 08  | [Playground](./Day08/visualization.html)      | 3D circuit wiring       |
| 09  | [Movie Theater](./Day09/visualization.html)   | Tile floor rectangles   |

## 🤖 AI Development Environment

| Component             | Details                    |
| --------------------- | -------------------------- |
| **IDE**               | Antigravity (Google)       |
| **Primary Model**     | Gemini 3 Pro (High)        |
| **Alternative Model** | Claude Opus 4.5 (Thinking) |

All code, visualizations, and documentation were generated through AI pair-programming within the Antigravity environment.

## 📜 Credits

- **Advent of Code** — Created by [Eric Wastl](http://was.tl/)
- Puzzles, Code, & Design © 2015-2025 Advent of Code. All rights reserved.
