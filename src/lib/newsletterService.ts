import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './firebase';

export async function subscribeToNewsletter(email: string, source: string = 'general') {
  const subscribersRef = collection(db, 'subscribers');
  
  try {
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Invalid email format' };
    }

    // Check if duplicate
    const q = query(subscribersRef, where('email', '==', email.toLowerCase()));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      return { success: true, message: 'Already subscribed' };
    }

    await addDoc(subscribersRef, {
      email: email.toLowerCase(),
      source,
      createdAt: serverTimestamp()
    });

    return { success: true, message: 'Subscribed successfully' };
  } catch (error) {
    console.error('Newsletter subscription failed:', error);
    return { success: false, message: 'Subscription failed. Please try again.' };
  }
}
