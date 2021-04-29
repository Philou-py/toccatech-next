<template>
  <Carte class="carte-inscription" :largeur="450">
    <h3 class="titre-carte">Créer un compte</h3>
    <div class="contenu-carte">
      <Formulaire v-model="formulaireValide" class="formulaire-inscription">
        <ChampTexte label="Nom" icône-devant="face" requis v-model="nom" />
        <ChampTexte
          label="Adresse mail"
          :préfixeIdInput="préfixeIdInput"
          icône-devant="account_circle"
          placeholder="vous@domaine.tld"
          type="email"
          requis
          v-model="email"
        />
        <ChampTexte
          label="Mot de passe"
          :préfixeIdInput="préfixeIdInput"
          icône-devant="lock"
          type="mot-de-passe"
          :longueur-min="4"
          requis
          v-model="motDePasse"
        />
        <SelecteurFichiers
          label="Téléchargez votre avatar"
          icône-devant="face"
          accept="image/*"
          v-model="fichierAvatar"
        ></SelecteurFichiers>
      </Formulaire>
    </div>
    <div class="actions-carte">
      <a v-if="changerComposant" class="lien" @click="changerComposant('FormulaireConnexion')">
        Déjà un compte ?
      </a>
      <Espacement />
      <Bouton
        class="blue darken-3"
        :désactivé="!formulaireValide || chargement"
        :titre="titreBouton"
        @click="validerInscription()"
        texte
      >
        {{ messageBouton }}
      </Bouton>
    </div>
  </Carte>
</template>

<script lang="ts">
import Vue from "vue";
import { auth, db, storage } from "@/firebase";
import Carte from "@/components/ui-components/Carte.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";
import SelecteurFichiers from "@/components/ui-components/SelecteurFichiers.vue";

export default Vue.extend({
  components: {
    Carte,
    ChampTexte,
    Formulaire,
    Bouton,
    Espacement,
    SelecteurFichiers,
  },

  props: {
    changerComposant: Function,
    préfixeIdInput: {
      type: String,
      default: "inscription",
    },
  },

  data: () => ({
    formulaireValide: false,
    chargement: false,
    nom: "",
    email: "",
    motDePasse: "",
    fichierAvatar: null as any,
  }),

  computed: {
    messageBouton(): string {
      if (this.chargement) return "Chargement...";
      else return "Valider";
    },

    titreBouton(): string | undefined {
      if (!this.formulaireValide) return "Le formulaire n'est pas valide !";
      else return undefined;
    },
  },

  methods: {
    validerInscription() {
      this.chargement = true;
      auth
        .createUserWithEmailAndPassword(this.email, this.motDePasse)
        .then((userCredential) => {
          var uidUtilisateur = userCredential.user!.uid;
          userCredential.user!.updateProfile({
            displayName: this.nom,
          });
          if (this.fichierAvatar) {
            let refAvatar = storage.ref(`avatars_utilisateurs/${this.fichierAvatar.name}`);
            refAvatar
              .put(this.fichierAvatar, { cacheControl: "public,max-age: 432000" })
              .then((réponse) => {
                réponse.ref.getDownloadURL().then((url) => {
                  db.collection("utilisateurs")
                    .doc(uidUtilisateur)
                    .set({
                      uid_utilisateur: uidUtilisateur,
                      nom: this.nom,
                      email: this.email,
                      avatar: url,
                    })
                    .then(() => {
                      this.chargement = false;
                      this.$emit("messageConnexionInscription", {
                        valeur: "Votre compte a été créé avec succès !",
                        succès: true,
                      });
                    })
                    .catch((erreur) => {
                      this.chargement = false;
                      this.$emit("messageConnexionInscription", { valeur: erreur, succès: false });
                    });
                });
              });
          } else {
            db.collection("utilisateurs")
              .doc(uidUtilisateur)
              .set({
                uid_utilisateur: uidUtilisateur,
                nom: this.nom,
                email: this.email,
              })
              .then(() => {
                this.chargement = false;
                this.$emit("messageConnexionInscription", {
                  valeur: "Votre compte a été créé avec succès !",
                  succès: true,
                });
              })
              .catch((erreur) => {
                this.chargement = false;
                this.$emit("messageConnexionInscription", { valeur: erreur, succès: false });
              });
          }
        })
        .catch((error) => {
          this.chargement = false;
          let messageErreur = "";
          // Pour d'autres codes d'erreur: https://firebase.google.com/docs/reference/js/firebase.auth.Error
          if (error.code == "auth/email-already-in-use") {
            messageErreur = "Erreur : cette adresse email est déjà utilisée.";
          } else if (error.code == "auth/network-request-failed") {
            messageErreur =
              "Erreur : vous devez disposer d'une connection Internet pour effectuer cette action.";
          } else {
            messageErreur = error; // Use error.message to get only the message
          }
          this.$emit("messageConnexionInscription", { valeur: messageErreur, succès: false });
        });
    },
  },
});
</script>

<style lang="scss">
.carte-inscription {
  .titre-carte {
    text-align: center;
  }
}
</style>
