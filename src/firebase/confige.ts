//firebase/confige.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "shopify-productlisting.firebaseapp.com",
    projectId: "shopify-productlisting",
    storageBucket: "shopify-productlisting.appspot.com",
    messagingSenderId: "458476600326",
    appId: "1:458476600326:web:b94c1045908b03427e1787",
    measurementId: "G-91MMJ1LZL1"
};

export const app = initializeApp(firebaseConfig);

type FirebaseStorage = ReturnType<typeof getStorage>;
export const storage: FirebaseStorage = getStorage(app);