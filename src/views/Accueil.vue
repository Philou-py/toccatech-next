<template>
  <div class="accueil">
    <div class="div-image-fond-café" :class="$mq">
      <img
        src="@/assets/images/fond-café.jpg"
        alt="Image Page Accueil Toccatech"
        class="image-fond-café"
      />
      <Container grand>
        <h1 class="titre" :class="$mq">Votre boîte à outils musicale... découvrez la vite !</h1>
        <a href="#connexion-inscription" v-if="!estConnecté">
          <Bouton class="blue-grey" grand>C'est parti !</Bouton>
        </a>
        <router-link v-else :to="{ name: 'MaPartothèque' }">
          <Bouton class="blue-grey" grand>C'est parti !</Bouton>
        </router-link>
      </Container>
    </div>
    <Container class="description-fonctionnalités">
      <div>
        <div class="material-icons taille-48">library_music</div>
        <div>
          <h4>Une partothèque personnelle</h4>
          <p>
            Vous êtes musicien professionnel, étudiant ou simplement amateur. Votre répertoire
            musical s'étoffe de jour en jour. Vous perdez vos partitions ? Vous oubliez le titre des
            oeuvres que vous avez appris à jouer ? Créez ici votre partothèque personnelle !
            Quelques clics suffiront pour enregistrer et lister vos titres préférés !
          </p>
        </div>
      </div>
      <div>
        <div class="material-icons taille-48">library_books</div>
        <div>
          <h4>Une bibliothèque de données musicales</h4>
          <p>
            Découvrez les fiches de synthèse relatives aux compositeurs. Vous ne trouvez pas votre
            compositeur favori ? Ajoutez le et contribuez ainsi à la création d'une véritable
            encyclopédie musicale partagée !
          </p>
        </div>
      </div>
      <div>
        <div class="material-icons taille-48">auto_stories</div>
        <div>
          <h4>Un archivage de vos partitions personnelles</h4>
          <p>
            Vos partitions sont riches d'annotations personnelles précieuses que vous ne voulez pas
            perdre. Numérisez vos documents et archivez les ici. Des années après, vous apprécierez
            de pouvoir rejouer les morceaux de votre jeunesse !
          </p>
        </div>
      </div>
    </Container>
    <div class="div-image-fond-piano" :class="$mq">
      <img
        src="@/assets/images/fond-piano.jpg"
        alt="Image Page Accueil Toccatech"
        class="image-fond-piano"
      />
      <h2>Des outils simples et efficaces au service de votre passion !</h2>
    </div>
    <div class="contact" :class="$mq">
      <Container>
        <h3>Contact</h3>
        <p>
          En cas de problème, je peux vous aider ! N'hésitez pas à m'écrire à l'adresse suivante :
          <a href="mailto:contact@toccatech.com">contact@toccatech.com</a>. Je vous répondrai dans
          les meileurs délais. Toutes vos remarques ou suggestions seront les bienvenues également
          car, n'oubliez pas, ce site est fait pour vous !
        </p>
      </Container>
    </div>
    <a
      href="https://www.citemusicale-metz.fr/la-cite-musicale/les-salles/larsenal"
      target="_blank"
      class="div-image-fond-arsenal"
      :class="$mq"
    >
      <img
        src="@/assets/images/fond-arsenal.jpg"
        alt="Image Fond Arsenal Toccatech"
        class="image-fond-arsenal"
      />
      <Container>
        <h2>Art, culture et nouvelles technologies !</h2>
      </Container>
    </a>
    <div id="connexion-inscription" class="connexion-inscription" :class="$mq" v-if="!estConnecté">
      <FormulaireConnexion
        @connexionInscriptionRéussie="
          (message) => {
            validerConnexionInscription(message);
          }
        "
      />
      <FormulaireInscription
        @connexionInscriptionRéussie="
          (message) => {
            validerConnexionInscription(message);
          }
        "
      />
    </div>
    <BarreMessages :montrerSnackBar="montrerSnackBar">{{ texteSnackBar }}</BarreMessages>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/firebase";
import FormulaireConnexion from "@/components/layouts/accounts/FormulaireConnexion.vue";
import FormulaireInscription from "@/components/layouts/accounts/FormulaireInscription.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Container from "@/components/ui-components/Container.vue";
import BarreMessages from "@/components/ui-components/BarreMessages.vue";

export default Vue.extend({
  components: {
    FormulaireConnexion,
    FormulaireInscription,
    Bouton,
    Container,
    BarreMessages,
  },

  data: () => ({
    estConnecté: true,
    enleverEcouteurAuth: () => {},
    texteSnackBar: "",
    montrerSnackBar: false,
  }),

  methods: {
    validerConnexionInscription(message: string) {
      console.log(message);
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
.accueil {
  .titre {
    font-size: 63px;
    color: var(--couleur-fg-titre-page-accueil);
    font-weight: 500;
    margin-bottom: 30px;
    line-height: 1;

    &.xs {
      font-size: 55px;
    }
  }

  .div-image-fond-café,
  .div-image-fond-piano,
  .div-image-fond-arsenal {
    height: 500px;
    overflow: hidden;
    position: relative;

    // Appliquer 'position: relative' au texte au dessus des images
    // permet de faire en sorte qu'il reste au dessus, car un élément
    // avec une position non statique est positionné au dessus d'un
    // élément avec une position statique.
    .container,
    h2 {
      position: relative;
    }

    &.xs,
    &.sm {
      .image-fond-café,
      .image-fond-piano,
      .image-fond-arsenal {
        height: 120%;
        width: auto;
      }
    }

    .image-fond-café,
    .image-fond-piano,
    .image-fond-arsenal {
      position: absolute;
      top: 0;
      left: 0;
      height: auto;
      width: 100%;
    }
  }

  .div-image-fond-café {
    padding-top: 100px;
    text-align: center;
  }

  .div-image-fond-piano {
    padding-top: 150px;

    h2 {
      margin-left: 10%;
      margin-right: 50%;
      color: #f5b151;
      text-align: center;
    }

    &.sm {
      h2 {
        margin-right: 25%;
      }
    }

    &.xs {
      h2 {
        margin-right: 10%;
      }
    }
  }

  .div-image-fond-arsenal {
    display: block;
    text-decoration: none;
    padding-top: 200px;

    h2 {
      color: white;
      text-align: center;
    }
  }

  .description-fonctionnalités {
    display: flex;
    margin-top: 40px;
    margin-bottom: 40px;

    div.material-icons {
      color: var(--couleur-fg-icones-description-page-accueil);
    }

    h4 {
      font-weight: 400;
    }

    & > div {
      margin: 0 1%;
      width: 31.33%;
      text-align: center;
    }

    &.xs {
      flex-direction: column;

      & > div {
        margin: 0;
        width: 100%;
      }
    }
  }

  .connexion-inscription {
    display: flex;

    & > div {
      margin: 2%;
    }

    &.xs,
    &.sm {
      flex-direction: column;

      & > div {
        width: 96%;
      }
    }

    &.md,
    &.lg,
    &.xl {
      & > div {
        flex-grow: 1;
        width: 46%;
      }
    }
  }

  .contact {
    padding: 30px 0;

    h3 {
      text-align: center;
    }

    p {
      text-align: justify;
    }
  }
}
</style>
