import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { install } from "vue3-recaptcha-v2";

// createApp(App).mount('#app');
createApp(App).use(install, {
    sitekey: "6Lf-sVQoAAAAAJ0Pnxkv7nSbVJgyKMgzy8x6pD3C",
    cnDomains: false, 
  }).mount('#app');