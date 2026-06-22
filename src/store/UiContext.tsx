import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UiContextValue {
  addClientOpen: boolean;
  openAddClient: () => void;
  closeAddClient: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [addClientOpen, setAddClientOpen] = useState(false);

  const openAddClient = useCallback(() => setAddClientOpen(true), []);
  const closeAddClient = useCallback(() => setAddClientOpen(false), []);

  return (
    <UiContext.Provider value={{ addClientOpen, openAddClient, closeAddClient }}>
      {children}
    </UiContext.Provider>
  );
}

export function useUi(): UiContextValue {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
