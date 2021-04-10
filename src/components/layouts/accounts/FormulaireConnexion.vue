<template>
  <Carte :largeur-max="400" class="carte-connexion">
    <h1 class="titre-carte">Connexion</h1>
    <div class="contenu-carte">
      <Formulaire v-model="formulaireValide" class="formulaire-connexion">
        <ChampTexte
          label="Adresse mail"
          préfixeIdInput="connexion"
          icône-devant="account_circle"
          placeholder="vous@domaine.tld"
          type="email"
          requis
          block
          v-model="email"
        />
        <ChampTexte
          label="Mot de passe"
          préfixeIdInput="connexion"
          icône-devant="lock"
          type="mot-de-passe"
          :longueur-min="4"
          requis
          block
          v-model="motDePasse"
        />
      </Formulaire>
    </div>
    <div class="actions-carte">
      <router-link :to="{ name: 'Accueil' }">Pas de compte ?</router-link>
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
  margin-left: auto;
  margin-right: auto;

  .titre-carte {
    text-align: center;
  }
}
</style>
