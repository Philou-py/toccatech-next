<template>
  <div class="carte" :style="variablesCSS">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.carte {
  border-radius: 4px;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%),
    0px 1px 5px 0px rgb(0 0 0 / 12%);
  width: var(--largeur);
  max-width: var(--largeur-max);
  overflow: hidden;

  .titre-carte {
    color: #212121;
    margin: 0;
    padding: 16px;
  }

  .contenu-carte {
    color: #666666;
    padding: 0 16px 16px;
    margin: 0;
    text-align: justify;
  }

  .actions {
    display: flex;
    padding: 8px 16px;

    .btn {
      margin: 0 5px;
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    largeur: Number,
    largeurMax: Number,
  },
  computed: {
    variablesCSS(): object {
      return {
        "--largeur": this.largeur ? this.largeur + "px" : undefined,
        "--largeur-max": this.largeurMax ? this.largeurMax + "px" : undefined,
      };
    },
  },
});
</script>
