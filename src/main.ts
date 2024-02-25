import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "./assets/main.css";
import "element-plus/dist/index.css";
import PrimeVue from "primevue/config";

// theme
import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

const pinia = createPinia();
const app = createApp(App);

app.use(PrimeVue);
app.use(router);
app.use(ElementPlus);
app.use(pinia);
app.mount("#app");
