import json
from pathlib import Path

MEMORY_FILE = Path("memory.json")


def load_memory():

    if not MEMORY_FILE.exists():

        return {
            "history": [],
            "completed_topics": []
        }

    with open(MEMORY_FILE, "r") as f:
        return json.load(f)


def save_memory(data):

    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=4)


def add_message(role, text):

    memory = load_memory()

    memory["history"].append(
        {
            "role": role,
            "text": text
        }
    )

    save_memory(memory)


def get_history():

    return load_memory()["history"]


def complete_topic(topic):

    memory = load_memory()

    if topic not in memory["completed_topics"]:
        memory["completed_topics"].append(topic)

    save_memory(memory)


def get_completed_topics():

    return load_memory()["completed_topics"]