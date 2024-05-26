import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseConnection } from '../../../database';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const db = await getDatabaseConnection();

    const existingUser = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', username, function(err, row) {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });

    if (existingUser) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          [username, hashedPassword],
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
          }
        );
      });

      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error registering user', error: err });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}