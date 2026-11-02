import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PLATFORMS } from "../data";
import { applyTokens, tokensFromScreenshot, type ThemeTokens } from "./theme";

type Status = "idle" | "loading" | "ready" | "error";

type ThemeContextValue = {
  tokens: ThemeTokens | null;
  source: string | null;
  status: Status;
  /** Re-derive the whole theme from a screenshot URL. */
  apply: (src: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const tokenCache = new Map<string, ThemeTokens>();

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokens] = useState<ThemeTokens | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const seq = useRef(0);

  const apply = useCallback((src: string) => {
    const ticket = ++seq.current;
    setSource(src);

    const cached = tokenCache.get(src);
    if (cached) {
      applyTokens(cached);
      setTokens(cached);
      setStatus("ready");
      return;
    }

    setStatus("loading");
    tokensFromScreenshot(src)
      .then((next) => {
        tokenCache.set(src, next);
        // A newer screenshot finished first — drop this result.
        if (ticket !== seq.current) return;
        applyTokens(next);
        setTokens(next);
        setStatus("ready");
      })
      .catch(() => {
        if (ticket !== seq.current) return;
        // Keep the last valid palette; the static fallback still renders.
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    const run = () => apply(PLATFORMS[0].shots[0].src);
    // Keep the first paint free of quantization work; the static palette shows
    // until this runs, then the MCU palette transitions in.
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(run, 350);
    return () => window.clearTimeout(id);
  }, [apply]);

  return (
    <ThemeContext.Provider value={{ tokens, source, status, apply }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
