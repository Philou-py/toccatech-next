<template>
  <div class="formulaire">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { BusEvénements } from "@/BusEvénements";

export default defineComponent({
  methods: {
    validerFormulaire(): boolean {
      var valide = true;
      // Test de la validité de chaque composant enfant faisant objet à une validation (tous ceux qui possèdent
      // la variable 'élémentFormulaire').
      // this.$children.forEach((child) => {
      //   // Ce commentaire permet d'ignorer l'erreur de TypeScript à cause des
      //   // propriétés inconnues 'champValide' et 'champRequisVide' sur les composants enfants.
      //   // @ts-ignore
      //   if (!(child.élémentFormulaire && child.champValide && !child.champRequisVide)) {
      //     valide = false;
      //   }
      // });
      // this.$emit("input", valide);
      return valide;
    },
  },

  mounted() {
    this.validerFormulaire();
    // BusEvénements.$on("état-validité-à-vérifier", this.validerFormulaire);
  },
});
</script>
