import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { 
  getAuth, 
  signOut, 
  signInAnonymously, 
  setPersistence, 
  browserLocalPersistence, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); 

function setAuthListeners(onLogin, onLogout) {
  onAuthStateChanged(auth, user => {
    if (user) {
      onLogin(user);
    } else {
      onLogout();
    }
  });
}

async function signIn() {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in :', error.message);
    throw error; 
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error.message);
    throw error; 
  }
}

export { auth, setAuthListeners, signIn, logout };
