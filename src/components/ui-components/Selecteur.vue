<template>
  <div>
    <div class="avant-champ-texte" v-if="icôneDevant">
      <span class="material-icons icône-devant" @click="$emit('icône-devant:clic')">{{
        icôneDevant
      }}</span>
    </div>
    <div class="contenu">
      <label :for="idInput" v-if="label" ref="label">{{ label }}</label>
      <div class="container-input" v-if="!(typeInput == 'textarea')">
        <input
          :type="typeInput"
          :disabled="désactivé"
          :id="idInput"
          :data-placeholder="placeholder"
          :required="requis"
          ref="input"
          :value="valeurInput"
          @focus="gérerFocus()"
          @blur="gérerBlur($event.target.value)"
          @input="émettreEvénements($event.target.value)"
        />
        <div v-if="typeInput == 'select'" class="container-svg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
            class="svgFlèche"
          >
            <path d="M7,10L12,15L17,10H7Z"></path>
          </svg>
        </div>
        <ul v-if="selectActif" class="menu-déroulant">
          <li>Ludwig van Beethoven</li>
          <li>Wolfgang Amadeus Mozart</li>
          <li>Gabriel Fauré</li>
        </ul>
      </div>
      <textarea
        v-else
        :disabled="désactivé"
        :id="idInput"
        :required="requis"
        ref="input"
        :value="valeurInput"
        @focus="gérerFocus()"
        @blur="gérerBlur($event.target.value)"
        @input="
          émettreEvénements($event.target.value);
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
