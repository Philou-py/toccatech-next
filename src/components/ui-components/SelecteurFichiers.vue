<template>
  <div class="sélecteur-fichiers-test">
    <input
      type="file"
      :accept="accepter"
      @change="afficherNomFichier($event.target)"
      :disabled="désactivé"
    />
    <ChampTexte
      :icôneDevant="icôneDevant"
      class="affichage-fichiers"
      label="Sélectionnez un fichier..."
      :valeurInput="fichier"
      :désactivé="désactivé"
      :requis="requis"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import { BusEvénements } from "@/BusEvénements";

export default Vue.extend({
  components: {
    ChampTexte,
    Bouton,
  },

  props: {
    accepter: String,
    invalide: Boolean,
    icôneDevant: String,
    requis: Boolean,
    désactivé: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    élémentFormulaire: true,
    fichier: "",
  }),

  computed: {
    champValide(): boolean {
      return (this.$children[0] as any).champValide;
    },
  },

  methods: {
    afficherNomFichier(inputFichiers: any) {
      if (inputFichiers.value.length > 0) {
        this.fichier = inputFichiers.files[0].name;
        this.$emit("input", inputFichiers.files[0]);
      } else {
        this.fichier = "";
        this.$emit("input", "");
      }
      BusEvénements.$emit("état-validité-à-vérifier");
    },
  },
});
</script>

<style lang="scss">
.sélecteur-fichiers-test {
  position: relative;
  display: flex;

  .affichage-fichiers {
    width: 100%;
  }

  input[type="file"] {
    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    cursor: pointer;
    width: 100%;
    margin: 0;
    padding: 0;
    opacity: 0;

    &:disabled {
      cursor: default;
    }
  }
}
</style>
