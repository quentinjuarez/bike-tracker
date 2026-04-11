<template>
  <RouterView />
  <InstallBanner />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';

import InstallBanner from './components/InstallBanner.vue';
import { useTheme } from './composables/useTheme';

useTheme();
</script>
