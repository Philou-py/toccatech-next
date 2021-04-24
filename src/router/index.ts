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
    path: "/compositeur/:id",
    name: "DétailsCompositeur",
    component: DetailsCompositeur,
    props: true,
  },
  {
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
