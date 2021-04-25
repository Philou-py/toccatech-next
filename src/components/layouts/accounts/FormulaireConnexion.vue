<template>
  <Carte class="carte-connexion" :largeur="400">
    <h3 class="titre-carte">Connexion</h3>
    <div class="contenu-carte">
      <Formulaire v-model="formulaireValide" class="formulaire-connexion">
        <ChampTexte
          label="Adresse mail"
          préfixeIdInput="connexion"
          icône-devant="account_circle"
          placeholder="vous@domaine.tld"
          type="email"
          requis
          v-model="email"
        />
        <ChampTexte
          label="Mot de passe"
          préfixeIdInput="connexion"
          icône-devant="lock"
          type="mot-de-passe"
          :longueur-min="4"
          requis
          v-model="motDePasse"
        />
      </Formulaire>
    </div>
    <div class="actions-carte">
      <a v-if="changerComposant" class="lien" @click="changerComposant('FormulaireInscription')">
        Pas de compte ?
      </a>
      <Espacement />
      <Bouton
        class="blue darken-3"
        :désactivé="!formulaireValide"
        texte
        @click="validerConnexion()"
      >
        Valider
      </Bouton>
    </div>
  </Carte>
</template>

<script lang="ts">
import Vue from "vue";
import { auth } from "@/firebase";
import Carte from "@/components/ui-components/Carte.vue";
import ChampTexte from "@/components/ui-components/ChampTexte.vue";
import Formulaire from "@/components/ui-components/Formulaire.vue";
import Bouton from "@/components/ui-components/Bouton.vue";
import Espacement from "@/components/ui-components/Espacement.vue";

export default Vue.extend({
  props: {
    changerComposant: Function,
  },

  components: {
    Carte,
    ChampTexte,
    Formulaire,
    Bouton,
    Espacement,
  },

  data: () => ({
    formulaireValide: false,
    chargement: false,
    messageRésultat: "",
    afficherMessage: false,
    email: "",
    motDePasse: "",
  }),

  methods: {
    validerConnexion() {
      auth
        .signInWithEmailAndPassword(this.email, this.motDePasse)
        .then((userCredential) => {
          this.$emit(
            "connexionInscriptionRéussie",
            `Bonjour, ${userCredential.user!.displayName} !`
          );
          console.log(`Bonjour, ${userCredential.user!.displayName} !`);
        })
        .catch((erreur) => {
          if (erreur.code == "auth/wrong-password") {
            this.messageRésultat = "Erreur : le mot de passe est erroné.";
          } else if (erreur.code == "auth/user-not-found") {
            this.messageRésultat =
              "Erreur : l'adresse email ne correspond à aucun utilisateur enregistré.";
          } else if (erreur.code == "auth/network-request-failed") {
            this.messageRésultat =
              "Erreur : vous devez disposer d'une connection Internet pour effectuer cette action.";
          } else {
            this.messageRésultat = erreur; // Utiliser error.message pour avoir seulement le message
          }
          console.log(this.messageRésultat);
        });
    },
  },
});
</script>

<style lang="scss">
.carte-connexion {
  .titre-carte {
    text-align: center;
  }
}
</style>
