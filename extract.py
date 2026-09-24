import json
import re

with open('C:/Users/user/.gemini/antigravity-ide/brain/2ff48f67-73f2-44d8-b01b-3b0d905d64d1/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content = data.get('content', '')
        if 'id="page-warehouse"' in content and 'assets/images/spaces/warehouse_dark_store.jpg' not in content:
            # Let's find one where it's the original code
            match = re.search(r'id="page-warehouse".*?(<div class="page")', content, re.DOTALL)
            if match:
                # We need one that has "What is 3PL"
                if "What is 3PL" in match.group(0):
                    print("Found original warehouse page!")
                    with open("original_warehouse.html", "w", encoding="utf-8") as out:
                        out.write(match.group(0))
                    break
