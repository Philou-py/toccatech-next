import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseInit } from "@/firebase-init";
import { firestorePlugin } from "vuefire";
import VueScreen from "vue-screen";

Vue.config.productionTip = false;

// Appel de la fonction d'initialisation de Firebase
// importée du fichier "firebase-init.ts"
firebaseInit();

// Initialisation de VueFire
// Documentation : https://vuefire.vuejs.org/
Vue.use(firestorePlugin);

// Initialisation de VueScreen avec des breakpoints personnalisés
// L'objet dans lequel sont stockés les breakpoints contiennent leur
// nom et la largeur minimale de l'écran pour qu'ils soient appliqués.
// Documentation : https://github.com/reegodev/vue-screen/tree/v1.5.3#vuescreen
Vue.use(VueScreen, {
  xs: 0, // xs < 600px : Petits à grands téléphones
  sm: 600, // 600px < sm < 960px : Petites à grandes tablettes
  md: 960, // 960px < md < 1264px : Grandes tablettes à petit ordinateur
  lg: 1264, // 1264px < lg < 1904px : Ordinateurs de bureau
  xl: 1904, // xl 1904px : Ecrans 4k et ultra-larges
});

let app: Vue;

// Instantiation de la classe Vue seulement quand Firebase est initialisé grâce à
// l'observateur onAuthStateChanged;
// Citation de la documentation Firebase:
// En utilisant un observateur, vous vous assurez que l'objet Auth n'est pas dans un
// état intermédiaire (comme l'initialisation) lorsque vous obtenez l'utilisateur actuel.
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
  }
});
