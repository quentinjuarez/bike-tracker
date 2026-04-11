import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import './style.css';
import App from './App.vue';
import { i18n } from './i18n';
import router from './router/index';

const pinia = createPinia();
pinia.use(piniaPersistedstate);

createApp(App).use(pinia).use(router).use(i18n).mount('#app');
