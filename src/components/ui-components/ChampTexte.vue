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
      'd-block': block,
    }"
  >
    <div class="avant-champ-texte" v-if="icôneDevant">
      <span class="material-icons icône-devant" @click="$emit('icône-devant:clic')">{{
        icôneDevant
      }}</span>
    </div>
    <div class="contenu">
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
        @input="émettreEvénements($event.target.value)"
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
  </div>
</template>

<style lang="scss">
@mixin changerThème($couleur-thème) {
  input {
    caret-color: $couleur-thème;
    border-color: $couleur-thème;
  }

  .icône-devant,
  label {
    color: $couleur-thème;
  }

  .ligne {
    background-color: $couleur-thème;
  }

  .messages {
    color: $couleur-thème;
  }

  .compteur {
    color: $couleur-thème;
  }

  &:hover {
    input {
      border-color: darken($couleur-thème, 10%);
    }

    .ligne {
      background-color: darken($couleur-thème, 10%);
    }

    .icône-devant,
    label {
      color: darken($couleur-thème, 10%);
    }

    .messages {
      color: darken($couleur-thème, 10%);
    }

    .compteur {
      color: darken($couleur-thème, 10%);
    }
  }
}
.champ-texte {
  position: relative;
  display: flex;
  padding: 16px 0 2px;
  min-width: 230px;
  font-size: 18px;

  .avant-champ-texte {
    // Taille fixe pour l'icône (l'icône a la forme d'un carré de 24px de côté)
    width: 30px; // 24 + 6 = 36px
    height: 24px;
    padding: 2px 6px 0 0;
    // L'icône ne doit pas prendre moins de place, même si le composant rétrécit.
    flex-shrink: 0;

    .icône-devant {
      color: rgba(black, 0.6);
      transition: all 0.3s;
    }
  }

  .contenu {
    flex: 1 1 206px;
  }

  &.d-block {
    width: 100%;
  }

  input {
    border: none;
    // La fonction 'rgba', dans ce cas, permet de donner une opacité de 0.6 à la couleur black.
    border-bottom: 1px solid rgba(black, 0.6);
    border-radius: 0;
    font-size: 1em;
    outline: 0;
    width: 100%;
    padding: 1px 0 5px;
    transition: border-color 0.3s linear;

    &::placeholder {
      color: rgba(black, 0.5);
    }
  }

  label {
    font-size: 1em;
    position: absolute;
    top: 17px;
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

  &:hover {
    input {
      border-color: rgba(black, 0.9);
    }

    .ligne {
      background-color: rgba(black, 0.9);
    }

    .icône-devant,
    label {
      color: rgba(black, 0.9);
    }

    .compteur {
      color: rgba(black, 0.9);
    }
  }

  &.actif {
    label {
      top: 0px;
      font-size: 0.78em;
    }
  }

  &.focus {
    @include changerThème(#1867c0);

    .ligne {
      width: 100%;
    }
  }

  &.valide:not(.vide) {
    @include changerThème(#00c853);
  }

  &.invalide {
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
      animation-name: secouer;
      animation-duration: 0.9s;
    }

    @include changerThème(#ff5252);
  }

  &.champRequisVide {
    @include changerThème(#ea80fc); // #9c27b0
  }

  .indices {
    display: flex;
    height: 15px;
    width: 100%;
    font-size: 14px;
  }

  .messages {
    width: 80%;
    transition: all 0.3s;
  }

  .compteur {
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

    préfixeIdInput: String,

    placeholder: String,

    icôneDevant: String,

    // L'attribut 'dense' produit un effet seulement si aucun label n'est présent.
    dense: Boolean,

    block: Boolean,

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
        return this.préfixeIdInput + "-" + this.label.toLowerCase().replace(/ /g, "-");
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

  methods: {
    émettreEvénements(valeurInput: string) {
      this.$emit("input", valeurInput);
      BusEvénements.$emit("état-validité-à-vérifier");
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
