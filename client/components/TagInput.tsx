import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim().replace(/^#/, "");
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        onChange([...tags, newTag]);
      }
      setInput("");
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="group flex items-center space-x-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] px-[10px] py-[4px] font-mono text-[11px] text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-default animate-scaleIn"
        >
          <span>{tag}</span>
          <button
            onClick={() => removeTag(tag)}
            className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-[var(--danger)] focus:outline-none"
          >
            <X size={10} />
          </button>
        </span>
      ))}
      {tags.length < 10 && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 bg-transparent font-mono text-[12px] text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)] min-w-[100px]"
        />
      )}
    </div>
  );
}
