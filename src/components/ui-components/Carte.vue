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
  min-width: var(--largeur-min);
  overflow: hidden;
  font-size: 18px;

  .titre-carte {
    color: #212121;
    margin: 0;
    padding: 16px;
    font-size: 2.5em;
  }

  .contenu-carte {
    color: #666666;
    padding: 0 16px 8px;
    margin: 0;
    text-align: justify;
  }

  .actions-carte {
    display: flex;
    padding: 0px 16px 16px;

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
    largeurMin: Number,
  },
  computed: {
    variablesCSS(): object {
      return {
        "--largeur": this.largeur ? this.largeur + "px" : undefined,
        "--largeur-max": this.largeurMax ? this.largeurMax + "px" : undefined,
        "--largeur-min": this.largeurMin ? this.largeurMin + "px" : undefined,
      };
    },
  },
});
</script>
