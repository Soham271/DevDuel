import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyBwpQRHWdpbiCT4Ig4wimZ253kKlxq3PMo",
  authDomain: "jobautofiller.firebaseapp.com",
  projectId: "jobautofiller",
  storageBucket: "jobautofiller.firebasestorage.app",
  messagingSenderId: "98904350761",
  appId: "1:98904350761:web:df6d7f8c3385bd9222fc38",
  measurementId: "G-NPNJJ3F51L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
