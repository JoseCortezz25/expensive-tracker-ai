/**
 * IndexedDB Client for Expense Tracker AI
 *
 * Provides a typed interface to interact with IndexedDB for offline-first expense storage.
 * Database schema and operations for expense CRUD functionality.
 *
 * @module lib/db
 */

import { openDB, type IDBPDatabase } from 'idb';

/**
 * Database configuration constants
 */
export const DB_NAME = 'expense-tracker-db';
export const DB_VERSION = 1;
export const STORE_NAME = 'expenses';

/**
 * IndexedDB Database Schema
 */
export interface ExpenseTrackerDB {
  expenses: {
    key: string; // UUID
    value: {
      id: string;
      description: string;
      amount: number;
      category: string;
      date: string; // ISO 8601 string
      createdAt: string; // ISO 8601 string
      updatedAt: string; // ISO 8601 string
    };
    indexes: {
      date: string;
      category: string;
      createdAt: string;
    };
  };
}

/**
 * Opens (or creates) the IndexedDB database
 *
 * Creates the database with the expenses object store and indexes if it doesn't exist.
 * If the database already exists, returns the existing connection.
 *
 * @returns {Promise<IDBPDatabase<ExpenseTrackerDB>>} Promise resolving to database instance
 * @throws {Error} If IndexedDB is not supported or database opening fails
 *
 * @example
 * ```typescript
 * const db = await openExpenseDB();
 * const tx = db.transaction('expenses', 'readonly');
 * const store = tx.objectStore('expenses');
 * const allExpenses = await store.getAll();
 * ```
 */
export async function openExpenseDB(): Promise<IDBPDatabase<ExpenseTrackerDB>> {
  // Check if IndexedDB is supported
  if (typeof window === 'undefined' || !window.indexedDB) {
    throw new Error('IndexedDB is not supported in this environment');
  }

  try {
    const db = await openDB<ExpenseTrackerDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Create expenses object store if it doesn't exist
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const expenseStore = db.createObjectStore(STORE_NAME, {
            keyPath: 'id',
          });

          // Create indexes for efficient querying
          expenseStore.createIndex('date', 'date', { unique: false });
          expenseStore.createIndex('category', 'category', { unique: false });
          expenseStore.createIndex('createdAt', 'createdAt', { unique: false });

          console.log('[IndexedDB] Created expenses store with indexes');
        }
      },
      blocked() {
        console.warn(
          '[IndexedDB] Database blocked - another tab may have a different version open'
        );
      },
      blocking() {
        console.warn(
          '[IndexedDB] Blocking - this tab is preventing another tab from upgrading'
        );
      },
      terminated() {
        console.error('[IndexedDB] Database connection abnormally terminated');
      },
    });

    return db;
  } catch (error) {
    console.error('[IndexedDB] Failed to open database:', error);
    throw new Error(
      `Failed to open IndexedDB: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Checks if IndexedDB is available and supported
 *
 * Use this to provide graceful fallbacks if IndexedDB is not available.
 *
 * @returns {boolean} True if IndexedDB is supported
 *
 * @example
 * ```typescript
 * if (!isIndexedDBSupported()) {
 *   showError('Your browser does not support offline storage');
 * }
 * ```
 */
export function isIndexedDBSupported(): boolean {
  return typeof window !== 'undefined' && !!window.indexedDB;
}

/**
 * Closes the database connection
 *
 * Use this when the app is being unmounted or when you need to clean up connections.
 *
 * @param {IDBPDatabase<ExpenseTrackerDB>} db - Database instance to close
 *
 * @example
 * ```typescript
 * const db = await openExpenseDB();
 * // ... do work
 * closeDB(db);
 * ```
 */
export function closeDB(db: IDBPDatabase<ExpenseTrackerDB>): void {
  if (db) {
    db.close();
    console.log('[IndexedDB] Database connection closed');
  }
}

/**
 * Deletes the entire database (use with caution!)
 *
 * This will remove all data permanently. Only use for testing or explicit user action.
 *
 * @returns {Promise<void>}
 * @throws {Error} If deletion fails
 *
 * @example
 * ```typescript
 * // Clear all data (with user confirmation)
 * if (confirm('Delete all expenses?')) {
 *   await deleteDatabase();
 * }
 * ```
 */
export async function deleteDatabase(): Promise<void> {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported');
  }

  try {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);

      request.onsuccess = () => {
        console.log('[IndexedDB] Database deleted successfully');
        resolve();
      };

      request.onerror = () => {
        console.error('[IndexedDB] Failed to delete database');
        reject(new Error('Failed to delete database'));
      };

      request.onblocked = () => {
        console.warn('[IndexedDB] Database deletion blocked - close all tabs');
        reject(new Error('Database deletion blocked by open connections'));
      };
    });
  } catch (error) {
    console.error('[IndexedDB] Delete database error:', error);
    throw error;
  }
}
