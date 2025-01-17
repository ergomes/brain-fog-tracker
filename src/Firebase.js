import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import { addDoc, getDocs, getFirestore, collection, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAgydIK35ul8MNtFFcaDkMvfTJnRdPBsFo",
    authDomain: "fog-tracker.firebaseapp.com",
    projectId: "fog-tracker",
    storageBucket: "fog-tracker.appspot.com",
    messagingSenderId: "997079302557",
    appId: "1:997079302557:web:39445239f281a14aeb2f74"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const currentUser = auth.currentUser;
const db = getFirestore(app);
const symptomCollectionRef = collection(db, 'symptoms');

export async function createUser(email, password) {
    if (!email || !password) {
        throw new Error("Email or password is invalid");
    }

    if (currentUser) {
        throw new Error("User already exists.");
    }

    const response = await createUserWithEmailAndPassword(auth, email, password);

    const userResponse = await response.user;
    if (!userResponse) {
        throw new Error("Something went wrong creating the user.");
    }

    const userUID = userResponse.uid;
    if (!userUID) {
        throw new Error("Something went wrong creating the uid.");
    }
}

export async function logInUser(email, password) {
    if (!email || !password) {
        throw new Error('Email or password is invalid');
    }

    if (currentUser) {
        throw new Error('Already logged in');
    }

    const response = await signInWithEmailAndPassword(auth, email, password)

    const userResponse = await response.user;
    if (!userResponse) {
      throw new Error('There is no user record corresponding to this identifier. The user may have been deleted.');
    }

    const userUID = userResponse.uid;
    if (!userUID) {
        throw new Error('Something went wrong with the uid');
    }
}

export async function logOut() {
    await signOut(auth)
        .then(() => {})
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("error code sing out: ", errorCode);
            console.log("error message sign out: ", errorMessage);
        });
}

export async function resetPassword(email) {
    if (!email) {
        throw new Error('Email is required.');
    }

    const response = await sendPasswordResetEmail(auth, email);
}

export async function registerSymptom(fogginess, anxiety, headache, fatigue, gut, date) {
    await addDoc(symptomCollectionRef, {
        fogginess,
        anxiety,
        headache,
        fatigue,
        gut,
        date,
        userId: auth.currentUser.uid,
    });
}

export async function getSymptoms(setData) {
    const data = await getDocs(symptomCollectionRef);
    setData(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
}

export async function removeSymptom(id) {
    const symp = doc(db, 'symptoms', id);
    await deleteDoc(symp);
}
