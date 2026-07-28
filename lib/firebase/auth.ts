import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from './client';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'enterprise';
  savedLocations: Array<{
    name: string;
    lat: number;
    lon: number;
    country: string;
    admin1?: string;
  }>;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    units: 'metric' | 'imperial';
    timeFormat: '12h' | '24h';
    language: string;
  };
  createdAt?: any;
  lastLoginAt?: any;
}

export async function syncUserProfile(user: User): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Default admin for primary account or email
    const isAdminEmail = user.email === 'xnoyzen@gmail.com' || user.email?.includes('admin');
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0] || 'Weather Explorer',
      photoURL: user.photoURL || null,
      role: isAdminEmail ? 'admin' : 'user',
      plan: isAdminEmail ? 'pro' : 'free',
      savedLocations: [
        { name: 'London', lat: 51.5074, lon: -0.1278, country: 'United Kingdom' },
        { name: 'New York', lat: 40.7128, lon: -74.006, country: 'United States' },
        { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' }
      ],
      preferences: {
        theme: 'system',
        units: 'metric',
        timeFormat: '24h',
        language: 'en'
      },
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp()
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
    return snap.data() as UserProfile;
  }
}

export async function loginWithGoogle() {
  const res = await signInWithPopup(auth, googleProvider);
  return await syncUserProfile(res.user);
}

export async function loginWithGithub() {
  const res = await signInWithPopup(auth, githubProvider);
  return await syncUserProfile(res.user);
}

export async function logoutUser() {
  return await firebaseSignOut(auth);
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile
};
