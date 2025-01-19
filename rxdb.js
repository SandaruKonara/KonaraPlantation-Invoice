import { createRxDatabase, addRxPlugin } from "rxdb";
import { openDB } from "idb";

const getRxStorageIDB = () => {
  return {
    async createStorageInstance() {
      const db = await openDB("quotationdb", 1, {
        upgrade(db) {
          db.createObjectStore("quotations", { keyPath: "quotationNumber" });
        },
      });
      return {
        // Define required methods to work with the database
        setItem: async (key, value) => {
          await db.put("quotations", value);
        },
        getItem: async (key) => {
          return await db.get("quotations", key);
        },
        removeItem: async (key) => {
          await db.delete("quotations", key);
        },
      };
    },
    close: async () => {
      // Close the DB when done
    },
  };
};

const initializeDatabase = async () => {
  const db = await createRxDatabase({
    name: "quotationdb",
    storage: getRxStorageIDB(),
  });

  await db.addCollections({
    quotations: {
      schema: {
        title: "quotation schema",
        version: 0,
        type: "object",
        properties: {
          quotationNumber: { type: "string" },
          date: { type: "string" },
          clientName: { type: "string" },
          items: { type: "array", items: { type: "object" } },
        },
        required: ["quotationNumber", "date", "clientName", "items"],
      },
    },
  });

  return db;
};

export default initializeDatabase;
