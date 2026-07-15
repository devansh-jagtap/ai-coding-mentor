from mentor_ai.mentor import ask_ai
from mentor_ai.memory import (
    TOPICS,
    complete_topic,
    get_history,
    get_progress_summary,
    reset_all_memory,
    reset_history,
    set_active_topic,
)


HELP_TEXT = """
Commands:
  /help                 Show commands
  /topics               Show the learning roadmap
  /progress             Show saved progress
  /history              Show recent saved messages
  /topic <name/number>  Set the active topic
  /done                 Mark the active topic as completed
  /reset-chat           Clear chat history only
  /reset-all            Clear chat history and progress
  exit                  Quit the app
"""


def main():
    print("-" * 40)
    print("AI Coding Mentor")
    print("-" * 40)
    print("Type /help for commands.")

    while True:
        user = input("\nYou: ").strip()

        if user.lower() in {"exit", "quit"}:
            print("See you next session.")
            break

        if not user:
            print("Ask me a coding or AI question to begin.")
            continue

        if user.startswith("/"):
            handle_command(user)
            continue

        answer = ask_ai(user)

        print("\nMentor:\n")
        print(answer)


def handle_command(command: str) -> None:
    name, _, value = command.partition(" ")
    name = name.lower()
    value = value.strip()

    if name == "/help":
        print(HELP_TEXT)
    elif name == "/topics":
        show_topics()
    elif name == "/progress":
        print(get_progress_summary())
    elif name == "/history":
        show_history()
    elif name == "/topic":
        change_topic(value)
    elif name == "/done":
        mark_active_topic_done()
    elif name == "/reset-chat":
        reset_history()
        print("Chat history cleared. Progress is still saved.")
    elif name == "/reset-all":
        reset_all_memory()
        print("All mentor memory cleared.")
    else:
        print("Unknown command. Type /help to see available commands.")


def show_topics() -> None:
    print("\nLearning roadmap:")
    for index, topic in enumerate(TOPICS, start=1):
        print(f"{index}. {topic}")


def show_history(limit: int = 6) -> None:
    history = get_history()[-limit:]

    if not history:
        print("No saved chat history yet.")
        return

    print("\nRecent history:")
    for item in history:
        text = item["text"].replace("\n", " ")
        preview = text[:120] + ("..." if len(text) > 120 else "")
        print(f"- {item['role']}: {preview}")


def change_topic(value: str) -> None:
    if not value:
        print("Use /topic <name> or /topic <number>.")
        return

    topic = find_topic(value)
    if not topic:
        print("Topic not found. Type /topics to see the roadmap.")
        return

    set_active_topic(topic)
    print(f"Active topic set to: {topic}")


def mark_active_topic_done() -> None:
    from mentor_ai.memory import get_active_topic

    topic = get_active_topic()
    complete_topic(topic)
    print(f"Completed: {topic}")
    print(get_progress_summary())


def find_topic(value: str) -> str | None:
    if value.isdigit():
        index = int(value) - 1
        if 0 <= index < len(TOPICS):
            return TOPICS[index]

    value = value.lower()
    for topic in TOPICS:
        if value in topic.lower():
            return topic

    return None


if __name__ == "__main__":
    main()
