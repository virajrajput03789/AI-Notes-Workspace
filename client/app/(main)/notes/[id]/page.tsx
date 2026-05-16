"use client";

import { useNote, useUpdateNote, useDeleteNote, useGenerateSummary } from "@/hooks/useNote";
import { useAutoSave } from "@/hooks/useAutoSave";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useRef } from "react";
import { Spinner } from "@/components/Spinner";
import { TagInput } from "@/components/TagInput";
import { AIPanel } from "@/components/AIPanel";
import { ErrorBanner } from "@/components/ErrorBanner";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Sparkles, Share2, Archive, Trash2, ChevronDown, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["General", "Work", "Personal", "Ideas", "Research"];

interface ApiErrorResponse {
  message: string;
}

export default function NoteEditorPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, isLoading, error } = useNote(id);
  const deleteNote = useDeleteNote();
  const generateSummary = useGenerateSummary();
  const updateNoteMutation = useUpdateNote();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState("General");
  
  const [isSharePanelOpen, setIsSharePanelOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const { save, saveStatus, isFirstRender } = useAutoSave(id, 1500);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (data?.note && isFirstRender.current) {
      setTitle(data.note.title === "Untitled" ? "" : data.note.title);
      setContent(data.note.content || "");
      setTags(data.note.tags || []);
      setCategory(data.note.category || "General");
      isFirstRender.current = false;
      setTimeout(handleInput, 50);
    }
  }, [data, isFirstRender]);

  useEffect(() => {
    if (!isFirstRender.current) {
      const timeoutId = setTimeout(() => {
        save({ title: title || "Untitled", content, tags, category });
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [title, content, tags, category, isFirstRender, save]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteNote.mutateAsync(id);
    router.push("/dashboard");
  };

  const handleGenerateSummary = async () => {
    setGenError(null);
    try {
      await updateNoteMutation.mutateAsync({ id, data: { content, title } });
      await generateSummary.mutateAsync(id);
    } catch (err: unknown) {
      const errorResponse = err as ApiErrorResponse;
      setGenError(errorResponse.message || "Failed to generate summary");
    }
  };

  const handleToggleShare = useCallback(async (isPublic: boolean) => {
    await updateNoteMutation.mutateAsync({ id, data: { isPublic } });
  }, [id, updateNoteMutation]);

  const handleToggleArchive = async () => {
    await updateNoteMutation.mutateAsync({ id, data: { isArchived: !data?.note.isArchived } });
  };

  const handleCopyShareLink = async () => {
    if (data?.note?.shareId) {
      const shareUrl = `${window.location.origin}/shared/${data.note.shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-[var(--base)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data?.note) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 bg-[var(--base)]">
        <div className="text-xl text-[var(--text-muted)]">Note not found</div>
        <button onClick={() => router.push("/dashboard")} className="text-[var(--accent)] hover:underline">
          Go back to dashboard
        </button>
      </div>
    );
  }

  const note = data.note;

  return (
    <div className="flex h-full flex-col relative bg-[var(--base)] editor-container">
      {/* TOP BAR - FIXED/STICKY */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm h-12 px-3 sm:px-4 md:px-6 action-bar">
        <div className="flex items-center space-x-2 sm:space-x-4 overflow-hidden">
          <div className="relative group flex-shrink-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="appearance-none font-mono text-[10px] sm:text-[12px] bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] px-2 sm:px-3 py-1 rounded-[999px] pr-6 sm:pr-7 cursor-pointer focus:outline-none focus:border-[var(--accent)] transition-all duration-200 group-hover:border-[var(--border-hover)]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={10} className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
          </div>
          
          <div className="font-mono text-[10px] sm:text-[11px] text-[var(--text-muted)] h-4 flex items-center relative w-[40px] sm:w-[60px] flex-shrink-0">
            <div className={cn("absolute inset-0 flex items-center transition-opacity duration-300", saveStatus === "saving" ? "opacity-100" : "opacity-0")}>
              <span className="hidden sm:inline">Saving</span><span className="animate-pulse">...</span>
            </div>
            <div className={cn("absolute inset-0 flex items-center transition-opacity duration-300", saveStatus === "saved" ? "opacity-100" : "opacity-0")}>
              <span className="hidden sm:inline">Saved</span> ✓
            </div>
            <div className={cn("absolute inset-0 flex items-center text-[var(--danger)] transition-opacity duration-300", saveStatus === "error" ? "opacity-100" : "opacity-0")}>
              Error
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button
            onClick={handleGenerateSummary}
            disabled={generateSummary.isPending}
            style={{
              background: 'linear-gradient(var(--surface-2), var(--surface-2)) padding-box, linear-gradient(135deg, var(--accent), #C4A882) border-box',
              border: '1px solid transparent'
            }}
            className="group flex h-[32px] items-center space-x-1 sm:space-x-2 px-2 sm:px-3 rounded-[var(--radius-sm)] font-sans text-[13px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[var(--shadow-sm)] disabled:opacity-50"
            title="AI Magic"
          >
            {generateSummary.isPending ? (
              <Spinner size="sm" />
            ) : (
              <Sparkles size={14} className="text-[var(--accent)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            )}
            <span className="hidden sm:inline lg:inline">{generateSummary.isPending ? "Thinking..." : "AI Magic"}</span>
          </button>
          
          <button
            onClick={() => setIsSharePanelOpen(!isSharePanelOpen)}
            className={cn(
              "flex h-[32px] items-center space-x-1 sm:space-x-2 px-2 sm:px-3 rounded-[var(--radius-sm)] font-sans text-[13px] font-medium transition-all duration-200 border",
              note.isPublic 
                ? "bg-[var(--accent-dim)] border-[var(--accent)] text-[var(--accent)] animate-pulse-accent" 
                : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:-translate-y-[1px]"
            )}
            title="Share"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline lg:inline">Share</span>
          </button>

          <button
            onClick={handleToggleArchive}
            className={cn(
              "h-[32px] px-2 sm:px-3 rounded-[var(--radius-sm)] border transition-all duration-200",
              note.isArchived 
                ? "bg-[var(--surface-3)] border-[var(--border)] text-[var(--accent)]" 
                : "bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-hover)] hover:-translate-y-[1px]"
            )}
            title={note.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive size={14} />
          </button>

          <button
            onClick={handleDelete}
            className="group flex items-center gap-1.5 h-[32px] px-2 sm:px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--danger-dim)] hover:border-[var(--danger)] hover:text-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/50"
            title="Delete"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* INLINE SHARE PANEL */}
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out bg-[var(--surface-2)] border-b border-[var(--border)]",
          isSharePanelOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <div className="px-4 py-4 sm:px-6 md:px-[64px] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={note.isPublic}
                onChange={(e) => handleToggleShare(e.target.checked)}
              />
              <div className="peer h-6 w-11 rounded-full bg-[var(--surface-3)] border border-[var(--border)] transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-[var(--text-primary)] after:transition-all peer-checked:bg-[var(--accent)] peer-checked:after:translate-x-full peer-checked:after:bg-[#0A0A0A] peer-focus:outline-none"></div>
            </label>
            <div>
              <p className="font-sans text-[14px] font-medium text-[var(--text-primary)]">Public link</p>
              <p className="text-[12px] text-[var(--text-muted)]">Anyone with the link can view this note</p>
            </div>
          </div>

          {note.isPublic && note.shareId && (
            <div className="flex items-center space-x-2 animate-scaleIn w-full lg:w-auto">
              <input
                type="text"
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/shared/${note.shareId}`}
                className="flex-1 md:w-[300px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-3)] px-4 py-2 font-mono text-[12px] text-[var(--text-secondary)] focus:outline-none"
              />
              <button
                onClick={handleCopyShareLink}
                className="flex h-[34px] items-center justify-center space-x-1 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] px-4 text-[12px] font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {copied ? <Check size={14} className="text-[var(--success)]" /> : <Copy size={14} />}
                <span>{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {genError && (
        <div className="m-4">
          <ErrorBanner message={genError} />
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-12">
          
          {note.isArchived && (
            <div className="mb-8 rounded-[var(--radius-md)] bg-[var(--surface-3)] border border-[var(--border)] p-4 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
                <Archive size={16} className="text-[var(--accent)]" />
                <span className="text-[13px] font-medium">This note is currently archived.</span>
              </div>
              <button 
                onClick={handleToggleArchive}
                className="text-[12px] font-mono text-[var(--accent)] hover:underline"
              >
                Unarchive
              </button>
            </div>
          )}

          {note.aiSummary && (
            <AIPanel
              summary={note.aiSummary}
              actionItems={note.aiActionItems || []}
              suggestedTitle={note.aiSuggestedTitle || null}
              generatedAt={note.aiGeneratedAt || ""}
              onApplyTitle={(t) => setTitle(t)}
              onRegenerate={handleGenerateSummary}
              isGenerating={generateSummary.isPending}
            />
          )}

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full bg-transparent font-serif text-[28px] md:text-[40px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] mb-6 border-none focus:ring-0 focus:outline-none leading-[1.2]"
          />

          <div className="mb-8">
            <TagInput tags={tags} onChange={setTags} />
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              handleInput();
            }}
            placeholder="Start writing..."
            className="w-full min-h-[400px] bg-transparent font-mono text-[15px] leading-[1.8] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] border-none focus:ring-0 focus:outline-none resize-none"
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message="Are you sure you want to delete this note? This action cannot be undone and all your data will be permanently removed."
        confirmText="Delete Note"
      />
    </div>
  );
}
