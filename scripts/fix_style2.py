import re

with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    # The issue: \x7b is U+277B (LESS-THAN SIGN), \x7d is U+277D (GREATER-THAN SIGN)
    # In JSX, Turbopack rejects \u{hex} inside JSX text. Replace them with regular chars.
    # \u2713 = ✓  ✓ mark
    # \u2717 = ✕  X mark  (already removed)
    replacements = [
        ('\u2713', '✓'),
    ]
    new_c = c
    for old, new in replacements:
        new_c = new_c.replace(old, new)
    with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(new_c)
    print('Done')
