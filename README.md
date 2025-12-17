# Advent of Code 2025 - Solutions & Visualizations

This repository contains my solutions for [Advent of Code 2025](https://adventofcode.com/2025).

Each day includes a TypeScript solution and an interactive HTML/JS visualization to demonstrate the algorithm.

## Project Structure

For each day (e.g., `Day01`, `Day02`, ...), you will find:

- **`solution.ts`**: The TypeScript logic solving Part 1 and Part 2.
- **`visualization.html`**: A standalone interactive web page visualizing the problem and solution.
- **`input.txt`**: My specific puzzle input.
- **`exampleInput.txt`**: The example input provided in the problem description.

## How to Run

### Solutions

To run the solution for a specific day, use `ts-node`:

```bash
npx ts-node DayXX/solution.ts
```

### Visualizations

Simply open the `visualization.html` file in your web browser. No build server is required for the visualizations; they are self-contained.

## 🌐 Live Demo & GitHub Pages

This project is set up to be hosted on **GitHub Pages**.

1.  Go to your repository **Settings** > **Pages**.
2.  Under **Build and deployment** > **Source**, select **Deploy from a branch**.
3.  Select **main** branch and **/** (root) folder.
4.  Click **Save**.

Once deployed, your visualizations will be available at:
`https://<your-username>.github.io/<repository-name>/`

The root URL will load the **Project Portal** (`index.html`) linking to all days.

## Visualizations Gallery

| Day | Title                                                  | Description                                                    |
| --- | ------------------------------------------------------ | -------------------------------------------------------------- |
| 01  | [Day 01 - Secret Entrance](./Day01/visualization.html) | A vault cracker theme unlocking the secret entrance.           |
| 02  | [Day 02 - Gift Shop](./Day02/visualization.html)       | Retro ASCII terminal style scanner for the gift shop database. |
| 03  | [Day 03 - Lobby](./Day03/visualization.html)           | Power station battery optimization with electric effects.      |

## Credits

Advent of Code is created by [Eric Wastl](http://was.tl/).
Puzzles, Code, & Design &copy; 2015-2025 Advent of Code. All rights reserved.

Support Advent of Code by creating a private leaderboard or grabbing some [AoC++](https://adventofcode.com/support) swag!

## 🤖 AI-Assisted Development

This project demonstrates the capabilities of modern AI in software development.

- **IDE**: Antigravity
- **Models**:
  - **Gemini 3 Pro** (High)
  - **Claude Opus 4.5** (Thinking)

The code, visualizations, and documentation in this repository were generated through a pair-programming workflow between the user and these AI models within the Antigravity environment.
