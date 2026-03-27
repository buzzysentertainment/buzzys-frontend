import { db, storage } from "../firebase";
import { 
  collection, getDocs, addDoc, query, orderBy, 
  doc, getDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp 
} from "firebase/firestore";
import { 
  ref, uploadBytes, getDownloadURL, deleteObject 
} from "firebase/storage";

// -----------------------------
// 1. Fetching
// -----------------------------
export const fetchAllMedia = async () => {
  const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const loadInflatableImages = async () => {
  const snap = await getDoc(doc(db, "settings", "inventory"));
  return snap.exists() ? snap.data().imageMappings || {} : {};
};

export const loadSlideshowImages = async () => {
  const snap = await getDoc(doc(db, "settings", "homepage"));
  return snap.exists() ? snap.data().slideshow || [] : [];
};

export const loadAdPlacements = async () => {
  const snap = await getDoc(doc(db, "settings", "ads"));
  return snap.exists() ? snap.data().placements || {} : {};
};

// -----------------------------
// 2. Saving/Uploading
// -----------------------------
export const uploadMediaFile = async (file) => {
  const path = `library/${Date.now()}_${file.name}`; 
  const fileRef = ref(storage, path);
  
  const snapshot = await uploadBytes(fileRef, file);
  const url = await getDownloadURL(snapshot.ref);
  
  const mediaDoc = { 
    name: file.name, 
    url, 
    type: file.type, 
    fullPath: path, 
    createdAt: new Date() 
  };
  
  const docRef = await addDoc(collection(db, "media"), mediaDoc);
  return { id: docRef.id, ...mediaDoc };
};

/**
 * UPDATED: Saves IDs to settings AND flattens URLs into 'hero-slideshow' collection
 * @param {Array} ids - Array of media IDs selected for the slideshow
 * @param {Array} allMedia - The current full media list from state (for URL lookup)
 */
export const saveSlideshowImages = async (ids, allMedia) => {
  // 1. Update the master settings doc (for the Admin Panel state)
  await updateDoc(doc(db, "settings", "homepage"), { slideshow: ids });

  // 2. Prepare a batch to update the 'hero-slideshow' collection (for the LIVE Homepage)
  const batch = writeBatch(db);
  const liveSlidesRef = collection(db, "hero-slideshow");

  // 3. Delete old entries from 'hero-slideshow' to prevent ghost images
  const liveSnap = await getDocs(liveSlidesRef);
  liveSnap.forEach((oldDoc) => {
    batch.delete(oldDoc.ref);
  });

  // 4. Create new entries with full URLs for the public Slideshow component
  ids.forEach((id, index) => {
    const mediaItem = allMedia.find(m => m.id === id);
    if (mediaItem) {
      const newDocRef = doc(liveSlidesRef); 
      batch.set(newDocRef, {
        imageUrl: mediaItem.url,
        type: mediaItem.type?.startsWith("video") ? "video" : "image",
        order: index,
        createdAt: serverTimestamp() 
      });
    }
  });

  // Execute all deletions and additions at once
  await batch.commit();
};

export const saveInflatableImages = async (mappings) => {
  await updateDoc(doc(db, "settings", "inventory"), { imageMappings: mappings });
};

export const saveAdPlacements = async (placements) => {
  await updateDoc(doc(db, "settings", "ads"), { placements });
};

// -----------------------------
// 3. Deleting
// -----------------------------
export const deleteMediaItem = async (item) => {
  try {
    await deleteDoc(doc(db, "media", item.id));

    const storagePath = item.fullPath || `library/${item.name}`;
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    console.log("Deleted successfully from DB and Storage");
  } catch (error) {
    console.error("Error in deleteMediaItem:", error);
    throw error; 
  }
};