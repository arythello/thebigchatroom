import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace the following with your app's Firebase project configuration
// You can find this in the Firebase Console -> Project Settings -> General -> Your apps
const firebaseConfig = {
    apiKey: "AIzaSyAHKctzmY1NwkYGGLPyptn67q4tUI2mP1s",
    authDomain: "thebigchatroom-170a2.firebaseapp.com",
    projectId: "thebigchatroom-170a2",
    storageBucket: "thebigchatroom-170a2.firebasestorage.app",
    messagingSenderId: "927340059774",
    appId: "1:927340059774:web:608435e27ecdf56cad4c2f",
    measurementId: "G-QTRWWBRH6C"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
