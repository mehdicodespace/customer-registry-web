import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/services/firebase";

export interface AuthUser {
  id: string;
  email: string;
}

const toAuthUser = (user: User): AuthUser => ({
  id: user.uid,
  email: user.email || "",
});

const authError = (error: unknown): Error => {
  const code = (error as { code?: string })?.code;
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "An account already exists for this email.",
    "auth/invalid-credential": "The email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/weak-password": "Choose a stronger password with at least 12 characters.",
    "auth/too-many-requests": "Too many attempts. Wait a moment and try again.",
    "auth/network-request-failed": "Could not reach Firebase. Check your connection and try again.",
    "auth/user-disabled": "This account has been disabled.",
  };
  return new Error((code && messages[code]) || "Authentication could not be completed. Please try again.");
};

const AuthService = {
  async signIn(email: string, password: string): Promise<AuthUser> {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      return toAuthUser(credential.user);
    } catch (error) {
      throw authError(error);
    }
  },

  async signUp(email: string, password: string): Promise<AuthUser> {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      return toAuthUser(credential.user);
    } catch (error) {
      throw authError(error);
    }
  },

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw authError(error);
    }
  },

  getCurrentUser(): Promise<AuthUser | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          unsubscribe();
          resolve(user ? toAuthUser(user) : null);
        },
        (error) => {
          unsubscribe();
          reject(authError(error));
        }
      );
    });
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },
};

export default AuthService;
