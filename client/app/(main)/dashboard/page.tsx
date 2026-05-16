"use client";

import { useCreateNote, useNotes } from "@/hooks/useNotes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Plus, FileText, ArrowRight, Sparkles } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { SkeletonNote } from "@/components/SkeletonNote";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const createNote = useCreateNote();
  const { data, isLoading } = useNotes({ sort: 'updated' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCreateNote = useCallback(async () => {
    try {
      const { note } = await createNote.mutateAsync({});
      router.push(`/notes/${note._id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  }, [createNote, router]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'n' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        handleCreateNote();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleCreateNote]);

  const recentNotes = data?.notes?.slice(0, 5) || [];

  // MOBILE VIEW
  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-[var(--base)] px-6 pt-20 pb-10 overflow-y-auto">
        <header className="mb-10 animate-fadeIn">
          <h1 className="font-serif text-[32px] text-[var(--text-primary)] leading-tight mb-2">
            Welcome back, <br/>
            <span className="text-[var(--accent)]">{user?.name || 'Writer'}</span>
          </h1>
          <p className="font-sans text-[14px] text-[var(--text-secondary)]">Your workspace is ready.</p>
        </header>

        <div className="space-y-8 flex-1">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Recent Notes</h2>
              <FileText size={14} className="text-[var(--text-muted)]" />
            </div>

            {isLoading ? (
              <div className="space-y-3">
                <SkeletonNote />
                <SkeletonNote />
              </div>
            ) : recentNotes.length === 0 ? (
              <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] p-8 text-center">
                <p className="text-[13px] text-[var(--text-muted)] mb-4">No notes created yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentNotes.map((note, idx) => (
                  <button
                    key={note._id}
                    onClick={() => router.push(`/notes/${note._id}`)}
                    className="w-full flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] animate-fadeIn opacity-0"
                    style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'forwards' }}
                  >
                    <div className="text-left overflow-hidden pr-4">
                      <p className="font-sans text-[14px] font-medium text-[var(--text-primary)] truncate mb-1">
                        {note.title || "Untitled"}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text-muted)]">
                        {formatRelativeTime(note.updatedAt)}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-[var(--accent)] flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Floating Create Button for Mobile */}
        <button
          onClick={handleCreateNote}
          className="fixed bottom-8 right-6 flex items-center justify-center w-[56px] h-[56px] rounded-full bg-[var(--accent)] text-[#0A0A0A] shadow-[var(--shadow-lg)] hover:scale-105 active:scale-95 transition-transform duration-200 z-20"
        >
          <Plus size={24} />
        </button>
      </div>
    );
  }

  // DESKTOP VIEW
  return (
    <div className="flex h-full items-center justify-center text-[var(--text-muted)] bg-[var(--base)]">
      <div className="text-center max-w-sm animate-scaleIn">
        <div className="mb-6 flex justify-center text-[var(--accent)] opacity-20">
          <Sparkles size={64} strokeWidth={1} />
        </div>
        <h2 className="mb-3 text-[24px] font-serif text-[var(--text-primary)]">Select a note or create a new one</h2>
        <p className="text-[14px] mb-8 text-[var(--text-secondary)]">
          Your creative workspace is waiting for your next big idea.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleCreateNote}
            className="flex items-center space-x-2 bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-6 py-2.5 rounded-[var(--radius-md)] transition-all duration-200 group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-sans text-[14px] font-medium">Create New Note</span>
          </button>
          <p className="text-[11px] font-mono opacity-50">
            Press <kbd className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 border border-[var(--border)] mx-1 text-[var(--text-primary)]">N</kbd> anywhere to start
          </p>
        </div>
      </div>
    </div>
  );
}
