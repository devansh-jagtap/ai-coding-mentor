from google import genai
from config import API_KEY
from prompts import SYSTEM_PROMPT

client = genai.Client(api_key=API_KEY)

def ask_ai(question : str):
  response = client.models.generate_content(
     model="gemini-3.5-flash",
     contents=[
       SYSTEM_PROMPT,
       question
     ]
  )

  return response.text