<template>
  <div class="border-t border-accent-100 pt-4 text-center dark:border-accent-900">
    <p class="space-x-2 text-[10px] tracking-widest text-accent-400 uppercase dark:text-accent-500">
      <RouterLink
        to="/legal"
        class="underline underline-offset-2 transition-colors hover:text-accent-700 dark:hover:text-accent-300"
      >
        {{ t('footer.legal') }}
      </RouterLink>
      <span>·</span>
      <RouterLink
        to="/privacy"
        class="underline underline-offset-2 transition-colors hover:text-accent-700 dark:hover:text-accent-300"
      >
        {{ t('footer.privacy') }}
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';

const { t } = useI18n();
</script>
