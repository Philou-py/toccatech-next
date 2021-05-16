<template>
  <div class="sélecteur-fichiers">
    <input
      type="file"
      :accept="accepter"
      @change="afficherNomFichier($event.target)"
      :disabled="désactivé"
    />
    <ChampTexte
      :icôneDevant="icôneDevant"
      class="affichage-fichiers"
      :label="label"
      :valeurInput="fichier"
      :désactivé="désactivé"
      :requis="requis"
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import { BusEvénements } from "@/BusEvénements";

export default Vue.extend({
  components: {
    ChampTexte,
  },

  props: {
    label: String,
    accepter: String,
    invalide: Boolean,
    icôneDevant: String,
    requis: {
      type: Boolean,
      default: false,
    },
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
    champRequisVide(): boolean {
      return this.requis && !this.fichier;
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
.sélecteur-fichiers {
  position: relative;
  display: flex;
  width: 100%;

  .affichage-fichiers {
    width: 100%;
  }

  input[type="file"] {
    position: absolute;
    z-index: 99;
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
