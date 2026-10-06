/**
 * Scrive nel DOM solo quando il valore cambia.
 *
 * `onUpdate` di anime.js (e i loop rAF) girano a ogni frame: riassegnare la
 * stessa stringa invalida lo stile senza cambiare nulla. Questo writer tiene
 * l'ultimo valore per chiave e chiama `write` solo sul cambio reale.
 */
export function createWriter() {
  const last = new Map<string, string>();
  return (key: string, value: string, write: () => void): void => {
    if (last.get(key) === value) return;
    last.set(key, value);
    write();
  };
}
