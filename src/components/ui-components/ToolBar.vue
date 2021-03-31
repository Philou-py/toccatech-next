<template>
  <div class="toolbar">
    <Container>
      <div
        class="presentation"
        :class="{
          centrer: ['xs', 'sm'].includes($mq) && centrerTitrePetitsEcran,
        }"
      >
        <!-- Les classes ml-2, mr-4 et my-auto permettent d'ajouter
          de la marge autour du bouton -->
        <BoutonIcone
          :styleIcone="styleIconeNav"
          :couleurRipple="couleurRippleIconeNav"
          v-if="['xs', 'sm'].includes($mq)"
        >
          {{ nomIconeNav }}
        </BoutonIcone>
        <router-link :to="{ name: 'Accueil' }">
          <h2 class="titre">
            <slot name="titre"></slot>
          </h2>
        </router-link>
      </div>
      <ul class="menu-nav" v-if="['md', 'lg', 'xl'].includes($mq)">
        <slot name="menu-nav"></slot>
      </ul>
    </Container>
  </div>
</template>

<style lang="scss">
.toolbar {
  background-color: #ddd;

  .container {
    display: flex;
    height: 50px;
  }

  .presentation {
    display: flex;
    align-items: center;

    .bouton-icone {
      margin: 0 16px 0 8px;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    &.centrer {
      flex-grow: 1;

      .titre {
        text-align: center;
      }

      a {
        margin: 0 auto;
      }
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
import Container from "@/components/ui-components/Container.vue";

export default Vue.extend({
  components: {
    BoutonIcone,
    Container,
  },
  props: {
    nomIconeNav: String,
    styleIconeNav: String,
    couleurRippleIconeNav: String,
    centrerTitrePetitsEcran: Boolean,
  },
});
</script>
