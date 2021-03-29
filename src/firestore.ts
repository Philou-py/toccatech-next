import firebase from "firebase/app";
import "firebase/firestore";

// Initialisation de Firestore et obtention d'une instance firestore
export const db = firebase.firestore();

// Exportation de types Firestore
const { Timestamp, GeoPoint } = firebase.firestore;
export { Timestamp, GeoPoint };
