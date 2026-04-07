<template>
  <div class="flex flex-col items-end gap-1.5">
    <!-- Current position pill -->
    <div
      v-if="store.hasPosition"
      class="flex items-center gap-1.5 text-[11px] font-mono text-accent-500 dark:text-accent-400 px-2 py-0.5 rounded-lg bg-white/70 dark:bg-black/40 border border-accent-100 dark:border-accent-800 backdrop-blur-sm"
    >
      <!-- Pulsing dot when GPS is active and not refreshing -->
      <span
        v-if="store.locationMode === 'geo' && !geoLoading"
        class="relative flex h-2 w-2 flex-none"
      >
        <span
          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
        />
        <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
      </span>
      <SpinnerIcon v-else-if="geoLoading" size="sm" />
      {{ store.lat?.toFixed(4) }}, {{ store.lng?.toFixed(4) }}
      <span class="text-accent-300 dark:text-accent-600 ml-0.5">
        {{ store.locationMode === 'geo' ? '(GPS)' : '(manual)' }}
      </span>
    </div>

    <!-- GPS button -->
    <button
      class="flex items-center gap-2 backdrop-blur-sm bg-accent-500/5 dark:bg-black/10 text-accent-600 dark:text-accent-400 text-xs font-medium px-3 py-2 rounded-xl border border-accent-200 dark:border-accent-700 shadow-sm hover:bg-accent-100/60 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="geoLoading"
      @click="locate"
    >
      <SpinnerIcon v-if="geoLoading" size="sm" />
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="w-3.5 h-3.5 flex-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      </svg>
      {{ geoLoading ? t('main.locating') : t('main.locateMe') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useGeolocation } from '../composables/useGeolocation';
import { useProfileStore } from '../stores/profile';
import SpinnerIcon from './SpinnerIcon.vue';

const { t } = useI18n();
const store = useProfileStore();
const { loading: geoLoading, locate } = useGeolocation();
</script>
