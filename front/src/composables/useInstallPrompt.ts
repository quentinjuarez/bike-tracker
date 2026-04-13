import { ref, watch } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

// ── Platform detection ────────────────────────────────────────────────

// beforeinstallprompt never fires on iOS/Safari — detect so the banner
// can show share-sheet instructions instead of a programmatic install button.
export const isIOS =
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as "MacIntel" but has multiple touch points
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// ── Module-level singleton ────────────────────────────────────────────
// All state and listeners live at module scope so they are never torn
// down by component unmounts. beforeinstallprompt fires at most once —
// a component remounting after the event fires would miss it entirely.

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const canInstall = ref(false);
const isInstalled = ref(
  typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches,
);
const isDismissed = ref(
  typeof localStorage !== 'undefined' && localStorage.getItem(DISMISSED_KEY) === '1',
);
const showBanner = ref(false);

if (typeof window !== 'undefined' && !isInstalled.value) {
  if (isIOS) {
    // iOS: no install event — show instructions after a short delay
    setTimeout(() => {
      if (!isDismissed.value && !isInstalled.value) showBanner.value = true;
    }, 2000);
  } else {
    // Android / Chrome desktop: wait for the browser install prompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      canInstall.value = true;
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt.value = null;
      canInstall.value = false;
      isInstalled.value = true;
      showBanner.value = false;
    });

    watch(canInstall, (ready) => {
      if (ready && !isDismissed.value && !isInstalled.value) {
        setTimeout(() => {
          if (canInstall.value && !isDismissed.value) showBanner.value = true;
        }, 2000);
      }
    });
  }
}

// ── Public composable ─────────────────────────────────────────────────

export function useInstallPrompt() {
  async function triggerInstall() {
    if (!deferredPrompt.value) return;
    await deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    if (outcome === 'accepted') {
      deferredPrompt.value = null;
      canInstall.value = false;
      showBanner.value = false;
    }
  }

  function dismiss() {
    showBanner.value = false;
    isDismissed.value = true;
    localStorage.setItem(DISMISSED_KEY, '1');
  }

  return { showBanner, isIOS, triggerInstall, dismiss };
}
