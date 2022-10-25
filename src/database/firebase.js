import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBsHZDUCZqmkwCYdETVkKZXpykqY33IphU",
    authDomain: "comment-widget-ff3cb.firebaseapp.com",
    projectId: "comment-widget-ff3cb",
    storageBucket: "comment-widget-ff3cb.appspot.com",
    messagingSenderId: "350738105853",
    appId: "1:350738105853:web:ae51832f4df16c52f64594"
  };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const Database = getFirestore(app)

export default Database;