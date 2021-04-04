<template>
  <button @mousedown="createRipple" class="btn" :style="couleurBouton">
    <slot></slot>
  </button>
</template>

<style lang="scss">
button.btn {
  background-color: teal;
  padding: 0 28px;
  font-size: 15px;
  line-height: 54px;
  text-transform: uppercase;
  outline: none;
  border: 0;
  color: white;
  border-radius: 0.25rem;
  // box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
  cursor: pointer;
  overflow: hidden;
  max-width: 100%;
  position: relative;
  border: 2px solid teal;
  transition: all 300ms;
}

button.btn:hover {
  box-shadow: 0 0 0 1px white inset;
}

span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 700ms ease-in-out;
  background-color: rgba(255, 255, 255, 0.7);
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
    couleurBouton: String,
    couleurRipple: String,
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
