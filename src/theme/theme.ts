import {
  Hct,
  SchemeTonalSpot,
  hexFromArgb,
  sourceColorFromImage,
} from "@material/material-color-utilities";

/**
 * Tokens consumed by the Tailwind theme in index.css.
 * Names match @theme keys, applied as `--color-<name>` on :root.
 */
export type ThemeTokens = {
  surface: string;
  surface2: string;
  surface3: string;
  outline: string;
  on: string;
  muted: string;
  primary: string;
  primaryStrong: string;
  onPrimary: string;
  primaryContainer: string;
  nothing: string;
  /** The quantized source colour MCU picked out of the screenshot. */
  seed: string;
};

const imageCache = new Map<string, Promise<HTMLImageElement>>();

/** Screenshots are served by raw.githubusercontent.com with CORS enabled. */
function loadImage(src: string): Promise<HTMLImageElement> {
  const hit = imageCache.get(src);
  if (hit) return hit;
  const job = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`theme: could not load ${src}`));
    img.src = src;
  });
  imageCache.set(src, job);
  return job;
}

/**
 * Material Color Utilities — quantize the screenshot to one source colour,
 * then build the M3 tonal-spot dark scheme from it. Tonal spot keeps the
 * screenshot's hue, so switching tabs visibly re-tints the site. Surfaces stay
 * AMOLED-dark by pulling neutrals from the scheme's own tonal palette instead
 * of using the stock (lighter) surface roles.
 */
export function tokensFromSource(sourceArgb: number): ThemeTokens {
  const scheme = new SchemeTonalSpot(Hct.fromInt(sourceArgb), true, 0);
  const neutral = scheme.neutralPalette;
  const neutralVariant = scheme.neutralVariantPalette;

  return {
    surface: hexFromArgb(neutral.tone(5)),
    surface2: hexFromArgb(neutral.tone(9)),
    surface3: hexFromArgb(neutral.tone(14)),
    outline: hexFromArgb(neutralVariant.tone(24)),
    on: hexFromArgb(neutral.tone(92)),
    muted: hexFromArgb(neutralVariant.tone(62)),
    primary: hexFromArgb(scheme.primary),
    primaryStrong: hexFromArgb(scheme.primaryFixed),
    onPrimary: hexFromArgb(scheme.onPrimary),
    primaryContainer: hexFromArgb(scheme.primaryContainer),
    nothing: hexFromArgb(scheme.errorPalette.tone(55)),
    seed: hexFromArgb(sourceArgb),
  };
}

export async function tokensFromScreenshot(src: string): Promise<ThemeTokens> {
  const img = await loadImage(src);
  const source = await sourceColorFromImage(img);
  return tokensFromSource(source);
}

const CSS_KEYS: Record<keyof ThemeTokens, string> = {
  surface: "--color-surface",
  surface2: "--color-surface-2",
  surface3: "--color-surface-3",
  outline: "--color-outline",
  on: "--color-on",
  muted: "--color-muted",
  primary: "--color-primary",
  primaryStrong: "--color-primary-strong",
  onPrimary: "--color-on-primary",
  primaryContainer: "--color-primary-container",
  nothing: "--color-nothing",
  // Not a Tailwind colour; exposed for the readout.
  seed: "--theme-seed",
};

export function applyTokens(tokens: ThemeTokens, root: HTMLElement = document.documentElement) {
  for (const key of Object.keys(CSS_KEYS) as (keyof ThemeTokens)[]) {
    root.style.setProperty(CSS_KEYS[key], tokens[key]);
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  meta?.setAttribute("content", tokens.surface);
}
