<template>
  <div
    class="champ-texte"
    :class="{
      focus: focus,
      actif: actif,
      vide: vide,
      champRequisVide: champRequisVide,
      valide: estValide,
      invalide: !estValide,
    }"
  >
    <label :for="idInput" v-if="label" ref="label">{{ label }}</label>
    <input
      :type="typeInput"
      :id="idInput"
      :data-placeholder="placeholder"
      :required="requis"
      ref="input"
      v-model="valeurInput"
      @focus="gérerFocus()"
      @blur="gérerBlur()"
    />
    <div class="ligne" ref="ligne"></div>
    <div class="indices">
      <!-- Utilisation de v-html pour que le contenu de la balise 'div' soit interprété -->
      <!-- comme du code HTML et non comme du texte pur -->
      <div class="messages" v-html="message"></div>
      <!-- Le compteur n'est affiché que si une longueur maximale est renseignée -->
      <div class="compteur" v-if="longueurMax">{{ nbCaractères }} / {{ longueurMax }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.champ-texte {
  position: relative;
  display: inline-block;
  padding: 16px 8px 2px;
  width: 230px;

  input {
    border: none;
    // La fonction 'rgba', dans ce cas, permet de donner une opacité de 0.6 à la couleur black.
    border-bottom: 1px solid rgba(black, 0.6);
    border-radius: 0;
    font-size: 16px;
    outline: 0;
    width: 100%;
    padding: 0 0 5px;
    transition: border-color 0.3s linear;

    &::placeholder {
      color: rgba(black, 0.5);
    }
  }

  label {
    font-size: 16px;
    position: absolute;
    top: 16px;
    cursor: text;
    color: rgba(black, 0.6);
    // Transition pour les propriétés 'top', 'color' et 'font-size'
    // Utiliser 'all' permet de moins écrire
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }

  .ligne {
    height: 2px;
    width: 0;
    position: relative;
    bottom: 2px;
    background-color: rgba(black, 0.6);
    transition: all 0.3s;
  }

  &:hover input {
    border-color: rgba(black, 0.9);
  }

  &.actif {
    label {
      top: 0px;
      font-size: 12px;
    }
  }

  &.focus {
    $couleur-champ-focus: #1867c0;
    input {
      caret-color: $couleur-champ-focus;
    }

    label {
      color: $couleur-champ-focus;
    }

    .ligne {
      background-color: $couleur-champ-focus;
      width: 100%;
    }
  }

  &.valide:not(.vide) {
    $couleur-champ-valide: #00c853;
    label {
      color: $couleur-champ-valide;
    }

    input {
      caret-color: $couleur-champ-valide;
      border-color: $couleur-champ-valide;
    }

    .ligne {
      background-color: $couleur-champ-valide;
    }

    &:hover input {
      border-color: darken($couleur-champ-valide, 15%);
    }
  }

  &.invalide {
    $couleur-champ-invalide: #ff5252;

    @keyframes secouer {
      0%,
      100% {
        transform: translateX(0);
      }

      10%,
      30%,
      50%,
      70%,
      90% {
        transform: translateX(-5px);
      }

      20%,
      40%,
      60%,
      80% {
        transform: translateX(5px);
      }
    }

    label {
      color: $couleur-champ-invalide;
      animation-name: secouer;
      animation-duration: 0.9s;
    }

    input {
      caret-color: $couleur-champ-invalide;
      border-color: $couleur-champ-invalide;
    }

    .ligne {
      background-color: $couleur-champ-invalide;
    }

    .messages {
      color: $couleur-champ-invalide;
    }

    .compteur {
      color: $couleur-champ-invalide;
    }

    &:hover input {
      border-color: darken($couleur-champ-invalide, 15%);
    }
  }

  &.champRequisVide {
    $couleur-champ-vide: #9c27b0;
    label {
      color: $couleur-champ-vide;
    }

    input {
      caret-color: $couleur-champ-vide;
      border-color: $couleur-champ-vide;
    }

    .ligne {
      background-color: $couleur-champ-vide;
    }

    &:hover input {
      border-color: darken($couleur-champ-vide, 15%);
    }
  }

  .indices {
    display: flex;
    height: 15px;
    width: 100%;
    font-size: 12px;
  }

  .messages {
    /* font-size: inherit; */
    width: 80%;
    transition: all 0.3s;
  }

  .compteur {
    /* font-size: inherit; */
    display: block;
    width: 20%;
    text-align: right;
    transition: all 0.3s;
  }
}
</style>

<script lang="ts">
import Vue, { PropType } from "vue";
import { BusEvénements } from "@/BusEvénements";

export default Vue.extend({
  props: {
    label: String,

    placeholder: String,

    // L'attribut 'dense' produit un effet seulement si aucun label n'est présent.
    dense: Boolean,

    type: {
      type: String,
      default: "texte",
      // Ce validateur permet de restreindre les valeurs possibles pour la variable 'type'
      // aux types de champs de texte pris en charge par ce composant.
      validator(value: string) {
        return ["texte", "mot-de-passe", "email"].includes(value);
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
    valeurInput: "",
    actif: false,
    focus: false,
    vide: false,
    champRequisVide: false,
    // Initialisation de message avec un espace insécable pour éviter un changement
    // de position du champ de texte à l'apparition d'un message
    message: "&nbsp;",
  }),

  computed: {
    // Les fonctions de l'objet 'computed' doivent être annotées avec le type
    // de retour de la fonction pour que TypeScript ne donne pas d'erreur.
    // Voir la documentation : https://fr.vuejs.org/v2/guide/typescript.html#Annotation-des-types-de-retour
    idInput(): string | undefined {
      if (this.label) {
        return this.label.toLowerCase().replace(/ /g, "-");
      } else {
        return undefined;
      }
    },

    typeInput(): string {
      if (this.type == "email") return "email";
      if (this.type == "mot-de-passe") return "password";
      else return "text";
    },

    nbCaractères(): number {
      return this.valeurInput.length;
    },

    estValide(): boolean {
      // Tests de la longueur
      if (!this.valeurInput) {
        this.vide = true;
        this.message = "&nbsp;";
        if (this.requis) {
          this.champRequisVide = true;
          return true;
        }
        return true;
      } else {
        this.vide = false;
        this.champRequisVide = false;
        if (this.longueurMin && this.nbCaractères < this.longueurMin) {
          this.message = `Longueur min : ${this.longueurMin}`;
          return false;
        } else if (this.longueurMax && this.nbCaractères > this.longueurMax) {
          this.message = `Longueur max : ${this.longueurMax}`;
          return false;
        } else if (this.nbCaractères > 100) {
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
  },

  watch: {
    estValide() {
      BusEvénements.$emit("changement-état-validité");
    },
  },

  methods: {
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
    gérerBlur() {
      const input = this.$refs.input as HTMLInputElement;
      if (!this.valeurInput) {
        this.actif = false;
        this.focus = false;
        if (input.getAttribute("data-placeholder") && this.label) {
          input.removeAttribute("placeholder");
        }
      } else {
        this.focus = false;
      }
    },
  },

  mounted() {
    // Ce test permet de passer les champs de texte en mode 'actif'
    // si le navigateur a complété ces champs automatiquement au
    // chargement de la page.
    if (this.valeurInput) {
      this.actif = true;
    }

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
  },
});
</script>
