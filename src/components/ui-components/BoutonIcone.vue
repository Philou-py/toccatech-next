<template>
  <div class="bouton-icone">
    <button @mousedown="createRipple">
      <span class="material-icons" :style="styleIcone"><slot></slot></span>
    </button>
  </div>
</template>

<style lang="scss">
.bouton-icone {
  button {
    display: flex;
    align-items: center;
    position: relative;
    border: 0;
    border-radius: 50%;
    outline: none;
    padding: 7px;
    background-color: transparent;
    overflow: hidden;
    cursor: pointer;
    transition: background-color 300ms;
    width: 38px;
    height: 38px;
    &:hover {
      background-color: #c19eff;
    }
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    background-color: rgba(8, 8, 8, 0.7);
    transform: scale(0);
    animation: ripple 700ms ease-in-out;
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    styleIcone: String,
    couleurRipple: String,
  },

  methods: {
    createRipple(event: MouseEvent) {
      const button = event.currentTarget as HTMLButtonElement;
      const circle = document.createElement("span");
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
      circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
      circle.style.backgroundColor = this.couleurRipple;
      circle.classList.add("ripple");
      button.appendChild(circle);
    },
  },
});
</script>
