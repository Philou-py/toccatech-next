import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Accueil from "@/views/Accueil.vue";
import Encyclopedie from "@/views/Encyclopedie.vue";
import DetailsCompositeur from "@/views/DetailsCompositeur.vue";
import ModifierInfosCompositeur from "@/views/ModifierInfosCompositeur.vue";
import NonTrouve from "@/views/NonTrouve.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
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

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
