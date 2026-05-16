"use client";

import { useInsights } from "@/hooks/useInsights";
import { Spinner } from "@/components/Spinner";
import { InsightCard } from "@/components/InsightCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { FileText, Archive, Sparkles, Tag as TagIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";

export default function InsightsPage() {
  const { data, isLoading, error } = useInsights();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--base)]">
        <div className="space-y-8 w-full max-w-5xl px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="skeleton h-[120px] rounded-[var(--radius-lg)]"></div>
             <div className="skeleton h-[120px] rounded-[var(--radius-lg)]"></div>
             <div className="skeleton h-[120px] rounded-[var(--radius-lg)]"></div>
             <div className="skeleton h-[120px] rounded-[var(--radius-lg)]"></div>
          </div>
          <div className="skeleton h-[400px] rounded-[var(--radius-lg)]"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-[var(--text-muted)] bg-[var(--base)]">
        Failed to load insights.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 md:p-12 h-full overflow-y-auto bg-[var(--base)]">
      <div className="mb-10 animate-fadeIn">
        <h1 className="font-serif text-[40px] text-[var(--text-primary)] leading-none mb-3">Your Workspace</h1>
        <p className="font-sans text-[14px] text-[var(--text-muted)]">At a glance view of your productivity.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        <InsightCard title="Total Notes" value={data.totalNotes} icon={<FileText size={24} />} delay={0} />
        <InsightCard title="Archived" value={data.archivedNotes} icon={<Archive size={24} />} delay={100} />
        <InsightCard title="AI Summaries" value={data.aiUsage} icon={<Sparkles size={24} />} delay={200} />
        <InsightCard title="Most Used Tag" value={data.topTags[0]?.tag || "None"} icon={<TagIcon size={24} />} delay={300} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 animate-fadeIn" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          <h3 className="font-serif text-[24px] text-[var(--text-primary)]">Weekly Activity</h3>
          <WeeklyChart data={data.weeklyActivity} />
        </div>

        {/* Side Panels */}
        <div className="space-y-8">
          
          {/* Top Tags */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 animate-fadeIn" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
            <h3 className="font-serif text-[24px] text-[var(--text-primary)] mb-6">Top Tags</h3>
            {data.topTags.length === 0 ? (
              <p className="text-[13px] text-[var(--text-muted)]">No tags used yet.</p>
            ) : (
              <div className="flex overflow-x-auto md:flex-wrap gap-2 pb-2 md:pb-0 scrollbar-hide">
                {data.topTags.map((tag, idx) => (
                  <div
                    key={tag.tag}
                    className="flex-shrink-0 flex items-center space-x-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-1.5 text-[12px] font-mono text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] animate-scaleIn opacity-0"
                    style={{ animationDelay: `${Math.min(idx * 50, 400)}ms`, animationFillMode: 'forwards' }}
                  >
                    <span>{tag.tag}</span>
                    <span className="bg-[var(--surface-3)] rounded-full px-2 py-0.5 text-[10px] text-[var(--accent)] border border-[var(--border)]">
                      {tag.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Notes */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 animate-fadeIn" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            <h3 className="font-serif text-[24px] text-[var(--text-primary)] mb-6">Recent Notes</h3>
            {data.recentNotes.length === 0 ? (
              <p className="text-[13px] text-[var(--text-muted)]">No recent notes.</p>
            ) : (
              <div className="space-y-0">
                {data.recentNotes.map((note) => (
                  <Link
                    key={note._id}
                    href={`/notes/${note._id}`}
                    className="flex items-center justify-between group py-4 border-b border-[var(--border)] last:border-0 last:pb-0 first:pt-0"
                  >
                    <div className="pr-4">
                      <p className="font-sans text-[14px] font-medium text-[var(--text-primary)] truncate max-w-[150px] group-hover:text-[var(--accent)] transition-colors">
                        {note.title || "Untitled"}
                      </p>
                      <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1">
                        {formatRelativeTime(note.updatedAt)}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-[var(--accent)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
