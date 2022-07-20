const browserEnv = require("browser-env")
const {initializeApp} = require("firebase/app");

browserEnv(['navigator']);

const firebaseConfig = {
  apiKey: "AIzaSyBjO6CkSyV4TxDItWRPsNn1JTlzgTqbOGI",
  authDomain: "groundapp-94b04.firebaseapp.com",
  projectId: "groundapp-94b04",
  storageBucket: "groundapp-94b04.appspot.com",
  messagingSenderId: "99090239827",
  appId: "1:99090239827:web:1bdde7d089ad3a3b3551a6",
  measurementId: "G-JEKG4Y0SF7"
};

const app = initializeApp(firebaseConfig);

module.exports = app;