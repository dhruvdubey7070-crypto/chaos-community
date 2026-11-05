import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXu3YgEiqnITmHMxjWp8XjxDXl1258qh8",
  authDomain: "chaos-community-9bced.firebaseapp.com",
  projectId: "chaos-community-9bced",
  storageBucket: "chaos-community-9bced.firebasestorage.app",
  messagingSenderId: "449022596964",
  appId: "1:449022596964:web:58b371194c219690cf0c71",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ---------- Navbar: Login / Logout link (har page pe apne aap lagta hai) ----------
const links = document.querySelector(".links");
let authLink = null;
if (links) {
  authLink = document.createElement("a");
  authLink.href = "login.html";
  authLink.textContent = "Login";
  links.appendChild(authLink);
}

onAuthStateChanged(auth, (user) => {
  if (!authLink) return;
  if (user) {
    const name = user.displayName || user.email.split("@")[0];
    authLink.textContent = "Logout (" + name + ")";
    authLink.href = "#";
    authLink.onclick = async (e) => {
      e.preventDefault();
      await signOut(auth);
      location.href = "index.html";
    };
  } else {
    authLink.textContent = "Login";
    authLink.href = "login.html";
    authLink.onclick = null;
  }
});

// ---------- Login page ka form (sirf login.html pe chalta hai) ----------
const form = document.getElementById("authForm");
if (form) {
  const title = document.getElementById("formTitle");
  const nameInput = document.getElementById("name");
  const submitBtn = document.getElementById("submitBtn");
  const toggleText = document.getElementById("toggleText");
  const msg = document.getElementById("msg");
  let isSignup = false;

  function render() {
    title.textContent = isSignup ? "Join Chaos 🔥" : "Wapas aa gaya? 😎";
    nameInput.style.display = isSignup ? "block" : "none";
    nameInput.required = isSignup;
    submitBtn.textContent = isSignup ? "Signup" : "Login";
    toggleText.innerHTML = isSignup
      ? 'Pehle se account hai? <a href="#" id="toggle">Login kar</a>'
      : 'Naya hai? <a href="#" id="toggle">Signup kar</a>';
    document.getElementById("toggle").onclick = (e) => {
      e.preventDefault();
      isSignup = !isSignup;
      msg.textContent = "";
      render();
    };
  }
  render();

  function friendlyError(code) {
    const map = {
      "auth/email-already-in-use": "Ye email pehle se registered hai. Login kar.",
      "auth/invalid-email": "Email sahi nahi hai.",
      "auth/weak-password": "Password kam se kam 6 characters ka rakh.",
      "auth/invalid-credential": "Email ya password galat hai.",
      "auth/user-not-found": "Ye account nahi mila. Pehle signup kar.",
      "auth/wrong-password": "Password galat hai.",
      "auth/too-many-requests": "Bahut try ho gaye, thodi der baad aa.",
    };
    return map[code] || "Kuch gadbad hui: " + code;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.style.color = "#ff2e63";
    msg.textContent = "Ruk ja...";
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      if (isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: nameInput.value.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      msg.style.color = "#4ade80";
      msg.textContent = "Done! Redirect ho raha hai...";
      setTimeout(() => (location.href = "index.html"), 800);
    } catch (err) {
      msg.textContent = friendlyError(err.code);
    }
  });
}