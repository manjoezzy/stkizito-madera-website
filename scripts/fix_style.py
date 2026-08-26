import re

with open('src/components/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    c = f.read()
    # Replace 'style={{' with 'style={{' (add space)
    count = c.count('style={{')
    print(f'Found {count} occurrences, replacing...')
    new_c = c.replace('style={{', 'style={{', 1)
    with open('src/components/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(new_c)
    print('Done')
