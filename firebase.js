// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyAXWhM8kJOHYnMYZ0LYyRetyHexdC-E8JY',
    authDomain: 'cali-food-bank.firebaseapp.com',
    projectId: 'cali-food-bank',
    storageBucket: 'cali-food-bank.appspot.com',
    messagingSenderId: '76021301881',
    appId: '1:76021301881:web:94965765786184e2bf8aa8',
    measurementId: 'G-2EQPLX83Z5',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore();

export { app, auth, db };
