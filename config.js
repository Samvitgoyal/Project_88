import firebase from 'firebase';
require('@firebase/firestore');

 var firebaseConfig = {
    apiKey: "AIzaSyCdLujdenRH5J420QazWJA546CtCidjIYQ",
    authDomain: "barter-app-80150.firebaseapp.com",
    projectId: "barter-app-80150",
    storageBucket: "barter-app-80150.appspot.com",
    messagingSenderId: "46009719108",
    appId: "1:46009719108:web:d025d95457be8bb9aadf11",
    measurementId: "G-4CSFKQBTLE"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

  export default firebase.firestore();
