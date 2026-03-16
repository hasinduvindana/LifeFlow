import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    getDocs,
    limit,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCmyDQQg8InBs3U2oDbgHZ2IVpFofi73So",
    authDomain: "lifeflow-2b6fd.firebaseapp.com",
    projectId: "lifeflow-2b6fd",
    storageBucket: "lifeflow-2b6fd.firebasestorage.app",
    messagingSenderId: "613310592275",
    appId: "1:613310592275:web:b0b9b0e23ad1c908a896e6",
    measurementId: "G-M3MW6XN2SH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

isSupported().then((supported) => {
    if (supported) {
        getAnalytics(app);
    }
}).catch((error) => {
    console.warn("Firebase analytics is unavailable in this environment.", error);
});

window.lifeFlowFindAdmin = async (userName, password) => {
    const adminQuery = query(
        collection(db, "admin"),
        where("userName", "==", userName),
        where("password", "==", password),
        limit(1)
    );

    const snapshot = await getDocs(adminQuery);

    if (snapshot.empty) {
        return null;
    }

    return snapshot.docs[0].data();
};
