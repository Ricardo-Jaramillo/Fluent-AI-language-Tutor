"use client";

import { useSessionStore } from "@/stores/session";
import { motion } from "framer-motion";

const topics = [
  "Reisen", "Essen", "Sport", "Musik", "Arbeit",
  "Familie", "Wetter", "Kultur", "Technologie", "Natur",
];

interface TopicChipsProps {
  onTopicChange?: (topic: string | null) => void;
}

export default function TopicChips({ onTopicChange }: TopicChipsProps) {
  const { topicHint, setTopicHint } = useSessionStore();

  const handleTap = (topic: string) => {
    const newTopic = topicHint === topic ? null : topic;
    setTopicHint(newTopic);
    onTopicChange?.(newTopic);
  };

  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 py-2 scrollbar-hide">
      {topics.map((topic, i) => (
        <motion.button
          key={topic}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleTap(topic)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            topicHint === topic
              ? "bg-primary-600/15 border-primary-500/40 text-primary-400"
              : "bg-[var(--bg-surface)] border-border text-foreground/40 hover:text-foreground/60 hover:border-border-strong"
          }`}
        >
          {topic}
        </motion.button>
      ))}
    </div>
  );
}
