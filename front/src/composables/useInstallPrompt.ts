import { ref } from 'vue';

import { useAppStore } from '../stores/app';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    __pwaPrompt: BeforeInstallPromptEvent | null;
  }
}

// ── Platform detection ────────────────────────────────────────────────

export const isIOS =
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export const isInstalled =
  typeof window !== 'undefined' &&
  window.matchMedia('(display-mode: standalone)').matches;

// ── Helpers ───────────────────────────────────────────────────────────

function readInstallDismissed(): boolean {
  try {
    const raw = localStorage.getItem('bike-tracker:app');
    if (raw) return JSON.parse(raw)?.installDismissed === true;
  } catch {}
  return false;
}

// ── Reactive state ────────────────────────────────────────────────────

export const showBanner = ref(false);

export const debugInstall = ref({
  isIOS,
  isInstalled,
  isHttps: typeof window !== 'undefined' && location.protocol === 'https:',
  promptFired: false,
  promptFiredAt: null as string | null,
  hasDeferredPrompt: false,
  appInstalled: false,
  isDismissed: readInstallDismissed(),
  showBanner: false,
  swRegistered: false,
  swState: 'unknown' as string,
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
});

// ── Banner logic ──────────────────────────────────────────────────────

function syncDebug() {
  debugInstall.value.hasDeferredPrompt = !!window.__pwaPrompt;
  debugInstall.value.isDismissed = readInstallDismissed();
  debugInstall.value.showBanner = showBanner.value;
}

function tryShowBanner() {
  const dismissed = readInstallDismissed();
  debugInstall.value.isDismissed = dismissed;

  if (dismissed) return;

  showBanner.value = true;
  debugInstall.value.showBanner = true;
}

function onPromptCaptured() {
  debugInstall.value.promptFired = true;
  debugInstall.value.promptFiredAt = new Date().toISOString();
  debugInstall.value.hasDeferredPrompt = true;
  // Small delay so the page has settled before we pop the banner
  setTimeout(tryShowBanner, 1000);
}

// ── Module init ───────────────────────────────────────────────────────

if (typeof window !== 'undefined' && !isInstalled) {
  // SW state
  navigator.serviceWorker?.getRegistration().then((reg) => {
    debugInstall.value.swRegistered = !!reg;
    debugInstall.value.swState =
      reg?.active?.state ?? reg?.installing?.state ?? reg?.waiting?.state ?? 'none';
  });

  if (isIOS) {
    // iOS has no install prompt — show instructions banner after a delay
    setTimeout(() => {
      debugInstall.value.isDismissed = readInstallDismissed();
      if (!readInstallDismissed()) {
        showBanner.value = true;
        debugInstall.value.showBanner = true;
      }
    }, 2000);
  } else {
    // The inline script in index.html captures beforeinstallprompt into window.__pwaPrompt
    // before any module executes. Check if it was already captured.
    if (window.__pwaPrompt) {
      onPromptCaptured();
    }

    // Also handle the case where the event fires after this module loads
    window.addEventListener('pwa:ready', onPromptCaptured);

    window.addEventListener('pwa:installed', () => {
      window.__pwaPrompt = null;
      showBanner.value = false;
      debugInstall.value.appInstalled = true;
      debugInstall.value.hasDeferredPrompt = false;
      debugInstall.value.showBanner = false;
    });
  }
}

// ── Public composable ─────────────────────────────────────────────────

export function useInstallPrompt() {
  async function triggerInstall() {
    const prompt = window.__pwaPrompt;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') {
      window.__pwaPrompt = null;
      showBanner.value = false;
      syncDebug();
    }
  }

  function dismiss() {
    showBanner.value = false;
    debugInstall.value.showBanner = false;
    useAppStore().installDismissed = true;
  }

  return { showBanner, isIOS, triggerInstall, dismiss };
}
