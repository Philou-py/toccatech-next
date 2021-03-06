<template>
  <div>
    <Container v-show="existant && chargementTerminé" class="overflow-hidden">
      <Carte class="carte-modification-infos-compositeur my-4" :class="$mq">
        <div class="nom-image-compositeur" :class="$mq">
          <h1 class="centrer-texte" :class="$mq">
            {{ compositeur.nom }}<span v-if="compositeur.nom"> - </span
            ><span v-if="id">Contribuer</span><span v-else>Nouveau compositeur</span>
          </h1>
          <div class="container-img">
            <img
              ref="imgPrévisualisation"
              src=""
              class="img-prévisualisation"
              alt="Prévisualisation de l'image..."
            />
          </div>
        </div>
        <Formulaire v-model="formulaireValide" class="row">
          <div class="col">
            <ChampTexte
              icôneDevant="face"
              label="Nom du compositeur"
              v-model="compositeur.nom"
              requis
            />
            <ChampTexte
              type="date"
              icôneDevant="today"
              label="Date de naissance"
              v-model="compositeur.date_naissance_string"
              requis
            />
            <ChampTexte
              type="date"
              icôneDevant="event"
              label="Date de décès (si le compositeur est décédé)"
              v-model="compositeur.date_décès_string"
            />
            <ChampTexte
              icôneDevant="music_note"
              label="Styles musicaux"
              v-model="compositeur.styles_musicaux"
              requis
            />
          </div>
          <div class="séparateur-vertical"></div>
          <div class="col">
            <ChampTexte
              icôneDevant="link"
              label="Photo du compositeur (URL)"
              v-model="compositeur.photo"
              :longueur-max="500"
              :invalide="!URLValide"
              :désactivé="sélectionPhotoFinie"
            />
            <span>OU</span>
            <SelecteurFichiers
              label="Sélectionner une photo..."
              accepter="image/*"
              icôneDevant="image"
              v-model="fichierPhoto"
              @input="prévisualiserFichierImage()"
              :désactivé="sélectionPhotoFinie"
            />
            <div
              style="
                display: flex;
                justify-content: flex-end;
                margin-bottom: 30px;
                position: relative;
              "
            >
              <label for="finirSélectionPhoto">Valider sélection photo</label
              ><input
                id="finirSélectionPhoto"
                type="checkbox"
                v-model="sélectionPhotoFinie"
                @change="
                  émettreEvénement();
                  if (sélectionPhotoFinie) {
                    if (fichierPhoto) {
                      uploaderImage();
                    }
                  } else {
                    if (fichierPhoto) {
                      supprimerImage();
                    }
                  }
                "
              />
            </div>
            <ChampTexte
              type="textarea"
              label="Biographie du compositeur"
              v-model="compositeur.biographie"
              hauteur="200px"
              :longueur-max="2000"
              requis
            />
          </div>
        </Formulaire>
        <div style="display: flex; justify-content: center" class="my-4">
          <router-link v-if="id" :to="{ name: 'DétailsCompositeur', params: { id: id } }"
            ><Bouton class="red mr-3">Annuler</Bouton></router-link
          >
          <router-link v-else :to="{ name: 'Encyclopédie' }"
            ><Bouton class="red mr-3">Annuler</Bouton></router-link
          >
          <Bouton
            class="purple"
            v-if="!formulaireValide || !sélectionPhotoValide || !uploadTerminé"
            désactivé
            titre="Le formulaire n'est pas valide !"
            texte
          >
            Valider
          </Bouton>
          <Bouton v-else class="purple" texte @click="contribuer()">Valider</Bouton>
        </div>
      </Carte>
    </Container>
    <div v-if="!chargementTerminé">
      <p>Chargement...</p>
    </div>
    <div v-if="!existant">
      <h3>Ce compositeur n'existe pas !</h3>
      <h5>
        Retournez donc sur
        <router-link :to="{ name: 'Encyclopédie' }">l'encyclopédie</router-link> !
      </h5>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { db, storage } from "@/firebase";
import { BusEvénements } from "@/BusEvénements";
import Container from "@/components/ui-components/Container.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Carte from "@/components/ui-components/Carte.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import SelecteurFichiers from "@/components/ui-components/SelecteurFichiers.vue";

export default Vue.extend({
  props: {
    id: String,
  },

  components: {
    Container,
    ChampTexte,
    Formulaire,
    Carte,
    Bouton,
    SelecteurFichiers,
  },

  data: () => ({
    nomOriginal: "",
    compositeur: <any>{},
    fichierPhoto: <any>null,
    URLValide: true,
    chargementTerminé: false,
    existant: true,
    hauteurInput: "",
    formulaireValide: false,
    sélectionPhotoFinie: true,
    uploadTerminé: true,
  }),

  computed: {
    sélectionPhotoValide(): boolean {
      if (this.sélectionPhotoFinie) {
        if (this.URLValide) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
  },

  watch: {
    "compositeur.photo": function () {
      this.prévisualiserURLImage();
    },
  },

  methods: {
    émettreEvénement() {
      BusEvénements.$emit("état-validité-à-vérifier");
    },

    prévisualiserFichierImage() {
      var imgPrévisualisation = this.$refs.imgPrévisualisation as HTMLImageElement;
      if (this.fichierPhoto) {
        this.$set(this.compositeur, "photo", "");
        var lecteur = new FileReader();
        lecteur.addEventListener("load", () => {
          imgPrévisualisation.src = lecteur.result as any;
          imgPrévisualisation.style.display = "block";
        });
        lecteur.readAsDataURL(this.fichierPhoto);
      } else {
        imgPrévisualisation.src = "";
        imgPrévisualisation.style.display = "none";
      }
    },

    prévisualiserURLImage() {
      var imgPrévisualisation = this.$refs.imgPrévisualisation as HTMLImageElement;
      if (this.compositeur.photo) {
        // Test de l'url entrée par l'utilisateur grâce à une expression régulière pour savoir
        // si elle est syntaxiquement valide.
        var estUneURL = /^(http|https):\/\/[^ "]+$/.test(this.compositeur.photo);
        if (estUneURL) {
          // Effectuer une requête GET avec l'url entrée permet de savoir si elle revoie une réponse
          // de succès ou d'erreur.
          fetch(this.compositeur.photo)
            .then((réponse) => {
              if (réponse.status == 200) {
                this.URLValide = true;
                imgPrévisualisation.src = this.compositeur.photo;
                imgPrévisualisation.style.display = "block";
                console.log("L'image existe");
              } else {
                this.URLValide = false;
                console.log("L'image n'existe pas !");
              }
            })
            .catch(() => {
              this.URLValide = false;
              console.log("L'image n'existe pas !");
              imgPrévisualisation.src = "";
              imgPrévisualisation.style.display = "none";
            });
        } else {
          this.URLValide = false;
        }
      } else {
        imgPrévisualisation.src = "";
        imgPrévisualisation.style.display = "none";
      }
    },

    uploaderImage() {
      this.uploadTerminé = false;
      var refImage = storage.ref(`photos_compositeurs/${this.fichierPhoto.name}`);
      refImage
        .put(this.fichierPhoto, { cacheControl: "public,max-age: 432000" })
        .then((réponse) => {
          réponse.ref.getDownloadURL().then((url) => {
            this.$set(this.compositeur, "photo", url);
            this.émettreEvénement();
            this.uploadTerminé = true;
          });
        });
    },

    supprimerImage() {
      var refImage = storage.ref(`photos_compositeurs/${this.fichierPhoto.name}`);
      this.$set(this.compositeur, "photo", "");
      refImage.delete().then(() => {
        console.log("Photo supprimée !");
      });
    },

    contribuer() {
      let données = {
        biographie: this.compositeur.biographie,
        nom: this.compositeur.nom,
        photo: this.compositeur.photo,
        styles_musicaux: this.compositeur.styles_musicaux,
        âge: 0,
        date_naissance: "",
        date_décès: "",
        est_mort: false,
      };

      var date_naissance = new Date(this.compositeur.date_naissance_string);
      données.date_naissance = this.compositeur.date_naissance_string;

      if (this.compositeur.date_décès_string) {
        données.est_mort = true;
        var date_décès = new Date(this.compositeur.date_décès_string);
        données.date_décès = this.compositeur.date_décès_string;

        var une_année_en_millisecondes = 1000 * 60 * 60 * 24 * 365;
        let âge = (date_décès.getTime() - date_naissance.getTime()) / une_année_en_millisecondes;
        données.âge = Math.floor(âge);
      }

      if (this.id) {
        db.collection("compositeurs").doc(this.id).set(données);
        let refOeuvres = db.collection("compositeurs").doc(this.id).collection("oeuvres");
        refOeuvres
          .where("compositeur", "==", this.nomOriginal)
          .get()
          .then((snapshot) => {
            snapshot.forEach((document) => {
              refOeuvres
                .doc(document.id)
                .set(
                  { compositeur: données.nom, photo_compositeur: données.photo },
                  { merge: true }
                );
            });
          });
        this.$router.push({ name: "DétailsCompositeur", params: { id: this.id } });
      } else {
        db.collection("compositeurs").add(données);
        this.$router.push({ name: "Encyclopédie" });
      }
    },
  },
  mounted() {
    // Calcul du nombre de millisecondes en une année pour ensuite calculer l'âge
    // du compositeur
    let une_année_en_millisecondes = 1000 * 60 * 60 * 24 * 365;

    if (this.id) {
      // Récupération des données du compositeur voulu depuis
      // la base de données Firebase Firestore
      db.collection("compositeurs")
        .doc(this.id)
        .get()
        .then((document) => {
          if (document.exists) {
            var compositeur = document.data()!;
            // Toutes les propriétés de l'objet 'this.compositeur' doivent être déclarées
            // et faites réactives grâce à la méthode 'this.$set(objet, clé, valeur)'.
            for (var clé in compositeur) {
              this.$set(this.compositeur, clé, compositeur[clé]);
            }
            this.nomOriginal = this.compositeur.nom;
            this.$set(this.compositeur, "date_naissance_string", this.compositeur.date_naissance);
            this.$set(
              this.compositeur,
              "date_naissance",
              new Date(this.compositeur.date_naissance)
            );
            if (this.compositeur.date_décès) {
              this.$set(this.compositeur, "date_décès_string", this.compositeur.date_décès);
              this.$set(this.compositeur, "date_décès", new Date(this.compositeur.date_décès));
              if (!this.compositeur.âge) {
                let âge =
                  (this.compositeur.date_décès.getTime() -
                    this.compositeur.date_naissance.getTime()) /
                  une_année_en_millisecondes;
                this.$set(this.compositeur, "âge", Math.floor(âge));
              }
            } else {
              let maintenant = new Date();
              let âge =
                (maintenant.getTime() - this.compositeur.date_naissance.getTime()) /
                une_année_en_millisecondes;
              this.$set(this.compositeur, "âge", Math.floor(âge));
            }
            this.chargementTerminé = true;
          } else {
            // Le document n'existe pas
            this.chargementTerminé = true;
            this.existant = false;
          }
        })
        .catch((erreur) => {
          // Une erreur est survenue lors de la récupération des données
          console.log(erreur);
        });
    } else {
      var compositeur = {
        nom: "",
        date_naissance: null,
        date_naissance_string: "",
        date_décès: null,
        date_décès_string: "",
        styles_musicaux: "",
        photo: "",
        biographie: "",
      };
      for (var clé in compositeur) {
        // @ts-ignore
        this.$set(this.compositeur, clé, compositeur[clé]);
      }
      this.chargementTerminé = true;
    }
  },

  metaInfo: {
    title: "Contribuer à l'encyclopédie",
  },
});
</script>

<style lang="scss">
.overflow-hidden {
  // La propriété 'overflow: hidden' permet de cacher le contenu qui irait en dehors de l'élément
  // et donc de faire en sorte que la marge appliquée aux éléments enfants soient contenue dans
  // cet élément et non qu'elle dépasse à l'extérieur.
  overflow: hidden;
}

.carte-modification-infos-compositeur {
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
    background-image: url("~@/assets/images/image-fond-détails-compositeur.jpg");
    background-size: 25%;
  }

  * {
    // Les éléments positionnés explicitement sont toujours au dessus des autres !
    // La ligne ci-dessous permet donc de positionner le contenu du tableau au dessus
    // de l'image d'arrière plan qui a elle une position 'absolute'.
    position: relative;
  }

  .row {
    display: flex;
    margin-bottom: 20px;
  }

  .row > .col {
    width: 50%;
    &:first-child {
      margin-right: 15px;
    }

    &:last-child {
      margin-left: 15px;
    }
  }

  .séparateur-vertical {
    width: 1px;
    flex-shrink: 0;
    align-self: stretch;
    background-color: rgba(black, 0.5);
  }

  &.xs,
  &.sm {
    .row {
      flex-direction: column;
    }

    .séparateur-vertical {
      display: none;
    }

    .row > .col {
      width: 100%;
      margin: 0;
    }
  }
}

.nom-image-compositeur {
  color: black;
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
    display: none;
    max-height: 150px;
    width: auto;
    border-radius: 10px;
  }
}
</style>
