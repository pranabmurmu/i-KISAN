import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton safely
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with Google Chat scopes
export const googleChatProvider = new GoogleAuthProvider();
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.spaces');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.spaces.create');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.messages');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.messages.readonly');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.messages.create');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.memberships');
googleChatProvider.addScope('https://www.googleapis.com/auth/chat.memberships.readonly');

// In-memory token cache (Do NOT store in localStorage per guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const signInWithGoogleChat = async (): Promise<{
  user: User;
  accessToken: string;
} | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, googleChatProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Chat OAuth access token.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Chat Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const signOutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
