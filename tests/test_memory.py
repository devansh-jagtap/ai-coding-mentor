import tempfile
import unittest
from pathlib import Path

from mentor_ai import memory


class MemoryTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.original_memory_file = memory.MEMORY_FILE
        memory.MEMORY_FILE = Path(self.temp_dir.name) / "memory.json"

    def tearDown(self):
        memory.MEMORY_FILE = self.original_memory_file
        self.temp_dir.cleanup()

    def test_missing_memory_returns_default_schema(self):
        data = memory.load_memory()

        self.assertEqual(data["version"], 1)
        self.assertEqual(data["active_topic"], "Python fundamentals")
        self.assertEqual(data["history"], [])
        self.assertEqual(data["completed_topics"], [])

    def test_old_memory_shape_is_migrated(self):
        memory.save_memory(
            {
                "history": [{"role": "user", "text": "what is python"}],
                "completed_topics": [],
            }
        )

        data = memory.load_memory()

        self.assertEqual(data["active_topic"], "Python fundamentals")
        self.assertEqual(data["history"][0]["role"], "user")
        self.assertIn("created_at", data["history"][0])

    def test_completing_topic_moves_to_next_topic(self):
        memory.complete_topic("Python fundamentals")

        data = memory.load_memory()

        self.assertIn("Python fundamentals", data["completed_topics"])
        self.assertEqual(data["active_topic"], "Problem solving with code")


if __name__ == "__main__":
    unittest.main()
