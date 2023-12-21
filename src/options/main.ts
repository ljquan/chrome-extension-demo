import { createApp } from 'vue';
import '../style.css';
import App from './App.vue';
import watchChange from '@/utils/watchChange';

createApp(App).mount('#app');


watchChange('options');
