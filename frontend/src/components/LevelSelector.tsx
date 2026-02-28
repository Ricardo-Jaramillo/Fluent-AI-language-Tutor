"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSessionStore } from "@/stores/session";
import { useAuthStore } from "@/stores/auth";
import { createClient } from "@/lib/supabase";
import { Badge } from "@/components/ui";
import type { Level } from "@/stores/session";

const levels: Level[] = ["A1", "A2", "B1", "B2", "C1"];

const levelBadgeVariants: Record<string, "level-a1" | "level-a2" | "level-b1" | "level-b2" | "level-c1"> = {
  A1: "level-a1",
  A2: "level-a2",
  B1: "level-b1",
  B2: "level-b2",
  C1: "level-c1",
};

interface LevelSelectorProps {
  onLevelChange?: (level: Level) => void;
}

export default function LevelSelector({ onLevelChange }: LevelSelectorProps) {
  const { level, setLevel } = useSessionStore();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = async (newLevel: Level) => {
    setLevel(newLevel);
    setOpen(false);

    // Persist to Supabase profile
    if (user) {
      await supabase
        .from("profiles")
        .update({ current_level: newLevel })
        .eq("id", user.id);
    }

    onLevelChange?.(newLevel);
  };

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}>
        <Badge variant={level ? levelBadgeVariants[level] : "level-a1"}>
          {level ?? "A1"}
        </Badge>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 flex gap-1 p-1.5 bg-[var(--bg-elevated)] border border-border rounded-[var(--radius-md)] shadow-lg"
            style={{ zIndex: "var(--z-dropdown)" }}
          >
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => handleSelect(l)}
                className="transition-transform hover:scale-105"
              >
                <Badge
                  variant={levelBadgeVariants[l]}
                  className={l === level ? "ring-2 ring-primary-400/50" : "opacity-60 hover:opacity-100"}
                >
                  {l}
                </Badge>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
