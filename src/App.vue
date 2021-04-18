<template>
  <div id="app">
    <nav>
      <NavBar
        nomIconeNav="menu"
        styleIconeNav="color: white"
        couleurRippleIconeNav="#8765ef"
        centrerTitrePetitsEcran
        cheminAvatar="https://toccatech.com/media/avatars/Philippe_Google_carre.jpg"
      >
        <template v-slot:titre>Toccatech</template>
        <template v-slot:menu-nav>
          <li>
            <router-link :to="{ name: 'Encyclopédie' }">Encyclopédie</router-link>
          </li>
        </template>
      </NavBar>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { auth } from "@/firebase/config";
import NavBar from "@/components/ui-components/NavBar.vue";
// import Carte from "@/components/ui-components/Carte.vue";
// import Container from "@/components/ui-components/Container.vue";
// import Bouton from "@/components/ui-components/Bouton.vue";
// import Espacement from "@/components/ui-components/Espacement.vue";
// import FormulaireInscription from "@/components/layouts/accounts/FormulaireInscription.vue";
// import FormulaireConnexion from "@/components/layouts/accounts/FormulaireConnexion.vue";

export default defineComponent({
  components: {
    NavBar,
    // Carte,
    // Container,
    // Bouton,
    // Espacement,
    // FormulaireInscription,
    // FormulaireConnexion,
  },
  mounted() {
    var user = auth.currentUser;
    if (user) {
      console.log(`Bienvenue, ${user.displayName} !`);
    }
  },
});
</script>

<style lang="scss">
// Import de la famille EB Garamond (grâce au paquet npm fontsource) avec les styles suivants :
//    - Regular 400
//    - Regular 400 italic
//    - Bold 700
//    - Bold 700 italic
// Lien vers le dépôt sur GitHub : https://github.com/fontsource/fontsource/tree/master/packages/eb-garamond
@import "~@fontsource/eb-garamond/400.css"; // Regular 400
// @import "~@fontsource/eb-garamond/400-italic.css"; // Regular 400 italic
@import "~@fontsource/eb-garamond/500.css";
@import "~@fontsource/eb-garamond/600.css";
@import "~@fontsource/eb-garamond/700.css"; // Bold 700
// @import "~@fontsource/eb-garamond/700-italic.css"; // Bold 700 italic

@import "@/assets/styles/colors.scss";
@import "@/assets/styles/typographie.scss";

* {
  font-family: "EB Garamond", serif;
  box-sizing: border-box;
  // Enlever l'arrière-plan bleu lors d'un clic sur un bouton sur mobiles :
  // https://stackoverflow.com/questions/45049873/how-to-remove-the-blue-background-of-button-on-mobile
  -webkit-tap-highlight-color: transparent;
}

html {
  --couleur-primaire: #1867c0;
}

.petit-container {
  margin: 0 20px;
}

.titre-page {
  margin-top: 20px;
  margin-bottom: 20px;
}

.couleur-primaire {
  &--texte {
    color: var(--couleur-primaire);
  }

  &--fond {
    background-color: var(--couleur-primaire);
  }
}

body {
  margin: 0;
}

a {
  color: #0000ee;
}

.centrer-texte {
  text-align: center;
}

.ml,
.mx {
  &-0 {
    margin-left: 0 !important;
  }
  &-1 {
    margin-left: 4px !important;
  }
  &-2 {
    margin-left: 8px !important;
  }
  &-3 {
    margin-left: 12px !important;
  }
  &-4 {
    margin-left: 16px !important;
  }
}
.mr,
.mx {
  &-0 {
    margin-right: 0 !important;
  }
  &-1 {
    margin-right: 4px !important;
  }
  &-2 {
    margin-right: 8px !important;
  }
  &-3 {
    margin-right: 12px !important;
  }
  &-4 {
    margin-right: 16px !important;
  }
}
.mt,
.my {
  &-0 {
    margin-top: 0 !important;
  }
  &-1 {
    margin-top: 4px !important;
  }
  &-2 {
    margin-top: 8px !important;
  }
  &-3 {
    margin-top: 12px !important;
  }
  &-4 {
    margin-top: 16px !important;
  }
  &-auto {
    margin-top: auto !important;
  }
}
.mb,
.my {
  &-0 {
    margin-bottom: 0 !important;
  }
  &-1 {
    margin-bottom: 4px !important;
  }
  &-2 {
    margin-bottom: 8px !important;
  }
  &-3 {
    margin-bottom: 12px !important;
  }
  &-4 {
    margin-bottom: 16px !important;
  }
  &-auto {
    margin-bottom: auto !important;
  }
}
</style>
