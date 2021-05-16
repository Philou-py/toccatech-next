<template>
  <transition name="toast">
    <div class="snackbar-wrapper" v-if="montrerSnackBar">
      <div
        class="snackbar"
        :class="{
          green: typeSnackBar == 'succès',
          red: typeSnackBar == 'erreur',
        }"
      >
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    montrerSnackBar: Boolean,
    typeSnackBar: String,
  },
  methods: {
    ignorerSnackBar() {
      this.$emit("snackBarIgnoré");
    },
  },
});
</script>

<style lang="scss">
.snackbar-wrapper {
  position: fixed;
  bottom: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  z-index: 10000;
}

.snackbar {
  padding: 12px 15px;
  border-radius: 10px;
  background-color: #2c2c2c;
  color: white;
  box-shadow: 0 3px 5px -1px rgb(0 0 0 / 20%), 0 6px 10px 0 rgb(0 0 0 / 14%),
    0 1px 18px 0 rgb(0 0 0 / 12%);
  text-align: center;
}

.toast-enter {
  opacity: 0;
  transform: translateY(60px);
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.toast-enter-active {
  transition: opacity 500ms ease, transform 500ms ease;
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(60px);
}

.toast-leave-active {
  transition: opacity 500ms ease, transform 500ms ease;
}
</style>
