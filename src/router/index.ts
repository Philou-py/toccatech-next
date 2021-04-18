import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteLocationRaw,
  RouteLocationNormalized,
} from "vue-router";
import Accueil from "@/views/Accueil.vue";
import Encyclopedie from "@/views/Encyclopedie.vue";
import DetailsCompositeur from "@/views/DetailsCompositeur.vue";
import ModifierInfosCompositeur from "@/views/ModifierInfosCompositeur.vue";
import NonTrouve from "@/views/NonTrouve.vue";
import { auth } from "@/firebase/config";

const exigerAuth = (vers: RouteLocationNormalized, de: RouteLocationNormalized) => {
  let utilisateur = auth.currentUser;
  if (!utilisateur) {
    let prochaineRoute: RouteLocationRaw = { name: "Accueil" };
    return prochaineRoute;
  }
  return true;
};

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Accueil",
    component: Accueil,
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
    beforeEnter: exigerAuth,
  },
  {
    path: "/nouveau-compositeur",
    name: "NouveauCompositeur",
    component: ModifierInfosCompositeur,
  },
  {
    path: "/:catchAll(.*)",
    name: "NonTrouvé",
    component: NonTrouve,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
