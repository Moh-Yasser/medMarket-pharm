import { formatSYP } from "@/lib/format"; // adjust path

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className="rounded-lg border border-border/50 bg-background px-3 py-2 shadow-xl">
      {/* ✅ no month/title */}

      <div className="flex items-center gap-2">
        {/* dot indicator (like default) */}
        <span className="h-2 w-2 rounded-full bg-primary" />

        <p className="text-sm text-muted-foreground">
          المبيعات
        </p>

        <span className="ml-auto text-sm font-medium text-foreground tabular-nums">
          {formatSYP(item.value)}
        </span>
      </div>
    </div>
  );
};
