import { formatRelativeTime } from "@/lib/utils";
import { Sparkles, RefreshCw } from "lucide-react";

interface AIPanelProps {
  summary: string;
  actionItems: string[];
  suggestedTitle: string | null;
  generatedAt: string;
  onApplyTitle: (title: string) => void;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export function AIPanel({
  summary,
  actionItems,
  suggestedTitle,
  generatedAt,
  onApplyTitle,
  onRegenerate,
  isGenerating,
}: AIPanelProps) {
  // CSS fade in word by word effect
  const renderSummary = (text: string) => {
    const words = text.split(" ");
    return words.map((word, i) => (
      <span
        key={i}
        className="inline-block animate-fadeIn opacity-0"
        style={{ animationDelay: `${Math.min(i * 30, 1000)}ms` }}
      >
        {word}&nbsp;
      </span>
    ));
  };

  return (
    <div className="overflow-hidden transition-[max-height] duration-500 ease-in-out max-h-[800px] animate-fadeIn mb-8">
      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent)] bg-[var(--surface)] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[var(--accent)]">
            <Sparkles size={18} className="animate-pulse-accent rounded-full" />
            <h3 className="font-serif text-xl">✦ AI Insights</h3>
          </div>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center space-x-1 font-mono text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={isGenerating ? "animate-spin" : ""} />
            <span>{isGenerating ? "Generating..." : "Regenerate"}</span>
          </button>
        </div>

        {suggestedTitle && (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Suggested Title
            </h4>
            <button
              onClick={() => onApplyTitle(suggestedTitle)}
              title="Click to apply title"
              className="text-left font-serif text-[22px] text-[var(--text-primary)] hover:text-[var(--accent)] hover:underline transition-colors w-full"
            >
              {suggestedTitle}
            </button>
          </div>
        )}

        <div>
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">
            Summary
          </h4>
          <p className="font-sans text-[14px] leading-[1.7] text-[var(--text-secondary)]">
            {renderSummary(summary)}
          </p>
        </div>

        {actionItems && actionItems.length > 0 && (
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Action Items
            </h4>
            <ul className="space-y-2">
              {actionItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start font-sans text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors opacity-0 animate-slideInLeft"
                  style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                >
                  <span className="text-[var(--accent)] mr-3 mt-1 text-[10px]">●</span>
                  <span className="flex-1 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="font-mono text-[11px] text-[var(--text-muted)] pt-4 border-t border-[var(--border)] flex justify-end">
          Generated {formatRelativeTime(generatedAt)}
        </div>
      </div>
    </div>
  );
}
