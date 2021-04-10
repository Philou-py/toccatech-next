<template>
  <form>
    <slot></slot>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import { BusEvénements } from "@/BusEvénements";

export default Vue.extend({
  methods: {
    validerFormulaire(): boolean {
      var valide = true;
      // Test de la validité de chaque composant enfant faisant objet à une validation (tous ceux qui possèdent
      // la variable 'élémentFormulaire').
      this.$children.forEach((child) => {
        // Ce commentaire permet d'ignorer l'erreur de TypeScript à cause des
        // propriétés inconnues 'estValide' et 'champRequisVide' sur les composants enfants.
        // @ts-ignore
        if (child.élémentFormulaire && !(child.estValide && !child.champRequisVide)) valide = false;
      });
      this.$emit("input", valide);
      return valide;
    },
  },

  mounted() {
    this.validerFormulaire();
    BusEvénements.$on("état-validité-à-vérifier", this.validerFormulaire);
  },
});
</script>
