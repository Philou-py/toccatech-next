<template>
  <div class="arrière-plan" @click.self="fermerModal">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.arrière-plan {
  top: 0;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  methods: {
    fermerModal() {
      this.$emit("fermetureModal");
    },
  },
});
</script>
