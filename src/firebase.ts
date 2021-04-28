import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
// import "firebase/analytics";

// Configuration Firebase de "Ma Partothèque Web App"
// Pour Firebase JS SDK v7.20.0 et plus récent, measurementId est optionnel.
const firebaseConfig = {
  apiKey: "AIzaSyD8wBizXwyRkwiwKSv67LE4TbKJMsTZvoo",
  authDomain: "toccatech-f8369.firebaseapp.com",
  projectId: "toccatech-f8369",
  storageBucket: "toccatech-f8369.appspot.com",
  messagingSenderId: "1025761438117",
  appId: "1:1025761438117:web:cdaa7d3df9a14127cc204c",
};

// Initialisation de Firebase
firebase.initializeApp(firebaseConfig);

// Initialisation de Firebase Authentication
export const auth = firebase.auth();

// Initialisation de Firestore et obtention d'une instance firestore
// Documentation : https://firebase.google.com/docs/firestore
export const db = firebase.firestore();

// Initialisation de Firebase Storage et obtention d'une instance storage
export const storage = firebase.storage();

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
// firebase.analytics();

// Exportation de types Firestore
export const { Timestamp, GeoPoint } = firebase.firestore;
