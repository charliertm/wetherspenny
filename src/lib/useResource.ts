"use client";

import { useEffect, useEffectEvent, useState } from "react";

export type Resource<T> =
  | { status: "loading" }
  | { status: "ready"; data: T }
  | { status: "error"; error: Error; retry: () => void };

/**
 * Loads data in the browser once `key` is set and reloads when it changes.
 * Never runs during server rendering.
 */
export function useResource<T>(
  key: string | null,
  load: () => Promise<T>,
): Resource<T> {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    id: string;
    data?: T;
    error?: Error;
  } | null>(null);
  const id = key === null ? null : `${key}#${attempt}`;
  const run = useEffectEvent(load);

  useEffect(() => {
    if (id === null) return;
    let cancelled = false;
    run().then(
      (data) => !cancelled && setResult({ id, data }),
      (error: unknown) =>
        !cancelled &&
        setResult({
          id,
          error: error instanceof Error ? error : new Error(String(error)),
        }),
    );
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (id === null || result?.id !== id) return { status: "loading" };
  if (result.error) {
    return {
      status: "error",
      error: result.error,
      retry: () => setAttempt((n) => n + 1),
    };
  }
  return { status: "ready", data: result.data as T };
}
