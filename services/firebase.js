import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, arrayRemove, arrayUnion, where, query,deleteDoc,collectionGroup } from 'firebase/firestore'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"
import { getDatabase, ref as realTimeRef, onValue, set,limitToLast, remove,get,child} from "firebase/database";
import { getStorage, ref, uploadBytes,listAll,getDownloadURL,uploadBytesResumable } from 'firebase/storage';

const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APPID    
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage();
const dbr = getDatabase(app)
const provider = new GoogleAuthProvider();

export { 
        db, provider,         
        collection, doc, getDoc, setDoc, updateDoc, arrayRemove, arrayUnion, getDocs, where, query, deleteDoc,collectionGroup,
        dbr,getDatabase, realTimeRef, onValue,set,limitToLast,remove,get,child,
        GoogleAuthProvider, getAuth, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail,
        storage, ref, uploadBytes,listAll,uploadBytesResumable,getDownloadURL
};
