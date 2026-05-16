import { AlertCircle } from "lucide-react";

export function ErrorBanner({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div className="flex items-center space-x-2 rounded bg-red-500/10 p-3 text-red-500 text-sm">
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
