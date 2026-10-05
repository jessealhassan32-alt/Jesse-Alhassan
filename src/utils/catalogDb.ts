/**
 * IndexedDB storage for Catalog photos and image resizing utility
 * Keeps photos out of localStorage to prevent quota exhaustion
 */

const DB_NAME = 'smallking_catalog_db';
const DB_VERSION = 1;
const PHOTO_STORE = 'photos';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getPhotoFromDb(id: string): Promise<string | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const store = tx.objectStore(PHOTO_STORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.error('Error fetching photo from IndexedDB:', err);
    return null;
  }
}

export async function getPhotosBatch(ids: string[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  if (!ids || ids.length === 0) return result;

  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const store = tx.objectStore(PHOTO_STORE);
      let count = 0;

      ids.forEach((id) => {
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result) {
            result[id] = req.result;
          }
          count++;
          if (count === ids.length) resolve(result);
        };
        req.onerror = () => {
          count++;
          if (count === ids.length) resolve(result);
        };
      });
    });
  } catch (err) {
    console.error('Error batch fetching photos:', err);
    return result;
  }
}

export async function savePhotoToDb(id: string, dataUrl: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const req = store.put(dataUrl, id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deletePhotoFromDb(id: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function getAllPhotosFromDb(): Promise<Record<string, string>> {
  const db = await openDatabase();
  return new Promise((resolve) => {
    const tx = db.transaction(PHOTO_STORE, 'readonly');
    const store = tx.objectStore(PHOTO_STORE);
    const req = store.openCursor();
    const result: Record<string, string> = {};

    req.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        result[String(cursor.key)] = cursor.value;
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    req.onerror = () => resolve(result);
  });
}

export async function importPhotosToDb(photos: Record<string, string>): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    const store = tx.objectStore(PHOTO_STORE);
    for (const [id, dataUrl] of Object.entries(photos)) {
      store.put(dataUrl, id);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Resizes photo to max 1100px wide (JPEG quality 0.8) as instructed
 */
export function resizeImage(file: File, maxDim = 1100): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(img.src);
        }
        ctx.fillStyle = '#0c0b09';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
