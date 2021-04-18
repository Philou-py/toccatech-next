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
  margin: 2%;
  padding-left: 16px;
  padding-right: 16px;
  color: #666666;

  .titre-carte {
    color: #212121;
    margin-top: 16px;
    margin-bottom: 16px;

    &.centrer {
      text-align: center;
    }
  }

  .contenu-carte {
    margin-top: 0;
    margin-bottom: 8px;
  }

  .actions-carte {
    display: flex;
    align-items: center;
    margin: 0px 16px 16px;

    /* .btn { */
    /*   margin: 0 5px; */
    /* } */
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
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
