<template>
  <!-- Ce 'div' contient toute l'application -->
  <div id="app">
    <nav>
      <NavBar
        nomIconeNav="menu"
        styleIconeNav="color: white"
        couleurRippleIconeNav="#343148"
        centrerTitrePetitsEcran
        :cheminAvatar="avatarUtilisateur"
        class="barre-navigation"
      >
        <template v-slot:logo>
          <!-- Le symbole '@' est un alias du dossier 'src' -->
          <img src="@/assets/logo.png" alt="Logo Toccatech" />
        </template>
        <template v-slot:titre>Toccatech</template>
        <template v-slot:menu-nav>
          <li>
            <router-link :to="{ name: 'Encyclopédie' }">Encyclopédie</router-link>
          </li>
          <!-- Le lien vers la page 'Ma Partothèque' n'est affiché que si l'utilisateur est connecté -->
          <li v-if="estConnecté">
            <router-link :to="{ name: 'MaPartothèque' }">Ma Partothèque</router-link>
          </li>
          <li v-if="!estConnecté" title="Connectez-vous pour accéder à votre partothèque !">
            <a class="désactivé"> Ma Partothèque </a>
          </li>

          <!-- Le bouton de déconnexion n'est affiché que si l'utilisateur est connecté -->
          <li v-if="estConnecté">
            <a @click="déconnexion()">Déconnexion</a>
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
      :montrerModal="montrerModalConnexionInscription"
      @fermetureModal="montrerModalConnexionInscription = !montrerModalConnexionInscription"
    >
      <div
        :is="composantConnexionInscription"
        :changerComposant="basculerComposant"
        @messageConnexionInscription="
          (message) => {
            afficherMessageConnexionInscription(message);
          }
        "
      ></div>
    </Modal>
    <div>
      <div class="contenu-app">
        <!-- La propriété 'mode' avec la valeur 'out-in' permet d'indiquer à la transition d'effectuer 
        d'abord la transition de sortie de la route actuelle, puis celle d'entrée de la nouvelle route
        (et non les deux en même temps, ce qui est le comportement par défaut) -->
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
        <BarreMessages :montrerSnackBar="montrerSnackBar" :typeSnackBar="typeSnackBar">
          {{ texteSnackBar }}
        </BarreMessages>
      </div>
      <footer :class="$mq">
        <p>Réalisé par Philippe Schoenhenz — Avril 2021</p>
        <p>
          Ce site est open-source ! Son code est disponible sur
          <a href="https://github.com/Philou-py/toccatech-next" rel="noopener" target="_blank"
            >GitHub</a
          >.
        </p>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
// Le symbole '@' est un alias du dossier 'src'
import { auth, db } from "@/firebase";
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
    avatarUtilisateur: "",
    enleverEcouteurAvatar: () => {},
    montrerModalConnexionInscription: false,
    composantConnexionInscription: "FormulaireConnexion",
    texteSnackBar: "",
    montrerSnackBar: false,
    typeSnackBar: "",
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
          if (this.$route.name != "Accueil") {
            this.$router.push({ name: "Accueil" });
          }
          this.texteSnackBar = "Vous êtes à présent déconnecté !";
          this.typeSnackBar = "succès";
          this.montrerSnackBar = true;
          setTimeout(() => {
            this.montrerSnackBar = false;
          }, 4000);
        })
        .catch((erreur) => {
          console.log(erreur);
        });
    },

    afficherMessageConnexionInscription(message: { valeur: string; succès: boolean }) {
      console.log(message);
      if (message.succès) this.montrerModalConnexionInscription = false;
      this.texteSnackBar = message.valeur;
      this.montrerSnackBar = true;
      this.typeSnackBar = message.succès ? "succès" : "erreur";
      setTimeout(() => {
        this.montrerSnackBar = false;
      }, 4000);
    },

    récupérerDonnées() {
      let utilisateurConnecté = auth.currentUser!;
      this.enleverEcouteurAvatar = db
        .collection("utilisateurs")
        .doc(utilisateurConnecté.uid)
        .onSnapshot((document) => {
          let data = document.data()!;
          if ("avatar" in data) {
            this.avatarUtilisateur = data.avatar;
          } else {
            this.avatarUtilisateur = "";
          }
        });
    },
  },

  mounted() {
    this.enleverEcouteurAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        this.estConnecté = true;
        this.récupérerDonnées();
      } else {
        this.estConnecté = false;
        this.avatarUtilisateur = "";
        this.enleverEcouteurAvatar();
      }
    });
  },

  destroyed() {
    this.enleverEcouteurAuth();
    this.enleverEcouteurAvatar();
  },

  metaInfo: {
    // Titre de la page
    title: "Toccatech",
    titleTemplate: "%s | Toccatech",

    meta: [
      {
        name: "description",
        // Phrase à rajouter après la création du suivi de l'entraînement :
        // Il permet d'enregistrer son temps de pratique instrumentale et de suivre ses progrès et son atteinte de l'objectif.
        content:
          "Toccatech fournit aux musiciens des outils simples et pratiques. Il permet de créer et de gérer une partothèque personnelle en lien avec une encyclopédie musicale collaborative. Il permet également d'y déposer ses propres partitions.",
      },
    ],
  },
});
</script>

<style lang="scss">
// Import de la famille EB Garamond (grâce au paquet npm fontsource) avec les styles suivants :
//    - Regular 400
//    - Regular 500
//    - Bold 600
//    - Bold 700
// Lien vers le dépôt sur GitHub : https://github.com/fontsource/fontsource/tree/master/packages/eb-garamond
@import "~@fontsource/eb-garamond/400.css"; // Regular 400
// @import "~@fontsource/eb-garamond/400-italic.css"; // Regular 400 italic
@import "~@fontsource/eb-garamond/500.css";
@import "~@fontsource/eb-garamond/600.css";
@import "~@fontsource/eb-garamond/700.css"; // Bold 700
// @import "~@fontsource/eb-garamond/700-italic.css"; // Bold 700 italic

// Import des classes de couleurs Material Design
@import "@/assets/styles/colors.scss";
// Import des styles de typographie de l'application
@import "@/assets/styles/typographie.scss";

* {
  box-sizing: border-box;

  // Enlever l'arrière-plan bleu lors d'un clic sur un bouton sur mobiles :
  // https://stackoverflow.com/questions/45049873/how-to-remove-the-blue-background-of-button-on-mobile
  -webkit-tap-highlight-color: transparent;
}

html {
  // Cette propriété permet de rendre le scrolling doux lors du clic sur un lien faisant référence à une autre endroit dans la page grâce à un id
  scroll-behavior: smooth;
}

#app {
  background-color: #fde8ed;
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
  z-index: 9000;
  box-shadow: 0 2px 4px 0 darkgrey;
}

// .fade {
//   &-enter-active,
//   &-leave-active {
//     transition: opacity 3s ease-in;
//   }

//   &-enter,
//   &-leave-to {
//     opacity: 0;
//   }
// }

.fade {
  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave {
    opacity: 1;
  }

  &-enter-active,
  &-leave-active {
    transition: all 0.3s ease;
  }
}

footer {
  background-color: #d69c2f;
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

// Ces classes permettent d'appliquer de la marge plus facilement
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
