import { ref, onMounted, onUnmounted, watch } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-install-dismissed';

export function useInstallPrompt() {
  const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
  const canInstall = ref(false);
  const isInstalled = ref(false);
  const isDismissed = ref(
    typeof localStorage !== 'undefined' && localStorage.getItem(DISMISSED_KEY) === '1',
  );
  const showBanner = ref(false);

  function handleBeforeInstall(e: Event) {
    e.preventDefault();
    deferredPrompt.value = e as BeforeInstallPromptEvent;
    canInstall.value = true;
  }

  function handleAppInstalled() {
    deferredPrompt.value = null;
    canInstall.value = false;
    isInstalled.value = true;
    showBanner.value = false;
  }

  // Show banner 2s after the install prompt is available
  watch(canInstall, (ready) => {
    if (ready && !isDismissed.value && !isInstalled.value) {
      setTimeout(() => {
        if (canInstall.value && !isDismissed.value) showBanner.value = true;
      }, 2000);
    }
  });

  onMounted(() => {
    // Already running as a standalone PWA — nothing to show
    if (window.matchMedia('(display-mode: standalone)').matches) {
      isInstalled.value = true;
      return;
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
  });

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    window.removeEventListener('appinstalled', handleAppInstalled);
  });

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

  return {
    canInstall,
    isInstalled,
    isDismissed,
    showBanner,
    triggerInstall,
    dismiss,
  };
}
