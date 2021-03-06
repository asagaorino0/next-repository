// import React, { useState, useEffect } from 'react';
// import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth } from 'firebase/auth'
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore, } from 'firebase/firestore'
require('dotenv').config();
// import { TomareState } from "./types/tomare";
// import { app } from "../firebase"
// import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore'
// import { initializeFirestore } from 'firebase/firestore'
// import { getFirestore } from "firebase/firestore"
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getAuth, signInWithRedirect, signOut, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DBURL,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID,
};


const app = getApps
if (!app.length) {
    initializeApp(firebaseConfig)
}
console.log('firebase', firebaseConfig)
const storage = getStorage();
// const db = getFirestore()
const firebaseAuth = getAuth()
export { app, firebaseAuth, db, firebaseConfig, storage }

// const app = initializeApp(firebaseConfig);
const db = getFirestore();