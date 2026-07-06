from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import anthropic
import os
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=False,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

class QuizRequest(BaseModel):
    language: str
    level: str  # beginner, intermediate, advanced
    count: int = 5

@app.get("/")
def root():
    return {"status": "LinguaQuiz backend is running"}

@app.post("/generate-quiz")
def generate_quiz(request: QuizRequest):
    prompt = f"""Generate {request.count} language learning quiz questions for {request.language} at {request.level} level.

Return ONLY a valid JSON array, no markdown, no explanation, just the raw JSON array like this:
[
  {{
    "type": "translate",
    "question": "How do you say 'Hello' in {request.language}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "explanation": "Brief explanation"
  }}
]

Question types to mix (use all types across the {request.count} questions):
- "translate": English to {request.language} translation (multiple choice, 4 options)
- "reverse": {request.language} to English translation (multiple choice, 4 options)
- "fill": Fill in the blank sentence in {request.language} (multiple choice, 4 options)
- "meaning": What does this {request.language} word mean? (multiple choice, 4 options)

Rules:
- Always 4 options per question
- correct is the index (0, 1, 2, or 3) of the right answer
- Make wrong options plausible but clearly incorrect
- Keep it educational and fun
- Level: {request.level} (beginner = basic greetings/numbers, intermediate = common phrases, advanced = grammar/complex sentences)

Return ONLY the JSON array, nothing else."""

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()
    # Clean up any accidental markdown
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        questions = json.loads(raw)
        return {"questions": questions, "language": request.language, "level": request.level}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse quiz questions")
