<template>
  <transition name="transition-arrière-plan">
    <div class="arrière-plan" v-show="montrerModal" @click.self="fermerModal">
      <transition name="transition-modal">
        <div v-show="montrerContenuModal">
          <slot></slot>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss">
.arrière-plan {
  top: 0;
  position: fixed;
  background: rgba(#000, 0.5);
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

// Transition de l'arrière plan
.transition-arrière-plan-enter,
.transition-arrière-plan-leave-to {
  opacity: 0;
}

.transition-arrière-plan-enter-to,
.transition-arrière-plan-leave {
  opacity: 1;
}

.transition-arrière-plan-enter-active,
.transition-arrière-plan-leave-active {
  transition: all 0.3s ease;
}

// Transition du modal
.transition-modal-enter,
.transition-modal-leave-to {
  transform: scale(0);
}
.transition-modal-enter-to,
.transition-modal-leave {
  transform: scale(1);
}
.transition-modal-enter-active,
.transition-modal-leave-active {
  transition: transform 0.3s ease;
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    montrerModal: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    montrerContenuModal: false,
  }),

  watch: {
    montrerModal() {
      this.montrerContenuModal = this.montrerModal;
    },
  },

  methods: {
    fermerModal() {
      this.montrerContenuModal = false;
      /* setTimeout(() => { */
        this.$emit("fermetureModal");
      /* }, 300); */
    },
  },
});
</script>
