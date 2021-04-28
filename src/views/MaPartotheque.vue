<template>
  <div class="ma-partothèque">
    <Container>
      <h1 class="centrer-texte">Ma Partothèque Personnelle</h1>
      <table class="tableau-partothèque">
        <tr>
          <th>Compositeur</th>
          <th>Titre de l'œuvre</th>
          <th><span class="material-icons">cloud_download</span></th>
        </tr>
        <tr v-for="oeuvre in oeuvres" :key="oeuvre.id">
          <td>
            <div class="td-compositeur" :class="$mq">
              <div class="container-vignette-img">
                <img
                  v-if="oeuvre.photo_compositeur"
                  :src="oeuvre.photo_compositeur"
                  alt="Photo d'un compositeur"
                />
              </div>
              {{ oeuvre.compositeur }}
            </div>
          </td>
          <td>{{ oeuvre.titre }}</td>
          <td class="cellule-télécharger">
            <a class="aucun-style" rel="noopener" target="_blank" :href="oeuvre.url_partition">
              <BoutonIcone
                class="icône_télécharger"
                :class="{ 'aucun-fichier': !oeuvre.url_partition }"
                couleur-ripple="#ffe5e5"
              >
                file_download
              </BoutonIcone>
            </a>
          </td>
        </tr>
      </table>

      <div class="centrer-texte" style="margin: 30px 0">
        <Bouton
          class="blue-grey"
          @click="
            montrerFormulaire = !montrerFormulaire;
            réinitialiserValeursChamps();
          "
        >
          Ajouter un morceau
        </Bouton>
      </div>
      <transition name="fade">
        <Formulaire
          class="formulaire-ajout-oeuvre"
          :class="$mq"
          v-model="formulaireValide"
          v-if="montrerFormulaire"
        >
          <div class="ligne">
            <ChampTexte
              type="sélecteur"
              :items="nomsCompositeurs"
              v-model="compositeur"
              icôneDevant="face"
              label="Compositeur"
              requis
            />
            <ChampTexte
              v-model="titreOeuvre"
              icôneDevant="badge"
              label="Titre de l'oeuvre"
              requis
            />
          </div>
          <div class="ligne">
            <SelecteurFichiers
              v-model="partition"
              icôneDevant="music_note"
              label="Télécharger votre partition"
            />
            <Bouton
              class="green"
              :désactivé="!formulaireValide || chargement"
              :titre="messageTitre"
              @click="nouvelleOeuvre()"
              texte
            >
              {{ messageBouton }}
            </Bouton>
          </div>
        </Formulaire>
      </transition>
    </Container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, auth, storage } from "@/firebase";
import Container from "@/components/ui-components/Container.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import SelecteurFichiers from "@/components/ui-components/SelecteurFichiers.vue";
import BoutonIcone from "@/components/ui-components/BoutonIcone.vue";

export default Vue.extend({
  components: {
    Container,
    Bouton,
    Formulaire,
    ChampTexte,
    SelecteurFichiers,
    BoutonIcone,
  },

  data: () => ({
    oeuvres: [] as any[],
    nomsCompositeurs: [] as string[],
    compositeur: "",
    compositeurTest: "",
    titreOeuvre: "",
    partition: <any>null,
    montrerFormulaire: false,
    enleverEcouteurPartothèque: () => {},
    enleverEcouteurCompositeurs: () => {},
    formulaireValide: false,
    chargement: false,
  }),

  computed: {
    messageBouton(): string {
      if (this.chargement) {
        return "Chargement...";
      }
      return "Valider";
    },

    messageTitre(): string | undefined {
      if (!this.formulaireValide) {
        return "Le formulaire n'est pas valide !";
      }
    },
  },

  methods: {
    réinitialiserValeursChamps() {
      this.titreOeuvre = this.compositeur = this.partition = "";
    },

    enregistrerOeuvre(url?: string) {
      db.collection("compositeurs")
        .where("nom", "==", this.compositeur)
        .get()
        .then((snapshot) => {
          // Normalement, il n'y aura qu'une itération car le nom d'un compositeur
          // doit être unique dans la base de données.
          snapshot.forEach((document) => {
            let idCompositeur = document.id;
            let photo_compositeur = document.data().photo;
            let données = url
              ? {
                  compositeur: this.compositeur,
                  titre: this.titreOeuvre,
                  url_partition: url,
                  uid_utilisateur: auth.currentUser!.uid,
                  photo_compositeur,
                }
              : {
                  compositeur: this.compositeur,
                  titre: this.titreOeuvre,
                  uid_utilisateur: auth.currentUser!.uid,
                  photo_compositeur,
                };
            db.collection("compositeurs")
              .doc(idCompositeur)
              .collection("oeuvres")
              .add(données)
              .then(() => {
                console.log("L'oeuvre a bien été enregistrée dans la base de données !");
                this.montrerFormulaire = false;
                this.réinitialiserValeursChamps();
                this.chargement = false;
              });
          });
        });
    },

    nouvelleOeuvre() {
      this.chargement = true;
      if (this.partition) {
        let refPartition = storage.ref(
          `partitions_utilisateurs/${auth.currentUser!.uid}/${this.partition.name}`
        );
        refPartition
          .put(this.partition, { cacheControl: "public,max-age: 432000" })
          .then((réponse) => {
            réponse.ref.getDownloadURL().then((url) => this.enregistrerOeuvre(url));
          });
      } else {
        this.enregistrerOeuvre();
      }
      console.log("Nouvelle oeuvre !");
    },

    récupérerDonnées() {
      console.log("Données récupérées !");
      // Récupération de la partothèque de l'utilisateur depuis Firebase Firestore
      var refPartothèqueUtilisateur = db
        .collectionGroup("oeuvres")
        .where("uid_utilisateur", "==", auth.currentUser!.uid)
        .orderBy("titre");

      // La fonction 'onSnapshot' renvoie une fonction qui, lors de son invocation,
      // enlève l'écouteur en temps réel.
      this.enleverEcouteurPartothèque = refPartothèqueUtilisateur.onSnapshot(
        (snapshot) => {
          this.oeuvres = [];
          snapshot.forEach((oeuvre) => {
            var data = oeuvre.data();
            this.oeuvres.push({
              ...data,
              id: oeuvre.id,
            });
          });
        },
        (erreur) => {
          console.log(erreur);
        }
      );

      // Récupération des noms de tous les compositeurs
      this.enleverEcouteurCompositeurs = db.collection("compositeurs").onSnapshot((snapshot) => {
        this.nomsCompositeurs = [];
        snapshot.forEach((document) => {
          let donnéesCompositeur = document.data();
          this.nomsCompositeurs.push(donnéesCompositeur.nom);
        });
      });
    },
  },

  mounted() {
    this.récupérerDonnées();
  },

  destroyed() {
    this.enleverEcouteurPartothèque();
    this.enleverEcouteurCompositeurs();
  },

  metaInfo: {
    title: "Ma Partothèque",
  },
});
</script>

<style lang="scss">
.ma-partothèque {
  padding: 20px 0 50px;

  h1 {
    margin-bottom: 30px;
  }

  .tableau-partothèque {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
    position: relative;

    &::before {
      content: "";
      display: block;
      position: absolute;
      opacity: 0.08;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: url("~@/assets/images/image-fond-partothèque.png");
      background-size: 30%;
    }

    tr,
    td,
    th {
      padding: 5px 10px;
      border: 1px solid darkgrey;
      // Les éléments positionnés explicitement sont toujours au dessus des autres !
      // La ligne ci-dessous permet donc de positionner le contenu du tableau au dessus
      // de l'image d'arrière plan qui a elle une position 'absolute'.
      position: relative;
    }

    .td-compositeur {
      display: flex;
      align-items: center;

      &.xs,
      &.sm {
        flex-direction: column;
        text-align: center;

        img {
          margin-right: 0;
        }
      }

      .container-vignette-img {
        height: 48px;
        // max-width: 100px;

        img {
          height: 100%;
          width: auto;
          margin-right: 15px;
        }
      }
    }

    .cellule-télécharger {
      width: 58px;
    }
  }

  a.aucun-style {
    text-decoration: none;
    color: initial;
  }

  .icône_télécharger {
    button:hover {
      background-color: #ffe3c0;
    }

    .material-icons {
      color: #f98f00;
    }
  }

  .aucun-fichier {
    button:hover {
      background-color: lightgrey;
    }

    .material-icons {
      color: grey;
    }
  }

  .formulaire-ajout-oeuvre {
    display: flex;
    flex-direction: column;

    &.lg,
    &.xl {
      flex-direction: row;

      & > .ligne {
        &:first-child {
          display: flex;
          flex-grow: 2.5;
        }

        &:last-child {
          display: flex;
          flex-grow: 1;
        }

        & > .champ-texte,
        & > .sélecteur-fichiers {
          margin: 0 15px;
        }

        .btn {
          flex-shrink: 0;
        }
      }
    }

    &.md,
    &.sm {
      & > .ligne {
        display: flex;

        &:last-child {
          display: flex;
          align-items: center;
          width: 70%;
          margin: 0 auto;
        }

        & > .champ-texte,
        & > .sélecteur-fichiers {
          flex-grow: 1;
          margin: 0 15px;
        }

        & > .btn {
          flex-shrink: 0;
        }
      }
    }

    &.xs {
      & > .ligne {
        display: flex;
        flex-direction: column;
      }
    }
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
