/**
 * IndexedDB open/upgrade logic for email store
 */

import { STORE_NAME } from './emailStoreTypes'

/**
 * Handle onupgradeneeded for email DB
 * @param ev - IDB version change event
 */
export function handleEmailUpgrade(
  ev: IDBVersionChangeEvent
): void {
  const db = (
    ev.target as IDBOpenDBRequest
  ).result
  if (
    !db.objectStoreNames.contains(STORE_NAME)
  ) {
    db.createObjectStore(STORE_NAME, {
      keyPath: 'id',
    })
  }
}

/**
 * Open email DB with empty-store fallback
 * @param req - Initial open request
 * @param setDb - DB state setter
 * @param setIsReady - Ready flag setter
 */
export function handleOpenSuccess(
  req: IDBOpenDBRequest,
  dbName: string,
  dbVersion: number,
  setDb: (db: IDBDatabase) => void,
  setIsReady: (v: boolean) => void
): void {
  const database = req.result
  if (database.objectStoreNames.length === 0) {
    database.close()
    const cr = indexedDB.open(
      dbName,
      dbVersion + 1
    )
    cr.onupgradeneeded = handleEmailUpgrade
    cr.onsuccess = () => {
      setDb(cr.result)
      setIsReady(true)
    }
  } else {
    setDb(database)
    setIsReady(true)
  }
}
