<template>
  <div id="app">
    <nav>
      <ToolBar
        nomIconeNav="menu"
        styleIconeNav="color: white"
        couleurRippleIconeNav="#8765ef"
        centrerTitrePetitsEcran
        chemin_avatar="https://toccatech.com/media/avatars/Philippe_Google_carre.jpg"
      >
        <template v-slot:titre>Ma Partothèque</template>
        <template v-slot:menu-nav>
          <li>
            <router-link :to="{ name: 'Accueil' }">Ma Partothèque</router-link>
          </li>
          <li><a href="https://toccatech.com/">Contact</a></li>
          <li><a href="https://toccatech.com/">Mon Compte</a></li>
        </template>
      </ToolBar>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ToolBar from "@/components/ui-components/ToolBar.vue";

export default Vue.extend({
  components: {
    ToolBar,
  },
});
</script>

<style lang="scss">
// Import de la famille EB Garamond avec les styles suivants :
//    - Regular 400
//    - Regular 400 italic
//    - Bold 700
//    - Bold 700 italic
// Lien vers ces styles sur Google Fonts : https://fonts.google.com/share?selection.family=EB%20Garamond:ital,wght@0,400;0,700;1,400;1,700
@import url("https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&display=swap");

* {
  font-family: "EB Garamond", serif;
  box-sizing: border-box;
}

body {
  margin: 0;
}

.ml,
.mx {
  &-0 {
    margin-left: 0;
  }
  &-1 {
    margin-left: 4px;
  }
  &-2 {
    margin-left: 8px;
  }
  &-3 {
    margin-left: 12px;
  }
  &-4 {
    margin-left: 16px;
  }
}
.mr,
.mx {
  &-0 {
    margin-right: 0;
  }
  &-1 {
    margin-right: 4px;
  }
  &-2 {
    margin-right: 8px;
  }
  &-3 {
    margin-right: 12px;
  }
  &-4 {
    margin-right: 16px;
  }
}
.mt,
.my {
  &-0 {
    margin-top: 0;
  }
  &-1 {
    margin-top: 4px;
  }
  &-2 {
    margin-top: 8px;
  }
  &-3 {
    margin-top: 12px;
  }
  &-4 {
    margin-top: 16px;
  }
  &-auto {
    margin-top: auto;
  }
}
.mb,
.my {
  &-0 {
    margin-bottom: 0;
  }
  &-1 {
    margin-bottom: 4px;
  }
  &-2 {
    margin-bottom: 8px;
  }
  &-3 {
    margin-bottom: 12px;
  }
  &-4 {
    margin-bottom: 16px;
  }
  &-auto {
    margin-bottom: auto;
  }
}
</style>
