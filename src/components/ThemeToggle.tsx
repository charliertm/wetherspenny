"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const ORDER = ["system", "light", "dark"] as const;
const ICONS = { system: Monitor, light: Sun, dark: Moon };
const LABELS = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

const subscribe = () => () => {};

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const { theme, setTheme } = useTheme();
  // The theme is only known on the client, so render a placeholder on the server
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const current = mounted
    ? ((theme as (typeof ORDER)[number]) ?? "system")
    : "system";
  const Icon = ICONS[current] ?? Monitor;
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`${LABELS[current]}. Switch to ${LABELS[next].toLowerCase()}`}
      title={LABELS[current]}
      className={`grid size-10 place-items-center rounded-full transition active:scale-90 ${className}`}
    >
      <Icon
        className={`size-5 transition-opacity ${mounted ? "" : "opacity-0"}`}
      />
    </button>
  );
}
