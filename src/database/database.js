import sqlite3 from 'sqlite3';

const DEFAULT_DATABASE_PATH = ':memory:';

export function createDatabase(databasePath = DEFAULT_DATABASE_PATH) {
  const connection = new sqlite3.Database(databasePath);

  return {
    all: (sql, parameters = []) => new Promise((resolve, reject) => {
      connection.all(sql, parameters, (error, rows) => (error ? reject(error) : resolve(rows)));
    }),
    close: () => new Promise((resolve, reject) => {
      connection.close((error) => (error ? reject(error) : resolve()));
    }),
    exec: (sql) => new Promise((resolve, reject) => {
      connection.exec(sql, (error) => (error ? reject(error) : resolve()));
    }),
    get: (sql, parameters = []) => new Promise((resolve, reject) => {
      connection.get(sql, parameters, (error, row) => (error ? reject(error) : resolve(row)));
    }),
    run: (sql, parameters = []) => new Promise((resolve, reject) => {
      connection.run(sql, parameters, function onRun(error) {
        if (error) {
          reject(error);
          return;
        }

        resolve({ changes: this.changes, lastID: this.lastID });
      });
    })
  };
}
