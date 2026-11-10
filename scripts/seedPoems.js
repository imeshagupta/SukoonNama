require("dotenv").config();

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require("firebase/firestore");
const poems = require("./poemsData");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  console.error("Missing Firebase env vars in .env:");
  missing.forEach((key) => console.error(`  - ${key}`));
  console.error("\nAdd your Firebase web config (REACT_APP_FIREBASE_*) to .env, then rerun:");
  console.error("  npm run seed:poems");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const normalize = (text) => (text || "").replace(/\s+/g, " ").trim();

const run = async () => {
  const snapshot = await getDocs(collection(db, "poems"));
  const existing = new Set();
  snapshot.forEach((docSnap) => {
    const key = normalize(docSnap.data().poem);
    if (key) existing.add(key);
  });

  let added = 0;
  let skipped = 0;
  const baseTime = Date.now();

  for (let i = 0; i < poems.length; i += 1) {
    const item = poems[i];
    const key = normalize(item.poem);

    if (existing.has(key)) {
      skipped += 1;
      continue;
    }

    await addDoc(collection(db, "poems"), {
      title: item.title || null,
      poem: item.poem,
      category: item.category,
      createdAt: new Date(baseTime - i * 60 * 1000),
      likes: 0,
    });

    existing.add(key);
    added += 1;
    console.log(`Added: ${item.poem.split("\n")[0]} (${item.category})`);
  }

  console.log(`\nDone. Added ${added}, skipped ${skipped} (already in Firestore).`);
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
