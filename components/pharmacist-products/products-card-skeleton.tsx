import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "../ui/card";


function Bone({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-md bg-muted-foreground/15 motion-safe:animate-pulse",
        className,
      )}
    />
  );
}


function TextBone({
  lineClassName,
  className,
}: {
  lineClassName: string;
  className: string;
}) {
  return (
    <div className={cn("flex items-center", lineClassName)}>
      <Bone className={className} />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="h-full gap-2 overflow-hidden border-border/70 bg-card"
    >
      <div className="h-full">
        <CardHeader className="gap-4 pb-7">
          <div className="flex items-start justify-between gap-3">
            <Bone className="size-12 shrink-0 rounded-xl" />
          </div>
          <div className="min-w-0">
            <TextBone lineClassName="h-6" className="h-4 w-3/4" />
            <TextBone lineClassName="mt-1 h-4" className="h-3 w-1/2" />
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5 pt-0">
          <div className="flex h-5 items-center gap-2">
            <Bone className="size-[18px] shrink-0 rounded-full" />
            <Bone className="h-3.5 w-2/5" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[0, 1].map((i) => (
              <div key={i} className="rounded-xl bg-muted/55 p-3">
                <TextBone lineClassName="mb-1 h-5" className="h-3.5 w-16" />
                <TextBone lineClassName="h-5" className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
      </div>

      {/* cart actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border/70 px-6 pt-4">
        <Bone className="h-9 w-28" />
      </div>
    </Card>
  );
}

export function ProductCardSkeletonList({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}