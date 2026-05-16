"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotes, useCreateNote } from "@/hooks/useNotes";
import { formatRelativeTime, useDebounce, cn } from "@/lib/utils";
import { Plus, Search, LogOut, LayoutDashboard, BarChart2, FileText, Menu, X, Archive } from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ isOpen, onToggle, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const createNote = useCreateNote();

  const [searchTerm, setSearchString] = useState(searchParams.get("search") || "");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isViewArchived, setIsViewArchived] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data, isLoading } = useNotes({
    search: debouncedSearch,
    archived: isViewArchived
  });

  const notes = data?.notes || [];

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [debouncedSearch, pathname, router, searchParams]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
    };
  }, [isOpen]);

  const handleCreateNote = async () => {
    try {
      const { note } = await createNote.mutateAsync({});
      if (onNavigate) onNavigate();
      router.push(`/notes/${note._id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <button 
        onClick={onToggle}
        className="fixed top-2 left-3 z-30 md:hidden w-8 h-8 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300"
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={cn(
          "fixed top-0 left-0 h-full w-[85vw] max-w-[280px] bg-[var(--surface)] border-r border-[var(--border)] z-50 transform transition-transform duration-300 ease-out overflow-y-auto md:relative md:translate-x-0 md:z-auto md:w-[280px] flex-shrink-0 flex flex-col h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        style={{
          background: 'linear-gradient(to bottom, var(--surface), transparent)',
        }}
      >
        
        {/* Header */}
        <div className="flex flex-col justify-center h-[60px] px-5 border-b border-[var(--border)]">
          <h1 className="font-serif text-[20px] text-[var(--accent)] leading-none">PEBLO</h1>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--text-muted)] mt-1">NOTES</span>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className={cn(
              "flex items-center space-x-3 px-4 h-[40px] rounded-[var(--radius-sm)] text-[14px] transition-all duration-200",
              pathname === "/dashboard"
                ? "bg-[var(--accent-dim)] text-[var(--accent)] border-l-2 border-[var(--accent)] font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
            )}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/insights"
            onClick={onNavigate}
            className={cn(
              "flex items-center space-x-3 px-4 h-[40px] rounded-[var(--radius-sm)] text-[14px] transition-all duration-200",
              pathname === "/insights"
                ? "bg-[var(--accent-dim)] text-[var(--accent)] border-l-2 border-[var(--accent)] font-medium"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)] hover:text-[var(--text-primary)] border-l-2 border-transparent"
            )}
          >
            <BarChart2 size={16} />
            <span>Insights</span>
          </Link>
        </nav>

        {/* Action Area */}
        <div className="px-4 pb-2">
          <button
            onClick={handleCreateNote}
            className="group w-full h-[40px] flex items-center justify-center space-x-2 rounded-[var(--radius-md)] bg-[var(--accent)] text-[#0A0A0A] font-medium text-[14px] transition-all duration-200 hover:brightness-110 hover:-translate-y-[1px] hover:shadow-[var(--shadow-accent)] active:translate-y-0 active:scale-[0.99]"
          >
            <Plus size={16} className="transition-transform duration-200 group-hover:rotate-90" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search 
              className={cn("absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200", 
                isSearchFocused ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} 
              size={16} 
            />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchString(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="w-full h-[36px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] py-0 pl-9 pr-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-glow)] transition-all duration-200 outline-none"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              {isViewArchived ? "Archived Notes" : "Your Notes"}
            </h3>
            <button 
              onClick={() => setIsViewArchived(!isViewArchived)}
              className={cn(
                "p-1 rounded transition-colors duration-200",
                isViewArchived ? "text-[var(--accent)] bg-[var(--accent-dim)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              )}
              title={isViewArchived ? "View active notes" : "View archived notes"}
            >
              <Archive size={12} />
            </button>
          </div>
          {isLoading ? (            <div className="space-y-3 mt-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-3 rounded-[var(--radius-md)] bg-transparent">
                  <div className="skeleton w-[70%] h-[13px] mb-2"></div>
                  <div className="skeleton w-[90%] h-[11px]"></div>
                </div>
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] opacity-50 space-y-3">
              <FileText size={24} />
              <p className="text-[13px]">No notes yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notes.map((note, index) => {
                const isActive = pathname === `/notes/${note._id}`;
                return (
                  <Link
                    key={note._id}
                    href={`/notes/${note._id}`}
                    onClick={onNavigate}
                    className={cn(
                      "block p-3 rounded-[var(--radius-md)] border-l-2 transition-all duration-200 group animate-slideInLeft opacity-0",
                      isActive
                        ? "bg-[var(--accent-dim)] border-[var(--accent)]"
                        : "bg-transparent border-transparent hover:bg-[var(--surface-2)] hover:translate-x-[2px]"
                    )}
                    style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
                  >
                    <div className="font-medium text-[13px] text-[var(--text-primary)] truncate mb-1">
                      {note.title || "Untitled"}
                    </div>
                    <div className="font-mono text-[11px] text-[var(--text-muted)] truncate mb-2">
                      {note.content || "Empty note"}
                    </div>
                    <div className="font-mono text-[10px] text-[var(--text-muted)] text-right">
                      {formatRelativeTime(note.updatedAt)}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer User Profile */}
        <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--surface-3)] border border-[var(--border)] flex items-center justify-center text-[12px] font-medium text-[var(--accent)]">
              {getInitials(user?.email || "")}
            </div>
            <div className="truncate font-mono text-[11px] text-[var(--text-secondary)]">
              {user?.email}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--danger)] transition-colors duration-200 p-2"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
