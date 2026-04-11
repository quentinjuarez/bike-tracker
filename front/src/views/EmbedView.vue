<template>
  <div class="relative h-full w-full overflow-hidden bg-black">
    <!-- Missing params error -->
    <div
      v-if="missingParams"
      class="flex h-full items-center justify-center text-sm text-accent-500 dark:text-accent-400"
    >
      Missing required query params:
      <code class="ml-2 font-mono text-accent-500 dark:text-accent-400">?lat=…&lng=…</code>
    </div>

    <template v-else>
      <!-- Loading overlay -->
      <!-- <Transition name="fade">
        <div
          v-if="loading"
          class="fixed inset-0 z-900 bg-black/0 backdrop-blur-sm flex items-center justify-center pointer-events-none"
        >
          <SpinnerIcon size="lg" />
        </div>
      </Transition> -->

      <BikeMap :bikes="bikes" :user-lat="store.lat!" :user-lng="store.lng!" />

      <!-- Minimal error toast -->
      <div
        v-if="error"
        class="fixed bottom-4 left-1/2 z-1000 -translate-x-1/2 rounded-lg border border-red-800 bg-red-900 px-3 py-2 font-mono text-xs text-red-400 shadow-lg"
      >
        {{ error }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import BikeMap from '../components/BikeMap.vue';
import { useBikes } from '../composables/useBikes';
import { applyQueryParams } from '../composables/useQueryParams';
import { useProfileStore } from '../stores/profile';
// import SpinnerIcon from '../components/SpinnerIcon.vue';

const store = useProfileStore();
const missingParams = ref(false);

onMounted(() => {
  // vue-router puts query params in route.fullPath; use window.location.search
  // to read the raw query string (works with both history and hash modes)
  const ok = applyQueryParams(window.location.search);
  if (!ok) missingParams.value = true;
});

// loading,
const { bikes, error } = useBikes({
  proxyBase: import.meta.env.VITE_BACK_URL || 'http://localhost:13001',
});
</script>
