<template>
  <div class="fixed top-4 left-4 z-9999 w-72 rounded-xl border border-yellow-500/40 bg-black/90 font-mono text-[10px] text-yellow-300 shadow-2xl backdrop-blur-sm">
    <!-- Header -->
    <div
      class="flex cursor-pointer items-center justify-between border-b border-yellow-500/20 px-3 py-2"
      @click="open = !open"
    >
      <span class="font-bold tracking-widest text-yellow-400 uppercase">⚙ PWA Debug</span>
      <span class="text-yellow-600">{{ open ? '▲' : '▼' }}</span>
    </div>

    <div v-if="open" class="space-y-0.5 px-3 py-2">
      <div v-for="row in rows" :key="row.label" class="flex justify-between gap-1">
        <span class="shrink-0 text-yellow-600">{{ row.label }}</span>
        <span :class="row.ok === undefined ? 'text-yellow-400' : row.ok ? 'text-green-400' : 'text-red-400'">
          {{ row.value }}
        </span>
      </div>

      <div class="mt-2 border-t border-yellow-500/20 pt-2">
        <div class="mb-1 text-yellow-600">userAgent</div>
        <div class="break-all leading-tight text-yellow-500">{{ d.userAgent }}</div>
      </div>

      <div class="mt-2 flex flex-wrap gap-2">
        <button
          class="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300 hover:bg-yellow-500/40"
          @click="resetDismissed"
        >
          Reset dismissed
        </button>
        <button
          class="rounded bg-yellow-500/20 px-2 py-1 text-yellow-300 hover:bg-yellow-500/40"
          @click="refreshSW"
        >
          Check SW
        </button>
        <button
          class="rounded bg-green-500/20 px-2 py-1 text-green-300 hover:bg-green-500/40"
          @click="forceBanner"
        >
          Force banner
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

import { debugInstall, showBanner } from '../composables/useInstallPrompt';
import { useAppStore } from '../stores/app';

const open = ref(true);
const d = debugInstall;
const windowPrompt = computed(() => !!(window as unknown as { __pwaPrompt: unknown }).__pwaPrompt);

const rows = computed(() => {
  const v = d.value;
  return [
    { label: 'HTTPS',             value: v.isHttps ? 'yes' : 'NO ← install blocked',         ok: v.isHttps },
    { label: 'standalone',        value: v.isInstalled ? 'yes (already installed)' : 'no',    ok: !v.isInstalled },
    { label: 'iOS',               value: v.isIOS ? 'yes (share-sheet flow)' : 'no',           ok: undefined },
    { label: 'SW registered',     value: v.swRegistered ? `yes (${v.swState})` : 'NO ← install blocked', ok: v.swRegistered },
    { label: 'prompt fired',      value: v.promptFired ? `yes @ ${v.promptFiredAt?.slice(11, 19)}` : 'NOT YET', ok: v.promptFired },
    { label: 'window.__pwaPrompt',value: windowPrompt.value ? 'captured ✓' : 'null',          ok: windowPrompt.value },
    { label: 'dismissed',         value: v.isDismissed ? 'YES ← banner blocked' : 'no',       ok: !v.isDismissed },
    { label: 'showBanner',        value: String(v.showBanner),                                 ok: v.showBanner },
    { label: 'appInstalled',      value: String(v.appInstalled),                               ok: undefined },
  ];
});

function resetDismissed() {
  useAppStore().installDismissed = false;
  d.value.isDismissed = false;
}

async function refreshSW() {
  const reg = await navigator.serviceWorker?.getRegistration();
  d.value.swRegistered = !!reg;
  d.value.swState =
    reg?.active?.state ?? reg?.installing?.state ?? reg?.waiting?.state ?? 'none';
}

function forceBanner() {
  showBanner.value = true;
  d.value.showBanner = true;
}
</script>
