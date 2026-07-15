from mentor_ai.config import MAX_HISTORY_MESSAGES, MODEL_NAME, require_api_key
from mentor_ai.memory import (
    add_message,
    get_active_topic,
    get_completed_topics,
    get_recent_history,
)
from mentor_ai.prompts import build_system_prompt


client = None


def build_conversation(question: str) -> list[str]:
    progress_context = build_progress_context()
    conversation = [build_system_prompt(progress_context)]

    for item in get_recent_history(MAX_HISTORY_MESSAGES):
        conversation.append(f"{item['role']}: {item['text']}")

    conversation.append(f"user: {question}")
    return conversation


def build_progress_context() -> str:
    completed_topics = get_completed_topics()

    if completed_topics:
        completed = ", ".join(completed_topics)
    else:
        completed = "None yet"

    return (
        f"Active topic: {get_active_topic()}\n"
        f"Completed topics: {completed}\n"
        "Use this context to continue naturally without repeating old explanations."
    )


def get_client():
    global client

    if client is None:
        from google import genai

        client = genai.Client(api_key=require_api_key())

    return client


def ask_ai(question: str) -> str:
    try:
        response = get_client().models.generate_content(
            model=MODEL_NAME,
            contents=build_conversation(question),
        )
    except Exception as exc:
        return (
            "I could not reach the AI model right now.\n\n"
            f"Reason: {exc}\n\n"
            "Check your API key, internet connection, and model name, then try again."
        )

    answer = response.text or "I could not generate an answer. Please try again."

    add_message("user", question)
    add_message("assistant", answer)

    return answer
