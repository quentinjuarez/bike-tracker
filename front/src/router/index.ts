import { createRouter, createWebHistory } from 'vue-router';

import EmbedView from '../views/EmbedView.vue';
import MainView from '../views/MainView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainView,
    },
    {
      path: '/embed',
      component: EmbedView,
      meta: { embed: true },
    },
    {
      path: '/legal',
      component: () => import('../views/LegalNotice.vue'),
      meta: { title: 'Mentions légales & CGU' },
    },
    {
      path: '/privacy',
      component: () => import('../views/PrivacyPolicy.vue'),
      meta: { title: 'Politique de confidentialité' },
    },
  ],
});

export default router;
