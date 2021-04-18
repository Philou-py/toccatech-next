<template>
  <Container>
    <div v-if="existant && chargementTerminé">
      <Carte class="carte-détails-compositeur">
        <div class="nom-image-compositeur" :class="$grid.breakpoint">
          <h1 class="centrer-texte" :class="$grid.breakpoint">{{ compositeur.nom }}</h1>
          <div class="container-img">
            <img
              ref="imgPrévisualisation"
              :src="compositeur.photo"
              class="img-prévisualisation"
              alt="Prévisualisation de l'image..."
            />
          </div>
        </div>
        <div class="détails-compositeur" :class="$grid.breakpoint">
          <div>
            <h3>Carte d'identité</h3>
            <ul>
              <li>
                Date de naissance : {{ compositeur.date_naissance.toDate().toLocaleDateString() }}
              </li>
              <li v-if="compositeur.est_mort">
                Date de décès : {{ compositeur.date_décès.toDate().toLocaleDateString() }} (mort à
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
            <Bouton class="teal accent-2" texte>Envie de contribuer ?</Bouton>
          </router-link>
        </div>
      </Carte>
    </div>
    <div v-else-if="!chargementTerminé">
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
import { defineComponent } from "vue";
import { db } from "@/firebase/config";
import Container from "@/components/ui-components/Container.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Carte from "@/components/ui-components/Carte.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";
import Accueil from "./Accueil.vue";

export default defineComponent({
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
    existant: true,
    chargementTerminé: false,
    nom: "",
    biographie: "",
  }),

  mounted() {
    var une_année_en_millisecondes = 1000 * 60 * 60 * 24 * 365;

    // Récupération des données du compositeur voulu depuis
    // la base de données Firebase Firestore
    db.collection("compositeurs")
      .doc(this.id)
      .onSnapshot(
        (document) => {
          if (document.exists) {
            let données = document.data()!;
            if (données.date_décès) {
              données.est_mort = true;
              let âge =
                (données.date_décès.toDate().getTime() -
                  données.date_naissance.toDate().getTime()) /
                une_année_en_millisecondes;
              données.âge = Math.floor(âge);
            } else {
              données.est_mort = false;
              let maintenant = new Date();
              let âge =
                (maintenant.getTime() - données.date_naissance.toDate().getTime()) /
                une_année_en_millisecondes;
              données.âge = Math.floor(âge);
            }
            this.compositeur = { ...données, id: document.id };
            this.chargementTerminé = true;
          } else {
            // Le document n'existe pas
            this.chargementTerminé = true;
            this.existant = false;
          }
        },
        (erreur) => {
          // Une erreur est survenue lors de la récupération des données
          console.log(erreur);
        }
      );
  },
});
</script>

<style lang="scss">
.carte-détails-compositeur {
  color: initial;
  padding: 15px;

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
