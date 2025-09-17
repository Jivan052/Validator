import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp,
  updateDoc,
  orderBy,
  setDoc,
  increment,
} from "firebase/firestore";
import { db } from "../firebase/config";
import secureStorage from "../utils/secureStorage";

// Collection names
const IDEAS_COLLECTION = "ideas";
const USERS_COLLECTION = "users";

// Add a new idea to Firestore
export const addIdea = async (userId, ideaText, keywords) => {
  try {
    const docRef = await addDoc(collection(db, IDEAS_COLLECTION), {
      userId,
      ideaText,
      keywords,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: "processing", // initial status while analysis is in progress
    });
    
    // Creating a new idea also counts towards the question limit
    await incrementUserQuestionCount(userId);
    
    return docRef.id;
  } catch (error) {
    console.error("Error adding idea:", error);
    throw error;
  }
};

// Update an idea with analysis results
export const updateIdeaWithAnalysis = async (ideaId, newsArticles, analysis) => {
  try {
    const ideaRef = doc(db, IDEAS_COLLECTION, ideaId);
    await updateDoc(ideaRef, {
      newsArticles,
      analysis,
      status: "completed",
      updatedAt: serverTimestamp(),
    });
    return ideaId;
  } catch (error) {
    console.error("Error updating idea with analysis:", error);
    throw error;
  }
};

// Add a follow-up question and answer to an idea
export const addFollowUpQuestion = async (ideaId, question, answer, userId) => {
  try {
    const ideaRef = doc(db, IDEAS_COLLECTION, ideaId);
    const ideaDoc = await getDoc(ideaRef);
    
    if (!ideaDoc.exists()) {
      throw new Error("Idea not found");
    }
    
    const ideaData = ideaDoc.data();
    const questions = ideaData.questions || [];
    
    // Use a regular JavaScript Date object instead of serverTimestamp() for array items
    // This is because serverTimestamp() is not supported inside arrays in Firestore
    questions.push({
      question,
      answer,
      timestamp: new Date(), // Using JavaScript Date instead of serverTimestamp()
    });
    
    await updateDoc(ideaRef, {
      questions,
      updatedAt: serverTimestamp(), // serverTimestamp() is fine at the document's root level
    });
    
    // Increment the user's question count
    if (userId) {
      await incrementUserQuestionCount(userId);
    }
    
    return ideaId;
  } catch (error) {
    console.error("Error adding follow-up question:", error);
    throw error;
  }
};

// Get all ideas for a user
export const getUserIdeas = async (userId) => {
  try {
    const q = query(
      collection(db, IDEAS_COLLECTION),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const ideas = [];
    
    querySnapshot.forEach((doc) => {
      ideas.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return ideas;
  } catch (error) {
    console.error("Error getting user ideas:", error);
    throw error;
  }
};

// Get a single idea by ID
export const getIdeaById = async (ideaId) => {
  try {
    const docRef = doc(db, IDEAS_COLLECTION, ideaId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      throw new Error("Idea not found");
    }
  } catch (error) {
    console.error("Error getting idea by ID:", error);
    throw error;
  }
};

// Get a user's question count with local caching
export const getUserQuestionCount = async (userId) => {
  try {
    // Check secure storage first
    const cacheKey = `user_${userId}_questionCount`;
    const cachedCount = secureStorage.getItem(cacheKey);
    const cacheTimestampKey = `${cacheKey}_timestamp`;
    const cachedTimestamp = secureStorage.getItem(cacheTimestampKey);
    const now = Date.now();
    
    // If we have a cached value and it's less than 2 hours old, use it
    if (cachedCount !== null && cachedTimestamp && (now - parseInt(cachedTimestamp)) < 2 * 60 * 60 * 1000) {
      return parseInt(cachedCount);
    }
    
    // Otherwise, fetch from Firestore
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const count = userDoc.data().questionCount || 0;
      // Update secure cache
      secureStorage.setItem(cacheKey, count.toString());
      secureStorage.setItem(cacheTimestampKey, now.toString());
      return count;
    } else {
      // User document doesn't exist yet, initialize it
      await setDoc(userRef, { 
        questionCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      // Update secure cache
      secureStorage.setItem(cacheKey, "0");
      secureStorage.setItem(cacheTimestampKey, now.toString());
      return 0;
    }
  } catch (error) {
    console.error("Error getting user question count:", error);
    
    // If there's an error but we have a cached value, use it as fallback
    const cacheKey = `user_${userId}_questionCount`;
    const cachedCount = secureStorage.getItem(cacheKey);
    if (cachedCount !== null) {
      return parseInt(cachedCount);
    }
    
    throw error;
  }
};

// Track pending updates to batch process them
let pendingUpdates = {};
let updateTimeouts = {};

// Increment the user's question count and update local cache
export const incrementUserQuestionCount = async (userId) => {
  try {
    // Cache keys
    const cacheKey = `user_${userId}_questionCount`;
    const cacheTimestampKey = `${cacheKey}_timestamp`;
    
    // Current count (from secure cache if available)
    let currentCount = 0;
    const cachedCount = secureStorage.getItem(cacheKey);
    
    if (cachedCount !== null) {
      currentCount = parseInt(cachedCount);
    } else {
      // If no cache, need to fetch first
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        currentCount = userDoc.data().questionCount || 0;
      }
    }
    
    // Increment the local count immediately for a responsive UI
    const newCount = currentCount + 1;
    secureStorage.setItem(cacheKey, newCount.toString());
    secureStorage.setItem(cacheTimestampKey, Date.now().toString());
    
    // Add to pending updates
    if (!pendingUpdates[userId]) {
      pendingUpdates[userId] = 0;
    }
    pendingUpdates[userId]++;
    
    // Clear any existing timeout
    if (updateTimeouts[userId]) {
      clearTimeout(updateTimeouts[userId]);
    }
    
    // Set a new timeout to batch updates
    updateTimeouts[userId] = setTimeout(() => {
      // Update Firestore with the batched increment
      const incrementAmount = pendingUpdates[userId];
      const userRef = doc(db, USERS_COLLECTION, userId);
      
      try {
        // Use the batched increment value
        updateDoc(userRef, {
          questionCount: increment(incrementAmount),
          updatedAt: serverTimestamp()
        }).catch(error => {
          // If the document doesn't exist, the updateDoc will fail, so we create it
          if (error.code === 'not-found' || error.message.includes('No document to update')) {
            setDoc(userRef, {
              questionCount: incrementAmount,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }).catch(e => console.error("Error creating user document:", e));
          } else {
            console.error("Error updating user question count:", error);
          }
        });
      } finally {
        // Reset pending updates for this user
        pendingUpdates[userId] = 0;
      }
    }, 2000); // Wait 2 seconds to batch multiple increments
    
    return newCount; // Return the new count immediately based on cache
  } catch (error) {
    console.error("Error incrementing user question count:", error);
    throw error;
  }
};

// Check if user has exceeded question limit using cached count when available
export const checkUserQuestionLimit = async (userId, limit = 10) => {
  try {
    // Check secure storage first for fastest response
    const cacheKey = `user_${userId}_questionCount`;
    const cachedCount = secureStorage.getItem(cacheKey);
    
    if (cachedCount !== null) {
      // If the cached count is already at or over the limit, we can return immediately
      if (parseInt(cachedCount) >= limit) {
        return true;
      }
      // If the cached count is close to the limit (within 2) and cache is older than 15 minutes, verify with server
      const cacheTimestampKey = `${cacheKey}_timestamp`;
      const cachedTimestamp = secureStorage.getItem(cacheTimestampKey);
      const now = Date.now();
      
      if (parseInt(cachedCount) >= limit - 2 && (!cachedTimestamp || (now - parseInt(cachedTimestamp)) > 15 * 60 * 1000)) {
        // Double-check with server for near-limit cases only if cache is stale
        const serverCount = await getUserQuestionCount(userId);
        return serverCount >= limit;
      }
      // Otherwise, use the cached count
      return false;
    }
    
    // If no cache, fall back to server check
    const count = await getUserQuestionCount(userId);
    return count >= limit;
  } catch (error) {
    console.error("Error checking user question limit:", error);
    throw error;
  }
};