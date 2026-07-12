"use client";

import { useEffect, useState } from "react";

export function LiveCounter({ initial = 1_204_392 }: { initial?: number }) {
  const [count, setCount] = useState(initial);

  useEffect(() => {
    const id = window.setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3) + 1);
    }, 3500);

    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-sm text-muted-foreground/80">
      <span className="font-semibold text-primary/80">
        {count.toLocaleString()}
      </span>{" "}
      links shortened and counting
    </p>
  );
}
