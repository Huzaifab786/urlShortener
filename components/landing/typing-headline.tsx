"use client";

import { useEffect, useState } from "react";

const WORDS = ["short", "simple", "fast", "trackable"] as const;

export function TypingHeadline() {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState<string>(WORDS[0]);
  const [phase, setPhase] = useState<"pause" | "delete" | "type">("pause");

  useEffect(() => {
    const word = WORDS[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "pause") {
      timeout = setTimeout(() => setPhase("delete"), 2000);
    } else if (phase === "delete") {
      if (display.length === 0) {
        timeout = setTimeout(() => {
          setIndex((i) => (i + 1) % WORDS.length);
          setPhase("type");
        }, 400);
      } else {
        timeout = setTimeout(() => {
          setDisplay((d) => d.slice(0, -1));
        }, 80);
      }
    } else {
      // type
      if (display === word) {
        setPhase("pause");
      } else {
        timeout = setTimeout(() => {
          setDisplay(word.slice(0, display.length + 1));
        }, 120);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, display, index]);

  return (
    <h1 className="text-[28px] font-semibold leading-9 tracking-tight text-foreground md:text-4xl md:leading-[44px]">
      Make your links{" "}
      <span className="font-mono text-primary">
        {display}
        <span className="animate-pulse">|</span>
      </span>
    </h1>
  );
}
