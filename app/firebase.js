import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyCHgZKUXMMI-07Z8XGKiT5CdWJh3vjiB88",
  authDomain: "esp32-b397f.firebaseapp.com",
  databaseURL: "https://esp32-b397f-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "esp32-b397f",
  storageBucket: "esp32-b397f.appspot.com",
  messagingSenderId: "296250017017",
  appId: "1:296250017017:web:02ea6abb8268bdf50bce28",
  measurementId: "G-V0N5R263Y0"
};

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const database = getDatabase(app);

export {db, database}