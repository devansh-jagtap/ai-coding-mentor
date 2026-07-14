from google import genai
from config import API_KEY
from prompts import SYSTEM_PROMPT

from memory import (
  get_history,
  add_message
)

client = genai.Client(api_key=API_KEY)

def ask_ai(question : str):

  history = get_history()

  conversation = [SYSTEM_PROMPT]
  for item in history:

        conversation.append(
            f"{item['role']}: {item['text']}"
        )

  conversation.append(f"user: {question}")

  response = client.models.generate_content(
     model="gemini-3.5-flash",
     contents=conversation
  )

  answer = response.text

  add_message("user" , question)
  add_message("assistant" , answer)
  return answer