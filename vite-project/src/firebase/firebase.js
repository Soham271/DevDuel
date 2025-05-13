import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBpqjBaP_nu8DOu5voDbtSqrJVvc84cv24",
  authDomain: "devduel-8871a.firebaseapp.com",
  projectId: "devduel-8871a",
  storageBucket: "devduel-8871a.firebasestorage.app",
  messagingSenderId: "1081091289266",
  appId: "1:1081091289266:web:3ed4f1189c83e6354dd9ab",
  measurementId: "G-9PDGXL30LL",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
