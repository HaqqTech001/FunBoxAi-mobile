import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system";
import { openDatabaseSync, SQLiteDatabase, SQLResultSet } from "expo-sqlite";

const dbName = "FunBoxAIDatabase";
let db: SQLiteDatabase;

// --- OPTIONAL DELETE FUNCTION (DO NOT RUN AUTOMATICALLY)
// export const wipeDb = async () => {
//   try {
//     const dbFolder = `${FileSystem.documentDirectory}SQLite`;
//     const files = await FileSystem.readDirectoryAsync(dbFolder);

//     console.log("📂 Existing SQLite files:", files);

//     for (const file of files) {
//       await FileSystem.deleteAsync(`${dbFolder}/${file}`, { idempotent: true });
//       console.log("🔥 Deleted:", file);
//     }
//   } catch (err) {
//     console.log("Error wiping DB:", err);
//   }
// };


// --- UTILITY FUNCTION USING execSync() ---
const executeSqlSync = (
  query: string,
  params: (string | number | null)[] = []
) => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }

  return db.execSync(query, params);
};

// --- INITIALIZATION ---
export const initDatabase = async () => {
  try {
    if (!db) {
      db = openDatabaseSync(dbName);
    }

    createTable();
    createUserTable();

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

// --- CREATE TABLE ---
const createTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS history_v2 (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL DEFAULT 'unknown',
      content TEXT DEFAULT '',
      templateIndex INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );
  `;
  executeSqlSync(sql);
  console.log("✅ History table created/verified");
};

const createUserTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
  `;
  executeSqlSync(sql);
  console.log("✅ Users table created/verified");
};

// --- INTERFACE ---
export interface HistoryItem {
  id?: number;
  type: string;
  content: string;
  templateIndex: number;
  createdAt: string;
}

// --- AUTH OPERATIONS ---
export const registerUser = (email: string, password: string) => {
  const sql = `
    INSERT INTO users (email, password, createdAt)
    VALUES (?, ?, ?)
  `;

  const params = [email.trim(), password, new Date().toISOString()];

  try {
    executeSqlSync(sql, params);
    console.log("✅ User registered");
    return true;
  } catch (err: any) {
    if (err.message.includes("UNIQUE")) {
      console.log("❌ Email already exists");
      return false;
    }
    throw err;
  }
};

export const loginUser = (email: string, password: string) => {
  const sql = `
    SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1
  `;

  const result = executeSqlSync(sql, [email.trim(), password]) as SQLResultSet;

  if (result.rows.length > 0) {
    console.log("✅ Login successful");
    return result.rows.item(0);
  } else {
    console.log("❌ Invalid email or password");
    return null;
  }
};

export const saveSession = async (userId: number) => {
  await AsyncStorage.setItem("session_user", String(userId));
};

export const getSession = async () => {
  const id = await AsyncStorage.getItem("session_user");
  return id ? Number(id) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem("session_user");
};

// --- CRUD OPERATIONS ---
export const saveToHistory = (rawItem: any) => {
  const item = rawItem || {};

  const type = item.type || "unknown";
  const content = item.content || item.caption || "";
  const templateIndex = Number(item.templateIndex ?? 0);
  const createdAt = item.createdAt || new Date().toISOString();

  console.log("Saving =>", { type, content, templateIndex, createdAt });

  executeSqlSync(
    `INSERT INTO history_v2 (type, content, templateIndex, createdAt)
     VALUES (?, ?, ?, ?)`,
    [type, content, templateIndex, createdAt]
  );
};

export const getHistory = (): HistoryItem[] => {
  const sql = `SELECT * FROM history_v2 ORDER BY createdAt DESC LIMIT 100`;

  const result = executeSqlSync(sql) as SQLResultSet;

  const list: HistoryItem[] = [];
  const rows = result.rows;

  for (let i = 0; i < rows.length; i++) {
    list.push(rows.item(i));
  }

  return list;
};

export const clearHistory = () => {
  const sql = `DELETE FROM history_v2`;
  executeSqlSync(sql);
  console.log("✅ History cleared");
};

export const getDatabase = (): SQLiteDatabase => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
};
