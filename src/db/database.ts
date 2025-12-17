import * as SQLite from "expo-sqlite";

const dbName = "FunBoxAIDatabase.db";
let db: SQLite.SQLiteDatabase | null = null;
export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync(dbName);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS history_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL DEFAULT 'unknown',
        subCategory TEXT DEFAULT NULL,
        content TEXT DEFAULT '',
        templateIndex INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        imageData TEXT DEFAULT NULL
      );
    `);

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  }
};

export interface HistoryItem {
  id?: number;
  type: string;
  subCategory?: string;
  content: string;
  templateIndex: number;
  createdAt: string;
  imageData?: string | null;
}

export const saveToHistory = async (item: Omit<HistoryItem, "id">) => {
  if (!db) throw new Error("DB not initialized");

  const safeItem = {
    type: item.type || "unknown",
    subCategory: item.subCategory || null,
    content: item.content || "",
    templateIndex: item.templateIndex || 0,
    createdAt: item.createdAt || new Date().toISOString(),
    imageData: item.imageData || null,
  };

  console.log("💾 Saving to history:", safeItem);

  try {
    await db.runAsync(
      `INSERT INTO history_v2 (type, subCategory, content, templateIndex, createdAt, imageData)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        safeItem.type,
        safeItem.subCategory,
        safeItem.content,
        safeItem.templateIndex,
        safeItem.createdAt,
        safeItem.imageData,
      ]
    );

    console.log("✅ Item saved to history");
  } catch (err) {
    console.error("❌ Error saving to history:", err);
    throw err;
  }
};

export const getHistory = async (): Promise<HistoryItem[]> => {
  if (!db) throw new Error("DB not initialized");

  try {
    const rows = await db.getAllAsync<HistoryItem>(
      `SELECT * FROM history_v2 ORDER BY createdAt DESC LIMIT 100`
    );

    console.log("📖 Loaded history:", rows.length, "items");
    return rows;
  } catch (error) {
    console.error("❌ Error fetching history:", error);
    throw error;
  }
};

export const clearHistory = async () => {
  if (!db) throw new Error("DB not initialized");

  try {
    await db.execAsync(`DELETE FROM history_v2`);
    console.log("🧹 History cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing history:", error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return db;
};
