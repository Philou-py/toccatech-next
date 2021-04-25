<template>
  <Container petit class="encyclopédie">
    <div class="nom-bouton-compositeur" :class="$mq">
      <h1 class="centrer-texte titre-page" :class="$mq">Encyclopédie</h1>
      <router-link :to="{ name: 'NouveauCompositeur' }"
        ><Bouton class="blue-grey">Nouveau Compositeur</Bouton></router-link
      >
    </div>
    <div class="container-cartes" v-if="chargementTerminé">
      <Carte
        v-for="compositeur in compositeurs"
        :key="compositeur.id"
        class="carte-compositeur"
        :class="$mq"
      >
        <div class="infos-compositeur contenu-carte">
          <h5 class="titre-carte nom-compositeur" :title="compositeur.nom">
            {{ compositeur.nom }}
          </h5>
          <div class="biographie-compositeur">
            <!-- {{ compositeur.biographie }} -->
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
          <router-link :to="{ name: 'DétailsCompositeur', params: { id: compositeur.id } }"
            ><Bouton texte class="indigo darken-1 mt-3">En savoir plus...</Bouton></router-link
          >
        </div>
        <div class="container-photo">
          <img :src="compositeur.photo" alt="Image" class="photo-compositeur" />
        </div>
      </Carte>
    </div>
    <div v-else>
      <p>Chargement...</p>
    </div>
  </Container>
</template>

<script lang="ts">
import Vue from "vue";
import { db } from "@/firebase";
import Carte from "@/components/ui-components/Carte.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Container from "@/components/ui-components/Container.vue";

export default Vue.extend({
  components: {
    Carte,
    Container,
    Bouton,
  },

  data: () => ({
    compositeurs: [],
    chargementTerminé: false,
    enleverEcouteur: () => {},
  }),

  mounted() {
    var une_année_en_millisecondes = 1000 * 60 * 60 * 24 * 365;

    // Récupération des données des compositeurs depuis
    // la base de données Firebase Firestore
    this.enleverEcouteur = db
      .collection("compositeurs")
      .orderBy("nom")
      .onSnapshot(
        (snapShot) => {
          let résultat: any = [];
          snapShot.docs.forEach((document) => {
            let données = document.data();
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
            résultat.push({ ...données, id: document.id });
          });
          this.compositeurs = résultat;
          this.chargementTerminé = true;
        },
        (erreur) => {
          console.log(erreur);
        }
      );
  },

  destroyed() {
    this.enleverEcouteur();
  },
});
</script>

<style lang="scss">
.encyclopédie {
  overflow: hidden;
  .nom-bouton-compositeur {
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

    a {
      margin-left: 5%;
    }
  }
}
.container-cartes {
  display: flex;
  flex-wrap: wrap;

  .carte-compositeur {
    display: flex;

    &.xs {
      width: 96%;
      padding: 0;
      margin-bottom: 20px;
      flex-direction: column;

      .container-photo {
        /* Changement de l'ordre des éléments : la photo vient en premier, les */
        /* informations sur le compositeur ensuite */
        order: 1;
        justify-content: center;
        width: 100%;
        height: 250px;
        overflow: hidden;
      }

      .infos-compositeur {
        order: 2;
        width: 100%;
        margin-right: 0;
        padding-left: 16px;
        padding-right: 16px;
      }
    }

    &.sm {
      max-height: 230px;
    }

    &.md {
      width: 46%;
      max-height: 250px;

      .infos-compositeur {
        width: 60%;
      }

      .container-photo {
        width: 35%;
      }
    }

    &.lg {
      width: 31.33%;
      max-height: 250px;
      margin: 1%;

      .infos-compositeur {
        margin-right: 2%;
        width: 70%;
      }

      .container-photo {
        width: 28%;
      }
    }

    &.xl {
      width: 23%;
      max-height: 230px;
      margin: 1%;

      .infos-compositeur {
        width: 65%;
      }

      .container-photo {
        width: 30%;
      }
    }

    .btn {
      width: 100%;
    }

    .infos-compositeur {
      width: 55%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-right: 5%;

      .btn {
        margin-right: 5px;
      }
    }

    .nom-compositeur {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: center;
    }

    .container-photo {
      width: 40%;
      height: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .photo-compositeur {
      width: 100%;
      height: auto;
    }

    .biographie-compositeur {
      /* display: -webkit-box; */
      /* -webkit-box-orient: vertical; */
      /* -webkit-line-clamp: 4; */
      overflow: hidden;

      ul {
        padding-left: 0;
        list-style-position: inside;
        margin: 0;
      }
    }
  }
}
</style>
