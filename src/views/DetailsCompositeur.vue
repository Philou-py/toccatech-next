<template>
  <Container class="overflow-hidden">
    <div v-if="existant && chargementCompositeurTerminé && chargementOeuvresTerminé">
      <Carte class="carte-détails-compositeur">
        <div class="nom-image-compositeur" :class="$mq">
          <h1 class="centrer-texte" :class="$mq">{{ compositeur.nom }}</h1>
          <div class="container-img">
            <img
              ref="imgPrévisualisation"
              :src="compositeur.photo"
              class="img-prévisualisation"
              alt="Prévisualisation de l'image..."
            />
          </div>
        </div>
        <div class="détails-compositeur" :class="$mq">
          <div>
            <h3>Carte d'identité</h3>
            <ul>
              <li>Date de naissance : {{ compositeur.date_naissance.toLocaleDateString() }}</li>
              <li v-if="compositeur.est_mort">
                Date de décès : {{ compositeur.date_décès.toLocaleDateString() }} (mort à
                {{ compositeur.âge }} ans)
              </li>
              <li v-else>Âge : {{ compositeur.âge }}</li>
              <li>Styles musicaux : {{ compositeur.styles_musicaux }}</li>
            </ul>
          </div>
          <div>
            <h3>Biographie</h3>
            <p style="white-space: pre-wrap">{{ compositeur.biographie }}</p>
          </div>
        </div>
        <div class="actions-carte mt-4">
          <Espacement />
          <router-link :to="{ name: 'ModifierInfosCompositeur', params: { id: compositeur.id } }">
            <Bouton
              :désactivé="!estConnecté"
              :titre="messageNonConnecté"
              class="indigo darken-1"
              texte
            >
              Envie de contribuer ?
            </Bouton>
          </router-link>
        </div>
        <!-- <div style="background-color: darkgrey; height: 2px"></div> -->
        <div v-if="oeuvresCompositeur.length">
          <hr />
          <h3>Ses œuvres jouées par la communauté</h3>
          <ul v-for="oeuvre in oeuvresCompositeur" :key="oeuvre.id">
            <li>{{ oeuvre.titre }}</li>
          </ul>
        </div>
      </Carte>
    </div>
    <div v-else-if="!(chargementCompositeurTerminé && chargementOeuvresTerminé)">
      <p>Chargement...</p>
    </div>
    <div v-else>
      <h3>Ce compositeur n'existe pas !</h3>
      <h5>
        Retournez donc sur
        <router-link :to="{ name: 'Encyclopédie' }">l'encyclopédie</router-link> !
      </h5>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from "vue";
import { db, auth } from "@/firebase";
import Container from "@/components/ui-components/Container.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Carte from "@/components/ui-components/Carte.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";
import Accueil from "./Accueil.vue";

export default Vue.extend({
  components: {
    Container,
    ChampTexte,
    Formulaire,
    Accueil,
    Carte,
    Bouton,
    Espacement,
  },

  props: {
    id: String,
  },

  data: () => ({
    compositeur: {},
    oeuvresCompositeur: [] as any[],
    existant: true,
    chargementCompositeurTerminé: false,
    chargementOeuvresTerminé: false,
    enleverEcouteurOeuvres: () => {},
    enleverEcouteurCompositeur: () => {},
    nom: "",
    biographie: "",
    estConnecté: false,
    messageNonConnecté: "",
  }),

  mounted() {
    var une_année_en_millisecondes = 1000 * 60 * 60 * 24 * 365;

    // Récupération des données du compositeur voulu depuis
    // la base de données Firebase Firestore
    var refCompositeur = db.collection("compositeurs").doc(this.id);
    this.enleverEcouteurCompositeur = refCompositeur.onSnapshot(
      (document) => {
        if (document.exists) {
          let données = document.data()!;
          données.date_décès = new Date(données.date_décès);
          données.date_naissance = new Date(données.date_naissance);
          if (!données.est_mort) {
            let maintenant = new Date();
            let âge =
              (maintenant.getTime() - données.date_naissance.getTime()) /
              une_année_en_millisecondes;
            données.âge = Math.floor(âge);
          }
          this.compositeur = { ...données, id: document.id };
          this.chargementCompositeurTerminé = true;
        } else {
          // Le document n'existe pas
          this.existant = false;
          this.chargementCompositeurTerminé = true;
        }
      },
      (erreur) => {
        // Une erreur est survenue lors de la récupération des données
        console.log(erreur);
      }
    );

    this.enleverEcouteurOeuvres = refCompositeur.collection("oeuvres").onSnapshot(
      (snapshot) => {
        this.oeuvresCompositeur = [];
        snapshot.forEach((document) => {
          this.oeuvresCompositeur.push(document.data());
        });
        this.chargementOeuvresTerminé = true;
      },
      (erreur) => {
        console.log(erreur);
        this.chargementOeuvresTerminé = true;
      }
    );

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.estConnecté = true;
        this.messageNonConnecté = "";
      } else {
        this.estConnecté = false;
        this.messageNonConnecté = "Connectez-vous pour contribuer !";
      }
    });
  },

  destroyed() {
    this.enleverEcouteurCompositeur();
    this.enleverEcouteurOeuvres();
  },

  metaInfo: {
    title: "Détails du compositeur",
  },
});
</script>

<style lang="scss">
.overflow-hidden {
  overflow: hidden;
}

.carte-détails-compositeur {
  color: initial;
  padding: 15px;
  position: relative;

  * {
    // Les éléments positionnés explicitement sont toujours au dessus des autres !
    // La ligne ci-dessous permet donc de positionner le contenu du tableau au dessus
    // de l'image d'arrière plan qui a elle une position 'absolute'.
    position: relative;
  }

  &::before {
    content: "";
    display: block;
    position: absolute;
    opacity: 0.08;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/images/image-fond-détails-compositeur.jpg");
    background-size: 25%;
  }

  .nom-image-compositeur {
    display: flex;
    align-items: center;
    margin: 20px 0;
    justify-content: center;

    &.xs {
      flex-direction: column;

      h1 {
        order: 2;
      }
    }

    .container-img {
      margin-left: 5%;
    }

    .img-prévisualisation {
      display: block;
      max-height: 150px;
      width: auto;
      border-radius: 10px;
    }
  }

  .tableau-partothèque {
    width: 100%;
    border-collapse: collapse;
    tr,
    td,
    th {
      padding: 5px 10px;
      border: 1px solid darkgrey;
    }
  }
}

.détails-compositeur {
  display: flex;

  ul {
    padding-left: 0px;
    list-style-position: inside;
  }

  &.xs,
  &.sm {
    flex-direction: column;
  }

  &.md,
  &.lg,
  &.xl {
    div:first-child {
      width: 40%;
      margin-right: 3%;
    }

    div:last-child {
      width: 58%;
    }
  }
}
</style>
