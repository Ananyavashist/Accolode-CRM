import { Construction } from "@/components/ui/icons";

export function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-section">
      <div className="section-card flex flex-col items-center justify-center gap-3 px-6 py-24 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
          <Construction size={22} />
        </span>
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="max-w-sm text-sm text-ink-muted">
          This section is coming up next. The page scaffolding and navigation are ready.
        </p>
      </div>
    </div>
  );
}
