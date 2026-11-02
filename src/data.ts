export const REPO = "https://github.com/kerneldroid/Nightzuku";
export const RELEASES = `${REPO}/releases/latest`;
export const VERSION = "v13.7.1-r58";
const RAW = "https://raw.githubusercontent.com/kerneldroid/Nightzuku/main/screenshots";

export type Shot = { src: string; label: string; note: string };
export type Platform = { id: string; name: string; aspect: string; frame: "phone" | "watch" | "tv"; shots: Shot[] };

export const PLATFORMS: Platform[] = [
  {
    id: "phone",
    name: "Phone",
    aspect: "aspect-[704/1568]",
    frame: "phone",
    shots: [
      { src: `${RAW}/phone/main.png`, label: "Home", note: "Server status, start methods, wireless debugging" },
      { src: `${RAW}/phone/apps.png`, label: "Apps", note: "Segmented rows, granted state auto-refresh" },
      { src: `${RAW}/phone/modules.png`, label: "Modules", note: "ZIP modules, enable switch, action.sh, last-run logs" },
      { src: `${RAW}/phone/module-webui.png`, label: "Module WebUI", note: "Local WebUI with the verifyHost bridge" },
      { src: `${RAW}/phone/settings.png`, label: "Settings", note: "Animated category switch, module policy controls" },
    ],
  },
  {
    id: "wear",
    name: "Wear OS",
    aspect: "aspect-square",
    frame: "watch",
    shots: [
      { src: `${RAW}/wearos/wearos_main_scaled.png`, label: "Home", note: "Watch-side server status" },
      { src: `${RAW}/wearos/wearos_apps.png`, label: "Apps", note: "Per-app grants on Wear OS" },
      { src: `${RAW}/wearos/wearos_modules_scaled.png`, label: "Modules", note: "Module list, compact form factor" },
      { src: `${RAW}/wearos/wearos_dialog.png`, label: "Dialog", note: "Dynamic colour on the watch" },
      { src: `${RAW}/wearos/wearos_settings_scaled.png`, label: "Settings", note: "Wear pairing and policy" },
    ],
  },
  {
    id: "tv",
    name: "Android TV",
    aspect: "aspect-video",
    frame: "tv",
    shots: [
      { src: `${RAW}/tv/main.png`, label: "Home", note: "Lean-back layout for the living room" },
      { src: `${RAW}/tv/modules.png`, label: "Modules", note: "Module management on TV" },
      { src: `${RAW}/tv/settings.png`, label: "Settings", note: "Same policy surface, TV scale" },
    ],
  },
];

export const FACTS = [
  {
    k: "Dual-wire",
    v: "Native zero-stub protocol (INightService) runs alongside the classic Shizuku binder. Each client gets the wire it declares.",
  },
  {
    k: "Coexistence",
    v: "Legacy API_V23 permission is stripped from the manifest. Official Shizuku and Nightzuku install side by side.",
  },
  {
    k: "ADB modules",
    v: "ZIP modules with module.prop, action.sh, policy-gated service.sh, local WebUI, size and output limits, run logs.",
  },
  {
    k: "Pinning",
    v: "SHA-256 package and manager certificate pinning, including signingCertificateHistory key rotation on Android 9+.",
  },
  {
    k: "NightDog",
    v: "Watchdog for server health, system service recovery, module integrity checks and privileged updates.",
  },
  {
    k: "Platforms",
    v: "Phone, Wear OS and Android TV. Targets Android 16/17 with Jetpack Compose and Material 3 Expressive.",
  },
];

export const PIPELINE = [
  { id: "APP", sub: "authorized client", note: "receives binder" },
  { id: "NIGHTZUKU", sub: "server · root / adb", note: "proxies + guards" },
  { id: "SYSTEM_SERVER", sub: "android framework", note: "checks uid/pid" },
];

export const DOCS = [
  { t: "ADB Modules guide", h: `${REPO}/blob/main/docs/adb-modules-guide.md` },
  { t: "ADB Modules API", h: `${REPO}/blob/main/docs/adb-modules-api.md` },
  { t: "Connectors API", h: `${REPO}/blob/main/docs/nightzuku-connectors.md` },
  { t: "Android 17", h: `${REPO}/blob/main/docs/android-17-compatibility.md` },
  { t: "Wear OS", h: `${REPO}/blob/main/docs/wearos-compatibility.md` },
  { t: "Android TV", h: `${REPO}/blob/main/docs/android-tv-support.md` },
  { t: "NightDog", h: `${REPO}/blob/main/docs/nightdog.md` },
];

export const TICKER = [
  "TARGET SDK 37",
  "MIN SDK 25",
  "APACHE-2.0",
  "DUAL-WIRE IPC",
  "ZERO-STUB NATIVE PROTOCOL",
  "ADB ZIP MODULES",
  "SHA-256 CERT PINNING",
  "NIGHTDOG WATCHDOG",
  "PHONE / TV / WEAR OS",
  "JETPACK COMPOSE",
  "MATERIAL 3 EXPRESSIVE",
];
