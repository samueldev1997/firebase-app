import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBMJR9kLuiAMIkwTLeqcNdFvsSzGfvFjxY",
    authDomain: "curso-c2106.firebaseapp.com",
    projectId: "curso-c2106",
    storageBucket: "curso-c2106.appspot.com",
    messagingSenderId: "729299732919",
    appId: "1:729299732919:web:a4a7ad5ac601db97150032",
    measurementId: "G-74SPYDD5LQ"
  };


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp)

export { db, auth };