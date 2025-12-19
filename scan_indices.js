const fs = require("fs");

const htmlContent = fs.readFileSync("index.html", "utf8");

function getIndices(dayNum) {
  // Revised regex to be looser and log failures.
  // Handles <span ... class="...calendar-dayX...">
  // Note: class might be strictly "calendar-day5"
  const regex = new RegExp(
    `<[as][^>]*class="[^"]*calendar-day${dayNum}[^"]*?"[^>]*>([\\s\\S]*?)<\\/(a|span)>`,
    "i"
  );
  const match = htmlContent.match(regex);

  if (!match) {
    // Try finding just the class string to see if it exists
    if (htmlContent.indexOf(`calendar-day${dayNum}`) === -1) {
      console.error(`Day ${dayNum}: Class not found in HTML`);
    } else {
      console.error(
        `Day ${dayNum}: Regex extraction failed, but class exists.`
      );
    }
    return []; // Return empty for now so we see errors
  }

  let contentHtml = match[1];
  /* 
       For text extraction, we simply remove tags.
       However, we must preserve spacing.
       <span class="color">.</span> -> "."
    */
  const textContent = contentHtml.replace(/<[^>]+>/g, "");

  const indices = [];

  /*
       Special handling:
       If Day >= 13, it looks like a big empty block.
       The first line is empty.
       We can likely fill 0-60 if it's spaces.
    */

  for (let i = 0; i < textContent.length; i++) {
    const c = textContent[i];
    // if (c === "\n") break; // Removed to allow multiline scanning

    // "Sky" chars
    if (c === " " || c === "." || c === "'") {
      indices.push(i);
    }
  }

  return indices;
}

const map = {};
// Days 1 to 25
for (let i = 1; i <= 25; i++) {
  const idxs = getIndices(i);
  // Use them if found
  if (idxs && idxs.length > 0) {
    map[i] = idxs;
  }
}

fs.writeFileSync("indices.json", JSON.stringify(map, null, 2));
console.log("Done writing indices.json");
