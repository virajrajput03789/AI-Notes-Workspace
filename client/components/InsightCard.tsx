import { ReactNode } from "react";

interface InsightCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  delay?: number;
}

export function InsightCard({ title, value, icon, delay = 0 }: InsightCardProps) {
  return (
    <div 
      className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-200 opacity-0 animate-fadeIn"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-[12px] text-[var(--text-muted)] uppercase tracking-wider">{title}</h3>
        <div className="text-[var(--accent)] opacity-80">
          {icon}
        </div>
      </div>
      <div>
        <p className="font-serif text-[40px] leading-[1.1] text-[var(--text-primary)] truncate">{value}</p>
      </div>
    </div>
  );
}
