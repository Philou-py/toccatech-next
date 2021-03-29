import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import firebase from "firebase/app";
import "firebase/auth";
import { firebaseInit } from "@/firebase-init";
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false;

// Appel de la fonction d'initialisation de Firestore
// importée du fichier "firebase-init.ts"
firebaseInit();

// Initialisation de VueFire
Vue.use(firestorePlugin);

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
