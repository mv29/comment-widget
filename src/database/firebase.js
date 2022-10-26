import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const Database = getFirestore(app)

export default Database;
