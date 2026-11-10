require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const poems = require("./poemsData");

const loadServiceAccount = () => {
  const inline = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (inline) {
    const value = inline.trim();
    const json = value.startsWith("{")
      ? value
      : Buffer.from(value, "base64").toString("utf8");
    return JSON.parse(json);
  }

  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : path.join(__dirname, "serviceAccountKey.json");

  if (!fs.existsSync(keyPath)) {
    console.error(`Service account key not found at: ${keyPath}`);
    console.error("");
    console.error("Set FIREBASE_SERVICE_ACCOUNT (base64 or raw JSON) in .env, or");
    console.error("Firebase Console -> Project settings -> Service accounts");
    console.error('-> "Generate new private key" -> save as scripts/serviceAccountKey.json');
    console.error("(.env and key files are gitignored, never commit them)");
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(keyPath, "utf8"));
};

const serviceAccount = loadServiceAccount();

const app = initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore(app);
const normalize = (text) => (text || "").replace(/\s+/g, " ").trim();

const run = async () => {
  const snapshot = await db.collection("poems").get();
  const existing = new Set();
  snapshot.forEach((doc) => {
    const key = normalize(doc.data().poem);
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

    await db.collection("poems").add({
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
