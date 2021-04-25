<template>
  <Carte class="carte-inscription" :largeur="450">
    <h3 class="titre-carte">Créer un compte</h3>
    <div class="contenu-carte">
      <Formulaire v-model="formulaireValide" class="formulaire-inscription">
        <ChampTexte label="Nom" icône-devant="face" requis v-model="nom" />
        <ChampTexte
          label="Adresse mail"
          préfixeIdInput="inscription"
          icône-devant="account_circle"
          placeholder="vous@domaine.tld"
          type="email"
          requis
          v-model="email"
        />
        <ChampTexte
          label="Mot de passe"
          préfixeIdInput="inscription"
          icône-devant="lock"
          type="mot-de-passe"
          :longueur-min="4"
          requis
          v-model="motDePasse"
        />
      </Formulaire>
    </div>
    <div class="actions-carte">
      <a v-if="changerComposant" class="lien" @click="changerComposant('FormulaireConnexion')"
        >Déjà un compte ?</a
      >
      <Espacement />
      <Bouton
        class="blue darken-3"
        v-if="!formulaireValide"
        désactivé
        titre="Le formulaire n'est pas valide !"
        texte
      >
        Valider
      </Bouton>
      <Bouton v-else class="blue darken-3" texte @click="validerInscription()"> Valider </Bouton>
    </div>
  </Carte>
</template>

<script lang="ts">
import Vue from "vue";
import { auth, db } from "@/firebase";
import Carte from "@/components/ui-components/Carte.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";

export default Vue.extend({
  components: {
    Carte,
    ChampTexte,
    Formulaire,
    Bouton,
    Espacement,
  },

  props: {
    changerComposant: Function,
  },

  data: () => ({
    formulaireValide: false,
    chargement: false,
    messageRésultat: "",
    afficherMessage: false,
    nom: "",
    email: "",
    motDePasse: "",
  }),

  methods: {
    validerInscription() {
      auth
        .createUserWithEmailAndPassword(this.email, this.motDePasse)
        .then((userCredential) => {
          this.chargement = false;
          var uidUtilisateur = userCredential.user!.uid;
          userCredential.user!.updateProfile({
            displayName: this.nom,
          });
          db.collection("utilisateurs")
            .doc(uidUtilisateur)
            .set({ uid_utilisateur: uidUtilisateur, nom: this.nom, email: this.email })
            .then(() => {
              console.log(
                "Le document dans Firestore correspondant à votre compte a bien été créé !"
              );
            })
            .catch((erreur) => {
              console.log(erreur);
            });
          this.$emit("connexionInscriptionRéussie", "Votre compte a été créé avec succès !");
        })
        .catch((error) => {
          this.chargement = false;
          // Pour d'autres codes d'erreur: https://firebase.google.com/docs/reference/js/firebase.auth.Error
          if (error.code == "auth/email-already-in-use") {
            this.messageRésultat = "Erreur : cette adresse email est déjà utilisée.";
          } else if (error.code == "auth/network-request-failed") {
            this.messageRésultat =
              "Erreur : vous devez disposer d'une connection Internet pour effectuer cette action.";
          } else {
            this.messageRésultat = error; // Use error.message to get only the message
          }
          this.afficherMessage = true;
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
