"use client";

import { useCallback, useState } from "react";

/**
 * Copy text to clipboard and provide feedback state.
 * Returns [copy, copied] — `copied` resets after a short timeout.
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string, label?: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(label ?? text);
      setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs],
  );

  return { copy, copied } as const;
}
