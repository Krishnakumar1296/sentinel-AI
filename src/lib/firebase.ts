/**
 * Firebase client-side SDK initialization.
 * 
 * Replace the config values below with your actual Firebase project config.
 * You can find these in Firebase Console → Project Settings → General → Your apps.
 */
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword, signOut, type User as FirebaseUser } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000000000',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export async function firebaseSignIn(email: string, password: string): Promise<{ user: FirebaseUser; idToken: string }> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()
  return { user: credential.user, idToken }
}

export async function firebaseSignOut(): Promise<void> {
  await signOut(auth)
}

export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser
  if (!user) return null
  return user.getIdToken()
}

export type { FirebaseUser }
