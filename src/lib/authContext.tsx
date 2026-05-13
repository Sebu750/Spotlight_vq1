import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const ADMIN_EMAIL_MASTER = 'haseeb.49251@gmail.com';

interface AdminContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log("Auth state change:", currentUser ? `Logged in as ${currentUser.email}` : "Logged out");
      
      if (currentUser) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          console.log("Admin doc exists:", adminDoc.exists());
          
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else if (currentUser.email?.toLowerCase() === ADMIN_EMAIL_MASTER) {
            console.log("Master email detected. Attempting self-promotion.");
            // Master Admin Self-Promotion Path
            try {
              await setDoc(doc(db, 'admins', currentUser.uid), {
                email: currentUser.email?.toLowerCase(),
                promotedAt: serverTimestamp(),
                role: 'super_admin',
                autoPromoted: true
              });
              setIsAdmin(true);
              console.log("Self-promotion successful.");
            } catch (err) {
              console.warn("Self-promotion failed - likely permission delay. Falling back to email check.", err);
              // Fallback for session survival
              setIsAdmin(true); 
            }
          } else {
            setIsAdmin(false);
          }
        } catch (err: any) {
          console.error("Authorization fetch failed:", err);
          
          // CRITICAL: Robust fallback for network failures
          const isMaster = currentUser.email?.toLowerCase() === ADMIN_EMAIL_MASTER;
          if (isMaster) {
            console.log("Network Failure detected. Overriding authorization based on master identity.");
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            if (err.code === 'unavailable' || err.message?.includes('network')) {
              setAuthError('Satellite Link Weak: Unable to verify permissions. Data may be restricted.');
            }
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, normalizedEmail, pass);
    } catch (err: any) {
      console.error("Auth Fail:", err);
      // Modern Firebase Error Code for multiple failure types
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        throw new Error('Access Denied: Invalid cryptographic credentials. If this is your first time, use Secure Enrollment.');
      } else if (err.code === 'auth/too-many-requests') {
        throw new Error('Security Lockdown: Too many failed attempts. Try again later.');
      } else {
        throw new Error(`Communication Error: ${err.message}`);
      }
    }
  };

  const signUp = async (email: string, pass: string) => {
    setAuthError(null);
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL_MASTER) {
      throw new Error('Unauthorized: Only the master account can use direct enrollment.');
    }

    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    try {
      await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        throw new Error('Account already exists. Use standard Sign In.');
      }
      throw new Error(`Enrollment Failed: ${err.message}`);
    }
  };

  const signInGoogle = async () => {
    setAuthError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError('Identity verification interrupted.');
      }
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AdminContext.Provider 
      value={{ 
        user, 
        isAdmin, 
        loading, 
        authError, 
        signIn, 
        signUp,
        signInGoogle, 
        signOut,
        clearError: () => setAuthError(null)
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
