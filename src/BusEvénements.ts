import Vue from "vue";

// Le 'Bus des Evénements' permet de faire communiquer des composants sans avoir
// forcément un lien de parenté entre eux.
export const BusEvénements = new Vue();
