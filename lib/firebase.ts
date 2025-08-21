import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const isConfigValid = () => {
  const requiredFields = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]

  for (const field of requiredFields) {
    if (!firebaseConfig[field as keyof typeof firebaseConfig]) {
      console.error(`[v0] Missing Firebase config: ${field}`)
      return false
    }
  }
  return true
}

let app: FirebaseApp | null = null
let firestoreDb: Firestore | null = null

const initializeFirebase = () => {
  // Skip on server side
  if (typeof window === "undefined") {
    return null
  }

  // Skip if already initialized
  if (firestoreDb) {
    return firestoreDb
  }

  // Validate config first
  if (!isConfigValid()) {
    console.error("[v0] Firebase configuration is invalid")
    return null
  }

  try {
    // Initialize Firebase app
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig)
      console.log("[v0] Firebase app initialized")
    } else {
      app = getApp()
      console.log("[v0] Using existing Firebase app")
    }

    // Initialize Firestore
    if (app) {
      firestoreDb = getFirestore(app)
      console.log("[v0] Firestore initialized successfully")
      return firestoreDb
    }
  } catch (error) {
    console.error("[v0] Firebase initialization failed:", error)
  }

  return null
}

export const db = typeof window !== "undefined" ? initializeFirebase() : null

export const getFirebaseDb = () => {
  if (typeof window === "undefined") {
    return null
  }

  return firestoreDb || initializeFirebase()
}

export const ensureFirebaseInitialized = () => {
  return typeof window !== "undefined" && getFirebaseDb() !== null
}
