from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os

from persona import SYSTEM_PROMPT

# Load environment variables
load_dotenv()

# Check API key
api_key = os.getenv("GEMINI_API_KEY")

print("===================================")
print("API KEY FOUND:", api_key[:10] if api_key else "NOT FOUND")
print("API KEY LENGTH:", len(api_key) if api_key else 0)
print("===================================")

# Configure Gemini
genai.configure(api_key=api_key)

# Create model
model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",
    system_instruction=SYSTEM_PROMPT
)

# FastAPI app
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request schema
class Question(BaseModel):
    question: str

# Home route
@app.get("/")
def home():
    return {
        "message": "AI Saurabh VoiceBot Running"
    }

# Chat route
@app.post("/chat")
def chat(data: Question):
    try:
        response = model.generate_content(
            data.question
        )

        return {
            "answer": response.text
        }

    except Exception as e:
        print("===================================")
        print("GEMINI ERROR:")
        print(str(e))
        print("===================================")

        return {
            "answer": f"Error: {str(e)}"
        }