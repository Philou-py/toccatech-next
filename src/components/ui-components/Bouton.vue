<template>
  <button
    @mousedown="createRipple($event)"
    @click="émettreClicBouton()"
    :class="{ texte: texte, désactivé: désactivé, grand: grand }"
    :disabled="désactivé"
    :title="titre"
    class="btn"
    id="btn"
  >
    <slot></slot>
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

  &.grand {
    height: 55px;
    padding: 0 34px;
    min-width: 94px;
    font-size: 1.1em;
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 700ms ease-in-out;
    background-color: rgba(black, 0.3);
  }

  &.texte {
    /* box-shadow: 0 2px 1px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14),
       0 1px 3px 0 rgba(0, 0, 0, 0.12) !important; */
    box-shadow: none;

    &:hover {
      background-color: rgba(black, 0.1);
    }

    span.ripple {
      background-color: rgba(black, 0.3);
    }
  }

  // Ajouter le sélecteur #btn permet que ce style l'emporte sur l'ajout d'une potentielle classe
  // de couleur par le composant parent, car le sélecteur id a une plus haute priorité qu'une classe.
  &.désactivé#btn {
    background-color: rgba(black, 0.12) !important;
    color: rgba(black, 0.26) !important;
    cursor: not-allowed !important;
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
    couleurRipple: {
      type: String,
      default: "white",
    },
    texte: Boolean,
    désactivé: Boolean,
    titre: String,
    grand: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    émettreClicBouton() {
      this.$emit("click");
    },
    createRipple(event: MouseEvent) {
      const bouton = event.currentTarget as HTMLButtonElement;
      const cercle = document.createElement("span");
      const diamètre = Math.max(bouton.clientWidth, bouton.clientHeight);
      const rayon = diamètre / 2;
      cercle.style.width = cercle.style.height = `${diamètre}px`;
      /* cercle.style.left = `${event.clientX - rayon}px`; */
      /* cercle.style.top = `${event.clientY - rayon}px`; */
      cercle.style.left = `${
        event.pageX - bouton.getBoundingClientRect().left - rayon - window.pageXOffset
      }px`;
      cercle.style.top = `${
        event.pageY - bouton.getBoundingClientRect().top - rayon - window.pageYOffset
      }px`;
      cercle.style.backgroundColor = this.couleurRipple;
      cercle.classList.add("ripple");
      bouton.appendChild(cercle);
    },
  },
});
</script>
