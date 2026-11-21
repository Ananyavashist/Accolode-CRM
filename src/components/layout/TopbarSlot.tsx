import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type TopbarSlotContextValue = {
  leading: ReactNode;
  setLeading: (node: ReactNode) => void;
};

const TopbarSlotContext = createContext<TopbarSlotContextValue | null>(null);

export function TopbarSlotProvider({ children }: { children: ReactNode }) {
  const [leading, setLeading] = useState<ReactNode>(null);
  const value = useMemo(() => ({ leading, setLeading }), [leading]);
  return <TopbarSlotContext.Provider value={value}>{children}</TopbarSlotContext.Provider>;
}

export function useTopbarLeading(): ReactNode {
  return useContext(TopbarSlotContext)?.leading ?? null;
}

/** Renders page title into the global top bar (left), aligned with search/actions. */
export function TopbarLeadingSlot({ children }: { children: ReactNode }) {
  const ctx = useContext(TopbarSlotContext);
  const setLeading = ctx?.setLeading;
  useEffect(() => {
    if (!setLeading) return;
    setLeading(children);
    return () => setLeading(null);
  }, [children, setLeading]);
  return null;
}