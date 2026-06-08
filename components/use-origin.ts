"use client";

import { useSyncExternalStore } from "react";

export function useOrigin(): string {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
}
