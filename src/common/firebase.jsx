import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAE1T4jzAzuB3bYwdOFLa3fVuqpMs1xEzA",
    authDomain: "react-js-blog-website-soumya.firebaseapp.com",
    projectId: "react-js-blog-website-soumya",
    storageBucket: "react-js-blog-website-soumya.appspot.com",
    messagingSenderId: "519539697447",
    appId: "1:519539697447:web:5e2193e2487adc60a16b02"
};

const app = initializeApp(firebaseConfig);


//google authDomain
const provider = new GoogleAuthProvider();

const auth = getAuth();

const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user
        })
        .catch((err) => {
            console.log(err)
        })

    return user;
}

export default authWithGoogle