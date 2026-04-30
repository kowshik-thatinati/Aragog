# One-time preprocessing script
# Adds "domain": "medical" to dataset
# Not used in backend runtimeimport json
import os
import re
import json
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

INPUT = "backend/data/chunks.json"
OUTPUT = "backend/data/chunks_structured.json"

with open(INPUT, "r", encoding="utf-8", errors="ignore") as f:
    data = json.load(f)

structured = []

for item in data:
    if not isinstance(item, str):
        continue

    # Extract category
    category_match = re.search(r"\[(.*?)\]", item)
    category = category_match.group(1) if category_match else "unknown"

    # Extract question
    q_match = re.search(r"Question:\s*(.*?)\n", item)
    question = q_match.group(1).strip() if q_match else ""

    # Extract answer
    a_match = re.search(r"Answer:\s*(.*)", item, re.DOTALL)
    answer = a_match.group(1).strip() if a_match else ""

    structured.append({
        "domain": "medical",
        "category": category,
        "question": question,
        "answer": answer,
        "text": f"{question} {answer}"
    })

with open(OUTPUT, "w", encoding="utf-8") as f:
    json.dump(structured, f, indent=2)

print("✅ Structured dataset ready")