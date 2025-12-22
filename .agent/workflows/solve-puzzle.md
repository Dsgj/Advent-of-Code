---
description: Process för att lösa ett Advent of Code puzzle
---

# Advent of Code Workflow

När användaren tillhandahåller en dags puzzle-text, följ denna arbetsordning:

---

## Steg 1: Skapa puzzle.md

**Första åtgärd** — Spara puzzeltexten direkt.

1. Skapa mappen `DayXX/` om den inte finns
2. Skapa `DayXX/puzzle.md` med användarens puzzle-text
3. Formattera snyggt med Markdown:
   - Rubrik: `# --- Day X: Title ---`
   - Kodblock för example input
   - **Fetstil** för viktiga siffror och frågor
   - `Inline code` för koordinater/värden
   - Separera Part 1 och Part 2 med `---`

---

## Steg 2: Bygg implementation plan

Skapa en plan i `implementation_plan.md` som täcker:

### Part 1

- [ ] Skapa `exampleInput.txt` (från puzzle-beskrivningen)
- [ ] Skapa `input.txt` (tom fil för användarens input)
- [ ] Implementera Part 1 i `solution.ts`
- [ ] Verifiera med example input
- [ ] Verifiera med riktig input

### Part 2

- [ ] Lägg till Part 2 logik i `solution.ts`
- [ ] Verifiera med example input
- [ ] Verifiera med riktig input

### Visualisering

- [ ] Skapa `style.css` med tema
- [ ] Skapa `visualization.html` med interaktiv animation
- [ ] Stöd för Part 1 och Part 2 toggle
- [ ] Verifiera i webbläsare

### Portal

- [ ] Uppdatera `index.html` med ny dag

---

## Steg 3: Implementera Part 1

1. Skapa `DayXX/exampleInput.txt` från puzzle-beskrivningen
2. Skapa tom `DayXX/input.txt`
3. Skapa `DayXX/solution.ts`:
   - Importera `readInput` från `../utils`
   - Implementera `part1()` funktion
   - Skapa `run()` funktion som kör example + real input
4. Verifiera:
   ```bash
   // turbo
   npx ts-node DayXX/solution.ts
   ```

---

## Steg 4: Implementera Part 2

1. Lägg till `part2()` funktion i `solution.ts`
2. Uppdatera `run()` att köra båda delarna
3. Verifiera output matchar förväntade värden

---

## Steg 5: Skapa visualisering

### CSS (`style.css`)

- Unikt tema som passar dagens puzzle
- CSS-variabler för färger
- Glödande effekter, gradienter, animationer

### HTML (`visualization.html`)

- Titel: `Advent of Code - Day XX - ProblemName`
- Header med emojis och tematiskt namn
- Länka till `style.css`

### Funktionalitet

- **Part Toggle** — Växla mellan Part 1 och Part 2
- **Run** — Kör animation automatiskt
- **Step** — Stega manuellt
- **Reset** — Återställ
- **Speed slider** — Justera hastighet
- **Load Input** — Modal för att klistra in puzzle input
- **Statistics** — Visa progress och resultat

### Animera algoritmen

- Steg-för-steg visualisering
- Färgkodning med legend
- Synkade uppdateringar

---

## Steg 6: Skapa TOF.md (Train of Thought)

Skapa `DayXX/TOF.md` med lösningsmetodik:

- **Problem Understanding** — Vad är kärnan i problemet?
- **Thinking Process** — Hur tänker man för att lösa det?
- **Key Insight** — Vad är den avgörande insikten?
- **Algorithm** — Vilken algoritm passar bäst?
- **Complexity** — Tidskomplexitet

---

## Steg 7: Uppdatera portalen

Lägg till den nya dagen i `index.html`:

- Kopiera ett befintligt dag-kort
- Uppdatera länk, titel och beskrivning
- Kör visualiseringen för att ta en screenshot om möjligt

---

## Filstruktur per dag

```
DayXX/
├── puzzle.md           # Pusselbeskrivning (SKAPAS FÖRST)
├── exampleInput.txt    # Example input från problemet
├── input.txt           # Riktig puzzle input
├── solution.ts         # TypeScript-lösning (Part 1 & 2)
├── style.css           # Separat stilmall
├── visualization.html  # Interaktiv visualisering
└── TOF.md              # Train of Thought - lösningsmetodik
```

---

## Viktiga påminnelser

- **puzzle.md skapas alltid först** — innan implementation börjar
- **Part 1 före Part 2** — verifiera varje del separat
- **Visualisering sist** — efter lösningen är verifierad
- **Unikt tema per dag** — varje visualisering ska ha distinkt utseende
