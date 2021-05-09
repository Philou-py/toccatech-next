import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import { auth } from "@/firebase";
import Accueil from "@/views/Accueil.vue";
import Encyclopedie from "@/views/Encyclopedie.vue";
import DetailsCompositeur from "@/views/DetailsCompositeur.vue";
import ModifierInfosCompositeur from "@/views/ModifierInfosCompositeur.vue";
import NonTrouve from "@/views/NonTrouve.vue";
import MaPartotheque from "@/views/MaPartotheque.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Accueil",
    component: Accueil,
  },
  {
    path: "/ma-partotheque",
    name: "MaPartothèque",
    component: MaPartotheque,
    // Cette méta donnée permet de protéger la route et indiquer qu'elle requiert l'authentification.
    // Elle est exploitée grâce au 'route gard' défini plus bas.
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/encyclopedie",
    name: "Encyclopédie",
    component: Encyclopedie,
  },
  {
    // Utilisation d'un paramètre d'url (id). Ce paramètre peut contenir n'importe quelle chaîne de caractères. C'est pourquoi une validation de l'id est nécessaire dans les composants l'exploitant.
    path: "/compositeur/:id",
    name: "DétailsCompositeur",
    component: DetailsCompositeur,
    // Cette propriété indique à Vue Router que le paramètre de l'url 'id' doit être passé comme 'prop' au composant 'DetailsCompositeur'.
    props: true,
  },
  {
    // Le même paramètre d'url - mais avec le suffixe '/modifier'
    path: "/compositeur/:id/modifier",
    name: "ModifierInfosCompositeur",
    component: ModifierInfosCompositeur,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/nouveau-compositeur",
    name: "NouveauCompositeur",
    component: ModifierInfosCompositeur,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // Toute url ne correspondant à aucune des routes définies ci-dessus est redirigée vers le composant 'NonTrouve'.
    path: "/:catchAll(.*)",
    name: "NonTrouvé",
    component: NonTrouve,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Ceci est un 'route gard' : la fonction passée en paramètre est exécutée avant chaque changement de page
// et empêche ainsi la navigation sur des pages protégées pour les utilisateurs non connectés.
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (requiresAuth && !currentUser) {
    // next({ name: "Accueil", query: { suivant: to.name } });
    next({ name: "Accueil" });
  } else {
    next();
  }
});

export default router;
