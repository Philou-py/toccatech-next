<template>
  <Carte class="carte-connexion" :largeur="400">
    <h3 class="titre-carte">Connexion</h3>
    <div class="contenu-carte">
      <Formulaire v-model="formulaireValide" class="formulaire-connexion">
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
      </Formulaire>
    </div>
    <div class="actions-carte">
      <a v-if="changerComposant" class="lien" @click="changerComposant('FormulaireInscription')">
        Pas de compte ?
      </a>
      <Espacement />
      <Bouton
        class="blue darken-3"
        :désactivé="!formulaireValide || chargement"
        :titre="titreBouton"
        @click="validerConnexion()"
        texte
      >
        {{ messageBouton }}
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
    préfixeIdInput: {
      type: String,
      default: "connexion",
    },
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
    afficherMessage: false,
    email: "",
    motDePasse: "",
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
    validerConnexion() {
      this.chargement = true;
      auth
        .signInWithEmailAndPassword(this.email, this.motDePasse)
        .then((userCredential) => {
          this.chargement = false;
          this.$emit("messageConnexionInscription", {
            valeur: `Bonjour, ${userCredential.user!.displayName} !`,
            succès: true,
          });
        })
        .catch((erreur) => {
          this.chargement = false;
          let messageErreur = "";
          if (erreur.code == "auth/wrong-password") {
            messageErreur = "Erreur : le mot de passe est erroné.";
          } else if (erreur.code == "auth/user-not-found") {
            messageErreur =
              "Erreur : l'adresse email ne correspond à aucun utilisateur enregistré.";
          } else if (erreur.code == "auth/network-request-failed") {
            messageErreur =
              "Erreur : vous devez disposer d'une connection Internet pour effectuer cette action.";
          } else {
            messageErreur = erreur; // Utiliser error.message pour avoir seulement le message
          }
          this.$emit("messageConnexionInscription", { valeur: messageErreur, succès: false });
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
