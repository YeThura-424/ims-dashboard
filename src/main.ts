import "./assets/main.css";
// import "./assets/style/index.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import PrimeVue from "primevue/config";
//theme
import "primevue/resources/themes/lara-light-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(PrimeVue);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
