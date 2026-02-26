"""Validate the syllabus.json structure and content."""

import json
import sys
from pathlib import Path

SYLLABUS_PATH = Path(__file__).parent.parent / "frontend" / "src" / "data" / "syllabus.json"

REQUIRED_LEVELS = {"A1", "A2", "B1", "B2", "C1"}
MIN_VOCABULARY = 10
MIN_EXAMPLE_PHRASES = 3
MIN_CONVERSATION_STARTERS = 2
VALID_CONTEXTS = {"everyday", "professional", "mixed"}


def validate() -> list[str]:
    """Validate syllabus and return list of errors."""
    errors: list[str] = []

    if not SYLLABUS_PATH.exists():
        errors.append(f"Syllabus file not found: {SYLLABUS_PATH}")
        return errors

    with open(SYLLABUS_PATH) as f:
        data = json.load(f)

    if "levels" not in data:
        errors.append("Missing 'levels' key")
        return errors

    levels = data["levels"]
    level_ids = {l["id"] for l in levels}

    if level_ids != REQUIRED_LEVELS:
        errors.append(f"Expected levels {REQUIRED_LEVELS}, got {level_ids}")

    for level in levels:
        lid = level.get("id", "?")
        if "modules" not in level:
            errors.append(f"Level {lid}: missing 'modules'")
            continue

        for module in level["modules"]:
            mid = module.get("id", "?")
            if "topics" not in module:
                errors.append(f"Level {lid}, Module {mid}: missing 'topics'")
                continue

            for topic in module["topics"]:
                tid = topic.get("id", "?")
                prefix = f"Level {lid} > {mid} > {tid}"

                # Check required fields
                for field in ["id", "name", "description", "vocabulary", "example_phrases", "conversation_starters"]:
                    if field not in topic:
                        errors.append(f"{prefix}: missing '{field}'")

                # Check vocabulary count
                vocab = topic.get("vocabulary", [])
                if len(vocab) < MIN_VOCABULARY:
                    errors.append(f"{prefix}: vocabulary has {len(vocab)} items (min {MIN_VOCABULARY})")

                # Check vocab item structure
                for i, v in enumerate(vocab):
                    for key in ["word", "translation", "example"]:
                        if key not in v:
                            errors.append(f"{prefix}: vocabulary[{i}] missing '{key}'")

                # Check example phrases count
                phrases = topic.get("example_phrases", [])
                if len(phrases) < MIN_EXAMPLE_PHRASES:
                    errors.append(f"{prefix}: example_phrases has {len(phrases)} items (min {MIN_EXAMPLE_PHRASES})")

                # Check conversation starters count
                starters = topic.get("conversation_starters", [])
                if len(starters) < MIN_CONVERSATION_STARTERS:
                    errors.append(f"{prefix}: conversation_starters has {len(starters)} items (min {MIN_CONVERSATION_STARTERS})")

                # Check context
                ctx = topic.get("context", "")
                if ctx not in VALID_CONTEXTS:
                    errors.append(f"{prefix}: invalid context '{ctx}' (must be one of {VALID_CONTEXTS})")

    return errors


def main():
    errors = validate()
    if errors:
        print(f"FAILED: {len(errors)} errors found:")
        for e in errors:
            print(f"  - {e}")
        sys.exit(1)
    else:
        print("PASSED: Syllabus is valid")
        # Summary
        with open(SYLLABUS_PATH) as f:
            data = json.load(f)
        total_topics = 0
        for level in data["levels"]:
            topics_count = sum(len(m["topics"]) for m in level["modules"])
            total_topics += topics_count
            print(f"  {level['id']}: {len(level['modules'])} modules, {topics_count} topics")
        print(f"  Total: {total_topics} topics across {len(data['levels'])} levels")


if __name__ == "__main__":
    main()
