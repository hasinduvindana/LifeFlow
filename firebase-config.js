import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics, isSupported } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import {
    addDoc,
    doc,
    getFirestore,
    collection,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
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

window.lifeFlowFetchDonors = async () => {
    const snapshot = await getDocs(collection(db, "donors"));
    return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
};

window.lifeFlowFetchBloodStockMap = async () => {
    const snapshot = await getDocs(collection(db, "bloodStock"));
    const result = {};

    snapshot.docs.forEach((docSnapshot) => {
        result[docSnapshot.id] = docSnapshot.data();
    });

    return result;
};

window.lifeFlowUpsertBloodStock = async (bloodGroup, availableStock, neededValue, updatedBy) => {
    await setDoc(
        doc(db, "bloodStock", bloodGroup),
        {
            bloodGroup,
            availableStock,
            neededValue,
            updatedBy,
            updatedAt: serverTimestamp()
        },
        { merge: true }
    );
};

window.lifeFlowAddEmergencyNotice = async (noticeData) => {
    await addDoc(collection(db, "emergencyNotices"), {
        ...noticeData,
        createdAt: serverTimestamp()
    });
};

window.lifeFlowFetchEmergencyNotices = async () => {
    const noticeQuery = query(
        collection(db, "emergencyNotices"),
        orderBy("createdAt", "desc"),
        limit(15)
    );

    const snapshot = await getDocs(noticeQuery);
    return snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }));
};
