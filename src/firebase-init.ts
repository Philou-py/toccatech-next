import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

export function firebaseInit() {
  // Configuration Firebase de "Ma Partothèque Web App"
  // Pour Firebase JS SDK v7.20.0 et plus récent, measurementId est optionnel.
  var firebaseConfig = {
    apiKey: "AIzaSyDMFv7oim1fdKPFDcS2UWlkGWuWbJB2o7Y",
    authDomain: "ma-partotheque.firebaseapp.com",
    projectId: "ma-partotheque",
    storageBucket: "ma-partotheque.appspot.com",
    messagingSenderId: "927607267863",
    appId: "1:927607267863:web:3bf5e5473fb613b3167252",
    measurementId: "G-6Z426JCVZB",
  };

  // Initialisation de Firebase
  firebase.initializeApp(firebaseConfig);

  // Tentative d'activation du mode hors-ligne de firestore
  firebase
    .firestore()
    // L'option "synchronizeTabs" permet la synchronisation du cache pour tous
    // les onglets dans lesquels l'application est ouverte
    .enablePersistence({ synchronizeTabs: true })
    .then(() => {
      console.log("Le mode hors-ligne a bien été activé!");
    })
    .catch((err) => {
      if (err.code == "failed-precondition") {
        // Message d'erreur si l'option "synchronizeTabs" est à false et que l'application
        // est ouverte dans plusieurs onglets
        console.log(`L'application est ouverte dans plusieurs onglets à la fois!
        Le mode hors-ligne ne peut pas être activé!`);
      } else if (err.code == "unimplemented") {
        // Message d'erreur si le navigateur ne supporte pas le mode hors-ligne
        console.log("Votre navigateur ne supporte pas le mode hors-ligne!");
      }
    });

  // Initialisation de Firebase Analytics
  firebase.analytics();
}
