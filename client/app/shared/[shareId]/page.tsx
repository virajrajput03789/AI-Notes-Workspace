"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Spinner } from "@/components/Spinner";
import { Sparkles, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SharedNote {
  title: string;
  content: string;
  tags: string[];
  category: string;
  createdAt: string;
  aiSummary: string | null;
  aiActionItems: string[];
}

export default function SharedNotePage() {
  const { shareId } = useParams() as { shareId: string };

  const { data, isLoading, error } = useQuery({
    queryKey: ["shared", shareId],
    queryFn: () => api.get<{ note: SharedNote }>(`/shared/${shareId}`),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--base)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.note) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[var(--base)] px-4">
        <div className="text-center animate-scaleIn">
          <h1 className="font-serif text-[120px] leading-none text-[var(--text-muted)] opacity-20 mb-4">404</h1>
          <p className="font-sans text-[16px] text-[var(--text-secondary)] mb-8">
            This note is not available or has been made private.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-200 hover:-translate-y-[2px]"
          >
            <ArrowLeft size={16} />
            <span className="font-sans text-[14px] font-medium">Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const note = data.note;

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
    <div className="min-h-screen bg-[var(--base)] text-[var(--text-primary)]">
      {/* HEADER BAR */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[56px] bg-[#0A0A0A]/80 backdrop-blur-[12px] border-b border-[var(--border)]">
        <div className="max-w-[720px] mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="font-serif text-[20px] text-[var(--accent)] hover:opacity-80 transition-opacity">
            PEBLO NOTES
          </Link>
          <Link 
            href="/signup" 
            className="flex items-center space-x-1 px-4 py-1.5 rounded-[var(--radius-sm)] border border-[var(--border)] font-sans text-[13px] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span className="hidden sm:inline">Create your own notes</span>
            <span className="sm:hidden">Sign up</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-[720px] mx-auto px-6 pt-[120px] pb-[80px]">
        <article className="animate-fadeIn" style={{ animationDuration: '0.4s' }}>
          
          <div className="flex items-center space-x-2 font-mono text-[11px] text-[var(--text-muted)] mb-6">
            <span className="uppercase tracking-widest text-[var(--accent)] opacity-80">Shared Note</span>
            <span>›</span>
            <span>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="font-serif text-[32px] md:text-[48px] leading-[1.1] text-[var(--text-primary)] mb-6">
            {note.title || "Untitled"}
          </h1>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {note.tags.map(tag => (
                <span 
                  key={tag} 
                  className="px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] font-mono text-[11px] text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="h-[1px] w-full bg-[var(--border)] my-8" />

          <div className="font-mono text-[15px] leading-[1.9] text-[var(--text-secondary)] whitespace-pre-wrap">
            {note.content ? note.content : <span className="italic opacity-50">Empty note</span>}
          </div>

          {/* AI INSIGHTS */}
          {(note.aiSummary || (note.aiActionItems && note.aiActionItems.length > 0)) && (
            <div className="mt-16 rounded-[var(--radius-lg)] border border-[var(--border)] border-l-[3px] border-l-[var(--accent)] bg-[var(--surface)] p-7">
              <div className="flex items-center space-x-2 text-[var(--accent)] mb-6">
                <Sparkles size={20} className="animate-pulse-accent rounded-full" />
                <h3 className="font-serif text-[20px]">✦ AI Insights</h3>
              </div>
              
              {note.aiSummary && (
                <div className="mb-6">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2">
                    Summary
                  </h4>
                  <p className="font-sans text-[14px] leading-[1.7] text-[var(--text-secondary)]">
                    {renderSummary(note.aiSummary)}
                  </p>
                </div>
              )}

              {note.aiActionItems && note.aiActionItems.length > 0 && (
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-2 mt-4">
                    Action Items
                  </h4>
                  <ul className="space-y-2 mt-2">
                    {note.aiActionItems.map((item, idx) => (
                      <li 
                        key={idx} 
                        className="flex items-start font-sans text-[13px] text-[var(--text-secondary)] opacity-0 animate-slideInLeft"
                        style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                      >
                        <span className="text-[var(--accent)] mr-3 mt-1 text-[10px]">●</span>
                        <span className="flex-1 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </article>

        {/* FOOTER */}
        <footer className="mt-[80px] pt-10 border-t border-[var(--border)] text-center font-mono text-[11px] text-[var(--text-muted)]">
          Created with <span className="font-serif text-[14px] text-[var(--accent)] ml-1">Peblo Notes</span>
        </footer>
      </main>
    </div>
  );
}
