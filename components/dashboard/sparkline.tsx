"use client";

import { useId } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

import type { SparkPoint } from "@/lib/dashboard/types";

export function Sparkline({ data }: { data: SparkPoint[] }) {
  const gradientId = useId().replace(/:/g, "");
  const hasActivity = data.some((point) => point.clicks > 0);

  return (
    <div
      className="h-8 w-[4.5rem] shrink-0"
      title={hasActivity ? "Clicks over the last 7 days" : "No clicks in the last 7 days"}
      aria-hidden
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#3B82F6"
            strokeWidth={1.5}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
            dot={false}
            activeDot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
