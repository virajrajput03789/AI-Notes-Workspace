"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface WeeklyChartProps {
  data: { date: string; count: number }[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const formattedData = data.map((item) => {
    const dateObj = new Date(item.date);
    return {
      day: dateObj.toLocaleDateString("en-US", { weekday: "short" }),
      count: item.count,
    };
  });

  return (
    <div className="h-[300px] w-full mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-dm-mono)" }} 
            dy={10} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "var(--font-dm-mono)" }} 
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: "var(--surface-2)" }}
            contentStyle={{ 
              backgroundColor: "var(--surface-2)", 
              border: "1px solid var(--border)", 
              borderRadius: "var(--radius-sm)",
              fontFamily: "var(--font-dm-mono)",
              fontSize: "12px",
              color: "var(--text-primary)",
              boxShadow: "var(--shadow-md)"
            }}
            itemStyle={{ color: "var(--accent)" }}
          />
          <Bar 
            dataKey="count" 
            fill="var(--accent)" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={40} 
            opacity={0.8}
            isAnimationActive={true}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
