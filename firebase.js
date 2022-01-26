// Import the functions you need from the SDKs you need
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyCNXcLmSdPKlFFmgVlUPFQLebtSxTqg32g',
    authDomain: 'bda-cali-test.firebaseapp.com',
    projectId: 'bda-cali-test',
    storageBucket: 'bda-cali-test.appspot.com',
    messagingSenderId: '918909202204',
    appId: '1:918909202204:web:6019244b358a819edc14d9',
    measurementId: 'G-318J6D1P95',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, app, db };
