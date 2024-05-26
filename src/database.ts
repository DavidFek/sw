import sqlite3 from 'sqlite3';

let db: sqlite3.Database;

export const getDatabaseConnection = () => {
    if (!db) {
      db = new sqlite3.Database('database.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Connected to the SQlite database.');
  
        db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
          )
        `, (err) => {
          if (err) {
            console.error('Failed to create users table', err);
          } else {
            console.log('Users table created successfully');
          }
        });
      });
    }
  
    return db;
  };

export default { getDatabaseConnection };