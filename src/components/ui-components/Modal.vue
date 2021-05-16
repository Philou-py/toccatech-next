<template>
  <div class="modal">
    <transition name="transition-bg-modal">
      <div class="arrière-plan" v-show="montrerModal" @click.self="fermerModal">
        <transition name="transition-modal">
          <div v-if="montrerModal">
            <slot></slot>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.modal {
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

  // Transition de l arrière plan
  // En savoir plus sur les transitions Vue : https://fr.vuejs.org/v2/guide/transitions.html
  .transition-bg-modal-enter,
  .transition-bg-modal-leave-to {
    opacity: 0;
  }

  .transition-bg-modal-enter-to,
  .transition-bg-modal-leave {
    opacity: 1;
  }

  .transition-bg-modal-enter-active,
  .transition-bg-modal-leave-active {
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

  methods: {
    fermerModal() {
      this.$emit("fermetureModal");
    },
  },
});
</script>
