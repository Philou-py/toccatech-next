<template>
  <div class="accueil petit-container">
    <div class="connexion-inscription" :class="$mq">
      <FormulaireInscription />
      <FormulaireConnexion />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FormulaireConnexion from "@/components/layouts/accounts/FormulaireConnexion.vue";
import FormulaireInscription from "@/components/layouts/accounts/FormulaireInscription.vue";

export default Vue.extend({
  components: {
    FormulaireConnexion,
    FormulaireInscription,
  },
});
</script>

<style lang="scss">
.connexion-inscription {
  display: flex;

  &.xs,
  &.sm {
    flex-direction: column;

    & > div {
      width: 100%;
    }
  }

  &.md,
  &.lg,
  &.xl {
    & > div {
      flex-grow: 1;
      width: 50%;
    }
  }
}
</style>
