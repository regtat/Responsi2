import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATA2i7XOKQwPZo6jMpHcbEqi9rSA9cHuA",
  authDomain: "responsi-vue-firebase.firebaseapp.com",
  projectId: "responsi-vue-firebase",
  storageBucket: "responsi-vue-firebase.firebasestorage.app",
  messagingSenderId: "1006962307600",
  appId: "1:1006962307600:web:ccb06a38b317a9df52d095",
};

const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db }; //tambahin db
