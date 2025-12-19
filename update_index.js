const fs = require("fs");

const indices = JSON.parse(fs.readFileSync("indices.json", "utf8"));
let indexHtml = fs.readFileSync("index.html", "utf8");

let dataString = "const mutableData = {\n";

for (let i = 1; i <= 25; i++) {
  if (indices[i]) {
    dataString += `                ${i}: [${indices[i].join(", ")}],\n`;
  }
}
dataString += "            };";

// Regex to replace the existing mutableData block
// It matches "const mutableData = {" until "};"
// We need to be careful with flags (dotAll or [\s\S])
// output format needs to be clean.
const regex = /const mutableData = \{[\s\S]*?\};/;

if (regex.test(indexHtml)) {
  const newHtml = indexHtml.replace(regex, dataString);
  fs.writeFileSync("index.html", newHtml, "utf8");
  console.log("Successfully updated index.html with new mutableData.");
} else {
  console.error("Could not find mutableData block in index.html");
}
