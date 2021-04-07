<template>
  <button @mousedown="createRipple" class="btn" :class="{ texte: texte }">
    <div class="texte-bouton">
      <slot></slot>
    </div>
  </button>
</template>

<style lang="scss">
button.btn {
  display: inline-block;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 500;
  text-transform: uppercase;
  outline: none;
  border: 0;
  border-radius: 0.25rem;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  cursor: pointer;
  overflow: hidden;
  height: 36px;
  min-width: 64px;
  position: relative;
  transition: all 300ms;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    background-color: rgba(black, 0.1);
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 700ms ease-in-out;
    background-color: rgba(black, 0.3);
  }

  &.texte {
    background-color: transparent;
    box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
      0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
    color: rgba(0, 0, 0, 0.87);

    &:hover {
      background-color: rgba(black, 0.1);
    }

    span.ripple {
      background-color: rgba(black, 0.3);
    }
  }
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    couleur: String,
    couleurRipple: String,
    texte: Boolean,
  },

  methods: {
    createRipple(event: MouseEvent) {
      const bouton = event.currentTarget as HTMLButtonElement;
      const cercle = document.createElement("span");
      const diamètre = Math.max(bouton.clientWidth, bouton.clientHeight);
      const rayon = diamètre / 2;
      cercle.style.width = cercle.style.height = `${diamètre}px`;
      cercle.style.left = `${event.clientX - bouton.offsetLeft - rayon}px`;
      cercle.style.top = `${event.clientY - bouton.offsetTop - rayon}px`;
      cercle.style.backgroundColor = this.couleurRipple;
      cercle.classList.add("ripple");
      bouton.appendChild(cercle);
    },
  },
});
</script>
