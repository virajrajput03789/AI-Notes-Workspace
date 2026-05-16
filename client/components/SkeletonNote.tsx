export function SkeletonNote() {
  return (
    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] mb-3">
      <div className="skeleton w-[70%] h-[13px] mb-2"></div>
      <div className="skeleton w-[90%] h-[11px]"></div>
    </div>
  );
}
