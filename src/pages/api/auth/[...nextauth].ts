import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';
import bcrypt from 'bcryptjs';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const db = await open({ filename: 'database.sqlite', driver: sqlite3.Database });

        const user = await db.get('SELECT * FROM users WHERE username = ?', credentials.username);

        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return { name: user.username, id: user.id.toString() };
        } else {
          return null;
        }
      },
    }),
  ],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
});