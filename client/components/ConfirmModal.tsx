"use client";

import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isDanger?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  isDanger = true,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-lg)] animate-scaleIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-6",
            isDanger ? "bg-[var(--danger-dim)] text-[var(--danger)]" : "bg-[var(--accent-dim)] text-[var(--accent)]"
          )}>
            <AlertTriangle size={24} />
          </div>

          <h2 className="font-serif text-[24px] text-[var(--text-primary)] mb-3">{title}</h2>
          <p className="font-sans text-[14px] text-[var(--text-secondary)] leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex items-center space-x-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 h-[44px] rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] font-medium text-[14px] hover:bg-[var(--surface-3)] transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={cn(
                "flex-1 h-[44px] rounded-[var(--radius-md)] font-semibold text-[14px] transition-all active:scale-[0.98]",
                isDanger 
                  ? "bg-[var(--danger)] text-white hover:brightness-110 shadow-[0_4px_12px_rgba(229,115,115,0.2)]" 
                  : "bg-[var(--accent)] text-[#0A0A0A] hover:brightness-110 shadow-[var(--shadow-accent)]"
              )}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
