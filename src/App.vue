<template>
  <div id="app">
    <nav>
      <NavBar
        nomIconeNav="menu"
        styleIconeNav="color: var(--couleur-fg-icone-nav)"
        couleurRippleIconeNav="var(--couleur-ripple-icone-nav)"
        centrerTitrePetitsEcran
        cheminAvatar="https://toccatech.com/media/avatars/Philippe_Google_carre.jpg"
        class="barre-navigation"
      >
        <template v-slot:logo>
          <img src="@/assets/logo.png" alt="Logo Toccatech" />
        </template>
        <template v-slot:titre>Toccatech</template>
        <template v-slot:menu-nav>
          <li>
            <router-link :to="{ name: 'Encyclopédie' }">Encyclopédie</router-link>
          </li>
          <li v-if="estConnecté">
            <router-link :to="{ name: 'MaPartothèque' }">Ma Partothèque</router-link>
          </li>
          <li v-if="estConnecté">
            <a @click="déconnexion()"> Déconnexion </a>
          </li>
          <li v-if="!estConnecté" title="Connectez-vous pour accéder à votre partothèque !">
            <a class="désactivé">Ma Partothèque</a>
          </li>
          <li v-if="!estConnecté">
            <a @click="montrerModalConnexionInscription = !montrerModalConnexionInscription">
              Connexion / Inscription
            </a>
          </li>
        </template>
      </NavBar>
    </nav>
    <Modal
      v-if="montrerModalConnexionInscription"
      @fermetureModal="montrerModalConnexionInscription = !montrerModalConnexionInscription"
    >
      <div
        :is="composantConnexionInscription"
        :changerComposant="basculerComposant"
        @connexionInscriptionRéussie="
          (message) => {
            validerConnexionInscription(message);
          }
        "
      ></div>
    </Modal>
    <div class="contenu-app">
      <router-view />
      <BarreMessages :montrerSnackBar="montrerSnackBar">{{ texteSnackBar }}</BarreMessages>
    </div>
    <footer :class="$mq">
      <p>Réalisé par Philippe Schoenhenz — Avril 2021</p>
      <p>
        Ce site est open-source ! Son code source est disponible sur
        <a href="https://github.com/Philou-py/toccatech-next" target="_blank">GitHub</a>.
      </p>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/firebase";
import NavBar from "@/components/ui-components/NavBar.vue";
import Carte from "@/components/ui-components/Carte.vue";
import Container from "@/components/ui-components/Container.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";
import Modal from "@/components/ui-components/Modal.vue";
import BarreMessages from "@/components/ui-components/BarreMessages.vue";
import FormulaireInscription from "@/components/layouts/accounts/FormulaireInscription.vue";
import FormulaireConnexion from "@/components/layouts/accounts/FormulaireConnexion.vue";

export default Vue.extend({
  components: {
    NavBar,
    Carte,
    Container,
    Bouton,
    Espacement,
    Modal,
    FormulaireInscription,
    FormulaireConnexion,
    BarreMessages,
  },

  data: () => ({
    estConnecté: true,
    montrerModalConnexionInscription: false,
    composantConnexionInscription: "FormulaireConnexion",
    texteSnackBar: "",
    montrerSnackBar: false,
    enleverEcouteurAuth: () => {},
  }),

  methods: {
    basculerComposant(composant: any) {
      this.composantConnexionInscription = composant;
    },

    déconnexion() {
      auth
        .signOut()
        .then(() => {
          this.texteSnackBar = "Vous êtes à présent déconnecté !";
          this.montrerSnackBar = true;
          setTimeout(() => {
            this.montrerSnackBar = false;
          }, 4000);
        })
        .catch((erreur) => {
          console.log(erreur);
        });
    },

    validerConnexionInscription(message: string) {
      console.log(message);
      this.montrerModalConnexionInscription = false;
      this.texteSnackBar = message;
      this.montrerSnackBar = true;
      setTimeout(() => {
        this.montrerSnackBar = false;
      }, 4000);
    },
  },

  mounted() {
    this.enleverEcouteurAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(`Bienvenue, ${user.displayName} !`);
        this.estConnecté = true;
      } else {
        this.estConnecté = false;
      }
    });
  },

  destroyed() {
    this.enleverEcouteurAuth();
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
  // --toccatech-theme-primaire: #1867c0;
  // --toccatech-theme-secondaire: #1867c0;
  --couleur-ripple-icone-nav: #343148;
  --couleur-fg-icone-nav: white;
  --couleur-bg-hover-bouton-icone-nav: #755139;
  --couleur-bg-hover-item-menu-nav: #755139;
  --couleur-fg-titre-page-accueil: #black; //615550
  --couleur-fg-icones-description-page-accueil: #795548;
  --couleur-bg-navbar: #9e1030;
  --couleur-bg-app: #fde8ed;
  --couleur-bg-footer: #d69c2f;
  --couleur-ripple-icone-telecharger-partotheque: #ffe5e5;
  --couleur-fg-nom-site: white;

  scroll-behavior: smooth;
}

#app {
  background-color: var(--couleur-bg-app);
}

.titre-page {
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  margin: 0;
}

a {
  color: #0000ee;
}

.lien {
  text-decoration: underline solid;
  cursor: pointer;
}

.centrer-texte {
  text-align: center;
}

.contenu-app {
  margin-top: 60px;
}

.barre-navigation {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;
  box-shadow: 0 2px 4px 0 darkgrey;
}

footer {
  background-color: var(--couleur-bg-footer);
  padding: 10px 0;
  text-align: center;
  color: white;
  display: flex;
  justify-content: space-between;

  p {
    margin-left: 5%;
    margin-right: 5%;
  }

  &.xs,
  &.sm {
    flex-direction: column;
  }
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
