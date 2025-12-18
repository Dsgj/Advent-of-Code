
import re
import json

# Raw samples manually extracted from the user prompt
# Line 0 (Day 1 Top Decor)
l0_samples = [
    " .  ...  ____   .  ...  * . .   .'       <o   '         ",
    "    '.   ____ .    .    * '     ' '.'  ' <o ''  '       ",
    "      '' ____  . ' .    *         '  .   <o             ",
    "      .  ____  ' ' '    *              ' <o '  '        ",
    "   '   . ____  '      . * ..       '' .' <o     .       "
]

# Line 2 (Day 2 Top Decor)
# Note: Line 1 is the main Day 1 line (checked manually, it's static)
# Line 2 corresponds to the decoration ABOVE Day 2
l2_samples = [
    " ' _______||_________    ..    . '   .'..'              ",
    " ' _______||_________      .   .  '   ' .. ..           ",
    "   _______||_________ .' '  '     . . '  .  '   '       ",
    ".  _______||_________ '  ''            ' .              ",
    " . _______||_________ '.'  '  ' .   .  '                "
]

def analyze():
    def process_lines(samples):
        if not samples: return [], []
        max_len = max(len(s) for s in samples)
        padded = [s.ljust(max_len) for s in samples]
        
        mutables = []
        chars_allowed = set()
        
        for i in range(max_len):
            chars = [s[i] for s in padded]
            if len(set(chars)) > 1:
                mutables.append(i)
                chars_allowed.update(chars)
        return mutables, list(chars_allowed)

    m0, c0 = process_lines(l0_samples)
    m2, c2 = process_lines(l2_samples)
    
    # Check if chars are mostly standard snow chars
    all_chars = sorted(list(set(c0 + c2)))
    
    output = {
        "mutable_indices": {
            "0": m0,
            "2": m2
        },
        "allowed_chars": all_chars
    }
    with open("analysis_result.json", "w") as f:
        json.dump(output, f)


if __name__ == "__main__":
    analyze()
