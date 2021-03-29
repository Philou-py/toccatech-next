<template>
  <div class="toolbar">
    <div class="presentation">
      <!-- Les classes ml-2, mr-4 et my-auto permettent d'ajouter
      de la marge autour du bouton -->
      <BoutonIcone
        :styleIcone="styleIconeNav"
        :couleurRipple="couleurRippleIconeNav"
        class="ml-2 mr-4 my-auto"
      >
        {{ nomIconeNav }}
      </BoutonIcone>
      <router-link :to="{ name: 'Accueil' }">
        <h2 class="titre"><slot name="titre"></slot></h2>
      </router-link>
    </div>
    <ul class="menu-nav">
      <slot name="menu-nav"></slot>
    </ul>
  </div>
</template>

<style lang="scss">
.toolbar {
  display: flex;
  background-color: #ddd;
  height: 50px;
  /* padding: 0 10%; */

  .presentation {
    display: flex;

    a {
      text-decoration: none;
      color: inherit;
      margin: auto 0;
    }
  }

  .titre {
    margin: 0;
    margin: auto 0;
  }

  ul.menu-nav {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-grow: 1;
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      height: 100%;
    }

    a {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 15px;
      text-decoration: none;
      text-align: center;
      color: black;
      transition: background-color 400ms;
      &:hover {
        background-color: deepskyblue;
      }
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import BoutonIcone from "@/components/ui-components/BoutonIcone.vue";

export default Vue.extend({
  components: {
    BoutonIcone,
  },
  props: {
    nomIconeNav: String,
    styleIconeNav: String,
    couleurRippleIconeNav: String,
  },
});
</script>
