import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // Importamos Auth
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBC7aMUkdSFqZyzwhrww-c-rNC5SA-ToB4",
  authDomain: "bayit-digital.firebaseapp.com",
  projectId: "bayit-digital",
  storageBucket: "bayit-digital.firebasestorage.app",
  messagingSenderId: "26474268934",
  appId: "1:26474268934:web:8bc021520b12a77ea4f687",
  measurementId: "G-CXML3PJ376"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// --- EXPORTACIONES CRÍTICAS ---
// Estas líneas permiten que tus botones de Google funcionen
export const auth = getAuth(app); 
export const googleProvider = new GoogleAuthProvider();

export default app;