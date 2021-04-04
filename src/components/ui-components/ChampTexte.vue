<template>
  <div class="champ-texte" :class="{ focus: focus, actif: actif }" ref="champTexte">
    <label :for="idInput" v-if="label" ref="label">{{ label }}</label>
    <input
      type="text"
      :id="idInput"
      :data-placeholder="placeholder"
      ref="input"
      v-model="valeurInput"
      @focus="gérerFocus()"
      @blur="gérerBlur()"
    />
    <div class="ligne" ref="ligne"></div>
  </div>
</template>

<style lang="scss">
.champ-texte {
  position: relative;
  padding: 0 8px;
  display: inline-block;

  input {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 0;
    font-size: 16px;
    outline: 0;
    padding: 16px 0 5px;
    transition: border-color 0.3s linear;

    &::placeholder {
      color: rgba(0, 0, 0, 0.5);
    }
  }

  label {
    font-size: 16px;
    position: absolute;
    top: 16px;
    cursor: text;
    color: rgba(0, 0, 0, 0.6);
    /* Transition pour les propriétés 'top' et 'font-size' */
    /* Utiliser 'all' permet de moins écrire */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }

  .ligne {
    height: 2px;
    width: 0;
    position: relative;
    bottom: 2px;
    background-color: rgba(0, 0, 0, 0.6);
    /* Transition pour les propriétés 'background-color' et 'width' */
    transition: all 0.3s;
  }

  &:hover input {
    border-color: rgba(0, 0, 0, 0.9);
  }

  &.actif {
    label {
      top: 0px;
      font-size: 12px;
    }
  }

  &.focus {
    input {
      caret-color: #1867c0;
    }
    label {
      color: #1867c0;
    }
    .ligne {
      background-color: #1867c0;
      width: 100%;
    }
  }

  &.invalid {
    label {
      color: #ff5252;
    }

    input {
      caret-color: #ff5252;
      border-color: #ff5252;
    }

    .ligne {
      background-color: #ff5252;
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: String,
    placeholder: String,
    dense: Boolean,
  },

  data: () => ({
    valeurInput: "",
    actif: false,
    focus: false,
  }),

  computed: {
    // Les fonctions de l'objet 'computed' doivent être annotées avec le type
    // de retour de la fonction, pour que TypeScript fonctionne.
    // Voir la documentation : https://fr.vuejs.org/v2/guide/typescript.html#Annotation-des-types-de-retour
    idInput(): string | undefined {
      if (this.label) {
        return this.label.toLowerCase().replace(/ /g, "-");
      } else {
        return undefined;
      }
    },
  },

  methods: {
    gérerFocus() {
      const input = this.$refs.input as HTMLInputElement;
      this.actif = true;
      this.focus = true;
      if (input.getAttribute("data-placeholder") && this.label) {
        input.setAttribute("placeholder", input.getAttribute("data-placeholder")!);
      }
    },

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

    if (this.placeholder && !this.label) {
      (this.$refs.input as HTMLInputElement).setAttribute("placeholder", this.placeholder);
      if (this.dense) {
        (this.$refs.input as HTMLInputElement).style.paddingTop = "5px";
      }
    }
  },
});
</script>
