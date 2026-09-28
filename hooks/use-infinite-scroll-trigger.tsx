import { useEffect, useRef } from "react";

type Options = {
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
};


export function useInfiniteScrollTrigger({
  onIntersect,
  enabled = true,
  rootMargin = "400px",
  threshold = 0,
}: Options) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const onIntersectRef = useRef(onIntersect);
  useEffect(() => {
    onIntersectRef.current = onIntersect;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!enabled || !node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onIntersectRef.current();
      },
      { rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin, threshold]);

  return sentinelRef;
}