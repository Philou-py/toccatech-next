import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import firebase from "firebase/app";
import "firebase/auth";
import VueMq from "vue-mq";
import Meta from "vue-meta";

Vue.config.productionTip = false;

Vue.use(Meta);

// Initialisation de Vue MQ avec des breakpoints personnalisés
// L'objet dans lequel sont stockés les breakpoints contiennent leur
// nom et la largeur maximale de l'écran pour qu'ils soient appliqués.
// Documentation : https://github.com/AlexandreBonaventure/vue-mq
Vue.use(VueMq, {
  breakpoints: {
    xs: 600, // xs < 600px : Petits à grands téléphones
    sm: 960, // 600px < sm < 960px : Petites à grandes tablettes
    md: 1264, // 960px < md < 1264px : Grandes tablettes à petit ordinateur
    lg: 1904, // 1264px < lg < 1904px : Ordinateurs de bureau
    xl: Infinity, // xl > 1904px : Ecrans 4k et ultra-larges
  },
  defaultBreakpoint: "xs",
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
