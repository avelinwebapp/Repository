import re

with open('/Users/findcateogory/Documents/3.아벨린/웹앱/webapp/avelin_webapp/app/place/page.tsx', 'r') as f:
    content = f.read()

# Extract Section 1
sec1_match = re.search(r'(            {/\* Section 1: Wide Booking Form \*/}\n            <div className="w-full bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-\[2rem\] p-6 md:p-8 shadow-2xl mb-12">\n(?:.*?\n)*?            </div>)\n\n            {/\* Section 2: Reservations History \*/}', content)

# Extract Section 2
sec2_match = re.search(r'(            {/\* Section 2: Reservations History \*/}\n            <div id="reservations-list-section" className="border-t border-zinc-800/80 pt-12">\n(?:.*?\n)*?                  </Tabs>\n                </div>\n              \)}\n            </div>)\n\n          </div>', content)

if not sec1_match or not sec2_match:
    print("Match failed")
    exit(1)

sec1 = sec1_match.group(1)
sec2 = sec2_match.group(1)

# Modify the sections' styling to reflect their new positions
sec2_new = sec2.replace('className="border-t border-zinc-800/80 pt-12"', 'className="border-b border-zinc-800/80 pb-12 mb-12"')
sec1_new = sec1.replace(' mb-12"', '"') # Remove mb-12 from section 1 since it's now at the bottom

# Replace in content
content = content.replace(sec1 + '\n\n' + sec2, sec2_new + '\n\n' + sec1_new)

with open('/Users/findcateogory/Documents/3.아벨린/웹앱/webapp/avelin_webapp/app/place/page.tsx', 'w') as f:
    f.write(content)

print("Done")
