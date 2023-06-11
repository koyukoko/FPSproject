import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut} from 'firebase/auth';
import { getFirestore, collection , addDoc, getDoc,getDocs ,doc, deleteDoc,setDoc } from 'firebase/firestore';

// Firebase SDK 설정 정보
export const firebaseConfig = {
  apiKey: "AIzaSyA2uCnKEBPQW7kszbIlmv0L0AQKvFWoQoI",
  authDomain: "flowchart-52b6d.firebaseapp.com",
  databaseURL: "https://flowchart-52b6d-default-rtdb.firebaseio.com",
  projectId: "flowchart-52b6d",
  storageBucket: "flowchart-52b6d.appspot.com",
  messagingSenderId: "125308872088",
  appId: "1:125308872088:web:7e8f97862356f55f89f7ed",
  measurementId: "G-42E6CCY07L"
};

//firebase 앱 초기화
const app = initializeApp(firebaseConfig);

// 필요한 경우 Firebase 서비스 추가
export const db = getFirestore(app);
export const auth = getAuth();
export {collection, addDoc, signInWithPopup,initializeApp, 
  getAnalytics, GoogleAuthProvider, onAuthStateChanged, 
  setDoc,signOut, getDoc, getDocs, doc, deleteDoc};