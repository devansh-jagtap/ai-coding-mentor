import json
from copy import deepcopy
from pathlib import Path
from typing import Any
from datetime import datetime, timezone


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MEMORY_FILE = PROJECT_ROOT / "memory.json"
TOPICS = [
    "Python fundamentals",
    "Problem solving with code",
    "Git and project structure",
    "Prompt engineering",
    "AI fundamentals",
    "Generative AI",
    "AI agents",
    "FastAPI",
    "JavaScript basics",
    "Full-stack development",
    "Applied AI projects",
]
DEFAULT_MEMORY = {
    "version": 1,
    "student": {
        "name": None,
        "level": "beginner",
    },
    "active_topic": TOPICS[0],
    "history": [],
    "completed_topics": [],
}


def load_memory() -> dict[str, Any]:
    if not MEMORY_FILE.exists():
        return deepcopy(DEFAULT_MEMORY)

    with MEMORY_FILE.open("r", encoding="utf-8") as file:
        return normalize_memory(json.load(file))


def normalize_memory(data: dict[str, Any]) -> dict[str, Any]:
    memory = deepcopy(DEFAULT_MEMORY)
    memory.update(data)

    if not isinstance(memory.get("student"), dict):
        memory["student"] = DEFAULT_MEMORY["student"].copy()

    memory["history"] = [
        normalize_message(item)
        for item in memory.get("history", [])
        if isinstance(item, dict) and item.get("role") and item.get("text")
    ]
    memory["completed_topics"] = list(dict.fromkeys(memory.get("completed_topics", [])))

    if not memory.get("active_topic"):
        memory["active_topic"] = next_unfinished_topic(memory["completed_topics"])

    return memory


def normalize_message(item: dict[str, Any]) -> dict[str, str]:
    return {
        "role": str(item["role"]),
        "text": str(item["text"]),
        "created_at": str(item.get("created_at") or timestamp()),
    }


def save_memory(data: dict[str, Any]) -> None:
    data = normalize_memory(data)

    with MEMORY_FILE.open("w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


def add_message(role: str, text: str) -> None:
    memory = load_memory()

    memory["history"].append(
        {
            "role": role,
            "text": text,
            "created_at": timestamp(),
        }
    )

    save_memory(memory)


def timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_history() -> list[dict[str, str]]:
    return load_memory()["history"]


def get_recent_history(limit: int) -> list[dict[str, str]]:
    return get_history()[-limit:]


def complete_topic(topic: str) -> None:
    memory = load_memory()

    if topic not in memory["completed_topics"]:
        memory["completed_topics"].append(topic)

    memory["active_topic"] = next_unfinished_topic(memory["completed_topics"])
    save_memory(memory)


def get_completed_topics() -> list[str]:
    return load_memory()["completed_topics"]


def get_active_topic() -> str:
    return load_memory()["active_topic"]


def set_active_topic(topic: str) -> None:
    memory = load_memory()
    memory["active_topic"] = topic
    save_memory(memory)


def reset_history() -> None:
    memory = load_memory()
    memory["history"] = []
    save_memory(memory)


def reset_all_memory() -> None:
    save_memory(deepcopy(DEFAULT_MEMORY))


def get_progress_summary() -> str:
    memory = load_memory()
    completed = memory["completed_topics"]
    active_topic = memory["active_topic"]

    return (
        f"Active topic: {active_topic}\n"
        f"Completed topics: {len(completed)}/{len(TOPICS)}\n"
        f"Messages saved: {len(memory['history'])}"
    )


def next_unfinished_topic(completed_topics: list[str]) -> str:
    for topic in TOPICS:
        if topic not in completed_topics:
            return topic

    return "Capstone AI coding project"
