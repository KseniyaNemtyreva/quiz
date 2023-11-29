import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { install } from "vue3-recaptcha-v2";

// createApp(App).mount('#app');
createApp(App).use(install, {
    sitekey: "6LftFSApAAAAAB20MGlaPHWyzgLidQlHCtHxRFJC",
    cnDomains: false, 
  }).mount('#app');