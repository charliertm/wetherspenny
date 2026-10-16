"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * A horizontally scrolling row with no scrollbar. On wider screens, where
 * swiping isn't an option, chevrons appear at whichever ends have more to see.
 */
export default function ChipScroller({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft > 4,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scroll = (direction: 1 | -1) =>
    ref.current?.scrollBy({
      left: direction * ref.current.clientWidth * 0.6,
      behavior: "smooth",
    });

  const arrow =
    "absolute top-1/2 hidden size-8 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-white shadow-md backdrop-blur-md transition hover:bg-black/45 active:scale-90 sm:grid";

  return (
    <div className="relative">
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className="flex snap-x scroll-px-4 [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-0.5 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      {edges.start && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll(-1)}
          className={`${arrow} left-1.5 animate-fade`}
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      {edges.end && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll(1)}
          className={`${arrow} right-1.5 animate-fade`}
        >
          <ChevronRight className="size-5" />
        </button>
      )}
    </div>
  );
}
