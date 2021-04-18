import { createApp, App as Application } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { auth } from "@/firebase/config";
import VueScreen from "vue-screen";

let app: Application;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
      .use(router)
      .use(VueScreen, {
        grid: {
          xs: 600, // xs < 600px : Petits à grands téléphones
          sm: 960, // 600px < sm < 960px : Petites à grandes tablettes
          md: 1264, // 960px < md < 1264px : Grandes tablettes à petit ordinateur
          lg: 1904, // 1264px < lg < 1904px : Ordinateurs de bureau
          xl: Infinity, // xl > 1904px : Ecrans 4k et ultra-larges
        },
      });
    app.mount("#app");
  }
});
