import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInAnonymously, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import firebaseConfig from "./firebaseConfig.js";

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

function setAuthListeners(onLogin, onLogout) {
  onAuthStateChanged(auth, (user) => {
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
    await signInAnonymously(auth);
  } catch (error) {
    console.error('Error signing in:', error);
  }
}

async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
  }
}

function setLoggedInUI(user) {
  M.toast({ html: 'Logged In!' });
  document.querySelector('#loginBtn').style.display = 'none';
  document.querySelector('#logoutBtn').style.display = 'inline-block';
}

function setLoggedOutUI() {
  M.toast({ html: 'Logged Out!' });
  document.querySelector('#loginBtn').style.display = 'inline-block';
  document.querySelector('#logoutBtn').style.display = 'none';
}

document.querySelector('#loginBtn').addEventListener('click', signIn);
document.querySelector('#logoutBtn').addEventListener('click', logout);

setAuthListeners(setLoggedInUI, setLoggedOutUI);
