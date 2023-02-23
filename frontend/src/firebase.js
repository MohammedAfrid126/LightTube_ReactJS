// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "REACT_APP_FIREBASE_API_KEY",
    authDomain: "video-bdc2c.firebaseapp.com",
    projectId: "video-bdc2c",
    storageBucket: "video-bdc2c.appspot.com",
    messagingSenderId: "390743227731",
    appId: "1:390743227731:web:53d1389978f0613539b5a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider(); 

export default app;