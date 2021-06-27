<template>
  <div
    class="champ-texte"
    :class="{
      désactivé: désactivé,
      focus: focus,
      actif: actif,
      champVide: champVide,
      champRequisVide: champRequisVide,
      valide: champValide,
      invalide: !champValide,
      sélectionnable: typeInput == 'select',
    }"
    ref="champTexte"
  >
    <div class="avant-champ-texte" v-if="icôneDevant">
      <span class="material-icons icône-devant" @click="$emit('icône-devant:clic')">{{
        icôneDevant
      }}</span>
    </div>
    <label
      :for="idInput"
      v-if="label"
      :class="{ 'label-à-gauche': typeInput == 'textarea' }"
      ref="label"
      >{{ label }}</label
    >
    <div class="contenu">
      <input
        v-if="typeInput != 'textarea' && typeInput != 'select'"
        :type="typeInput"
        :disabled="désactivé"
        :id="idInput"
        :data-placeholder="placeholder"
        :required="requis"
        ref="input"
        :value="valeurInput"
        @focus="gérerFocus()"
        @blur="gérerBlur($event.target.value)"
        @input="émettreEvénement($event.target.value)"
      />
      <div v-if="typeInput == 'select'" class="container-sélecteur">
        <div class="container-sélection">
          <div v-if="actif">{{ valeurInput }}</div>
        </div>
        <div class="container-svg"></div>
        <span class="container-flèche material-icons">arrow_drop_down</span>
        <transition name="fade">
          <ul v-if="selectActif" class="menu-déroulant">
            <li v-for="item in items" :key="item" @click="émettreEvénement(item)">
              {{ item }}
            </li>
          </ul>
        </transition>
      </div>
      <textarea
        v-if="typeInput == 'textarea'"
        :disabled="désactivé"
        :id="idInput"
        :required="requis"
        ref="input"
        :value="valeurInput"
        @focus="gérerFocus()"
        @blur="gérerBlur($event.target.value)"
        @input="
          émettreEvénement($event.target.value);
          redimensionnerInput();
        "
      ></textarea>
      <div class="ligne" ref="ligne"></div>
      <div class="indices">
        <!-- Utilisation de v-html pour que le contenu de la balise 'div' soit interprété -->
        <!-- comme du code HTML et non comme du texte pur -->
        <div class="messages" v-html="message"></div>
        <!-- Le compteur n'est affiché que si une longueur maximale est renseignée -->
        <div class="compteur" v-if="longueurMax">{{ nbCaractères }} / {{ longueurMax }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/ChampTexte.scss";
</style>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BusEvénements } from "@/BusEvénements";

export default Vue.extend({
  model: {
    prop: "valeurInput",
    event: "input",
  },

  props: {
    label: String,

    désactivé: {
      type: Boolean,
      default: false,
    },

    valeurInput: {
      type: String,
      default: "",
    },

    invalide: {
      type: Boolean,
      default: false,
    },

    vide: {
      type: Boolean,
      default: false,
    },

    requisEtVide: {
      type: Boolean,
      default: false,
    },

    hauteur: String,

    préfixeIdInput: String,

    placeholder: String,

    icôneDevant: String,

    // L'attribut 'dense' produit un effet seulement si aucun label n'est présent.
    dense: Boolean,

    items: {
      type: Array as PropType<Array<string>>,
    },

    sélectionDéfaut: Number,

    type: {
      type: String,
      default: "texte",
      // Ce validateur permet de restreindre les valeurs possibles pour la variable 'type'
      // aux types de champs de texte pris en charge par ce composant.
      validator(valeur: string) {
        return ["texte", "mot-de-passe", "email", "date", "textarea", "sélecteur"].includes(valeur);
      },
    },

    longueurMax: Number,

    longueurMin: Number,

    requis: {
      type: Boolean,
      default: false,
    },

    // Les règles de validation personnalisées doivent être données sous forme d'un Array
    // de fonctions retournant soit 'true' si la valeur passée en paramètre correspond à la règle
    // de validation, soit le message à afficher le cas échéant.
    règlesValidation: Array as PropType<Array<(valeur: string) => true | string>>,
  },

  data: () => ({
    // Cette propriété permet au composant 'Formulaire' de déterminer si le composant doit être pris en
    // compte à la validation de tout le formulaire.
    élémentFormulaire: true,
    actif: false,
    focus: false,
    champValide: true,
    champVide: false,
    champRequisVide: false,
    // Initialisation de message avec un espace insécable pour éviter un changement
    // de position du champ de texte à l'apparition d'un message
    message: "&nbsp;",
    selectActif: false,
  }),

  watch: {
    // Ce watcher permet d'enlever et d'ajouter l'état 'actif' si la valeur de l'input a été changé
    // dans le composant parent, c'est-à-dire à travers 'v-model' qui change la prop
    // 'valeurInput' sans déclencher l'événement 'blur' ou 'focus'.
    valeurInput: function (nouvelleValeur) {
      if (nouvelleValeur) {
        this.actif = true;
      } else if (!this.focus && this.typeInput != "date") {
        this.actif = false;
      }
      this.champValide = this.validerChamp();
      this.émettreEvénement(nouvelleValeur);
    },

    // Valider le formulaire si l'état de validité change
    // ou si un champ requis ne devient plus vide
    champValide: function () {
      this.émettreFormulaireAValider();
    },
    champRequisVide: function () {
      this.émettreFormulaireAValider();
    },

    invalide: function (nouvelleValeur) {
      this.champValide = nouvelleValeur ? false : this.validerChamp();
      console.log(nouvelleValeur);
    },
  },

  computed: {
    // Les fonctions de l'objet 'computed' doivent être annotées avec le type
    // de retour de la fonction pour que TypeScript ne donne pas d'erreur.
    // Voir la documentation : https://fr.vuejs.org/v2/guide/typescript.html#Annotation-des-types-de-retour
    idInput(): string {
      if (this.préfixeIdInput) {
        if (this.label) {
          return this.préfixeIdInput + "-" + this.label.toLowerCase().replace(/ /g, "-");
        } else if (this.placeholder) {
          return this.préfixeIdInput + "-" + this.placeholder.toLowerCase().replace(/ /g, "-");
        } else {
          return this.préfixeIdInput;
        }
      } else {
        if (this.label) {
          return this.label.toLowerCase().replace(/ /g, "-");
        } else if (this.placeholder) {
          return this.placeholder.toLowerCase().replace(/ /g, "-");
        } else {
          return "champ-texte";
        }
      }
    },

    typeInput(): string {
      if (this.type == "email") return "email";
      else if (this.type == "mot-de-passe") return "password";
      else if (this.type == "date") return "date";
      else if (this.type == "textarea") return "textarea";
      else if (this.type == "sélecteur") return "select";
      else return "text";
    },

    nbCaractères(): number {
      return this.valeurInput.length;
    },
  },

  methods: {
    émettreFormulaireAValider() {
      BusEvénements.$emit("état-validité-à-vérifier");
    },

    émettreEvénement(valeurInput: string) {
      this.$emit("input", valeurInput);
      // this.émettreFormulaireAValider();
    },

    validerChamp(): boolean {
      // Application de la validation prioritaire venant du composant parent
      if (this.invalide) {
        if (this.vide) {
          this.champVide = true;
          if (this.requisEtVide) {
            this.champRequisVide = true;
          }
        }
        return false;
      }

      // Tests de la longueur
      if (!this.valeurInput) {
        this.champVide = true;
        this.message = "&nbsp;";
        if (this.requis) {
          this.champRequisVide = true;
          return true;
        }
        return true;
      } else {
        this.champVide = false;
        this.champRequisVide = false;
        if (this.longueurMin && this.nbCaractères < this.longueurMin) {
          this.message = `Longueur min : ${this.longueurMin}`;
          return false;
        } else if (this.longueurMax && this.nbCaractères > this.longueurMax) {
          this.message = `Longueur max : ${this.longueurMax}`;
          return false;
        } else if (!this.longueurMax && this.typeInput != "textarea" && this.nbCaractères > 100) {
          // Limite du nombre de caractères à 100 pour éviter les abus
          this.message = "Longueur max : 100";
          return false;
        }
      }

      // Validation si le champ est une l'adresse email
      if (this.type == "email") {
        if (!this.règlesValidation) {
          if (/.+@.+\..+/.test(this.valeurInput) == false) {
            this.message = "Adresse email invalide";
            return false;
          }
        } else {
          this.règlesValidation.forEach((règle) => {
            var résultatValidité = règle(this.valeurInput);
            if (résultatValidité != true) {
              this.message = résultatValidité;
              return false;
            }
          });
        }
      }

      // Tous les tests ont réussi, le champ est valide, donc le message est réinitialisé
      // à un espace insécable pour ne pas changer le champ de texte de position à cause
      // d'une absence de contenu.
      this.message = "&nbsp;";
      return true;
    },

    gérerFocus() {
      // La référence au champ de texte dans le DOM doit être stockée dans une variable
      // pour pouvoir lui attribuer le type 'HTMLInputElement' afin que TypeScript identife
      // les méthodes disponibles sur cet objet.
      const input = this.$refs.input as HTMLInputElement;
      this.actif = true;
      this.focus = true;
      if (input.getAttribute("data-placeholder") && this.label) {
        input.setAttribute("placeholder", input.getAttribute("data-placeholder")!);
      }
    },

    // L'événement 'blur' est le contraire de 'focus' : il se produit lorsque l'utilisateur
    // sort du champ de texte en cliquant autre part, par exemple.
    gérerBlur(valeurInput: string) {
      const input = this.$refs.input as HTMLInputElement;
      if (!valeurInput && this.typeInput != "date") {
        this.actif = false;
        this.focus = false;
        if (input.getAttribute("data-placeholder") && this.label) {
          input.removeAttribute("placeholder");
        }
      } else {
        this.focus = false;
      }
    },

    redimensionnerInput() {
      const input = this.$refs.input as HTMLInputElement;
      input.style.height = "auto";
      // Ajout de 2 pixels pour qu'une scrollbar n'apparaisse pas par défaut
      input.style.height = input.scrollHeight + 2 + "px";
    },

    gérerClicBody(événement: MouseEvent) {
      let champTexte = this.$refs.champTexte as HTMLDivElement;
      let élémentCliqué = événement.target as HTMLElement;
      if (champTexte.contains(élémentCliqué) && !this.selectActif) {
        this.selectActif = true;
        this.actif = true;
        this.focus = true;
      } else {
        this.selectActif = false;
        this.focus = false;
        if (!this.valeurInput) {
          this.actif = false;
        }
      }
    },
  },

  mounted() {
    if (this.typeInput == "date") {
      this.actif = true;
    }

    // Validation initiale du champ de texte en fonction des props renseignées
    this.validerChamp();

    const input = this.$refs.input as HTMLInputElement;
    if (!this.label) {
      // Si aucun label n'est détecté mais qu'un placeholder est spécifié,
      // ce-dernier doit être affiché tout le temps, et non seulement lorsque le champ
      // de texte a le focus (et que le label est au-dessus, ne masquant pas le placeholder).
      if (this.placeholder) input.setAttribute("placeholder", this.placeholder);

      // L'attribut 'dense' produit un effet seulement si aucun label n'est présent.
      if (this.dense) {
        input.style.paddingTop = "5px";
      }
    }

    if (this.typeInput == "textarea") {
      input.style.height = this.hauteur;
    }

    if (this.typeInput == "select") {
      if (this.sélectionDéfaut) {
        this.émettreEvénement(this.items[this.sélectionDéfaut]);
      }
      document.addEventListener("click", this.gérerClicBody);
    }
  },

  destroyed() {
    if (this.typeInput == "select") {
      document.removeEventListener("click", this.gérerClicBody);
    }
  },
});
</script>
