from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

class QuizRequest(BaseModel):
    language: str
    level: str
    count: int = 5

@app.get("/")
def root():
    return {"status": "LinguaQuiz backend is running"}

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):
    if not request.language or not request.level:
        raise HTTPException(status_code=400, detail="Language and level required")

    prompt = f"""Generate {request.count} language learning quiz questions for {request.language} at {request.level} level.

Return ONLY a valid JSON array, no markdown, no explanation:
[
  {{
    "type": "translate",
    "question": "How do you say Hello in {request.language}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation"
  }}
]

Mix these types: translate, reverse, fill, meaning.
Always 4 options. correct is index 0-3. Return ONLY the JSON array."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        questions = json.loads(raw)
        return {"questions": questions, "language": request.language, "level": request.level}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse quiz questions")
