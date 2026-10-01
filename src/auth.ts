import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { db } from "@/db"
import { adminUsers } from "@/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const username = credentials.username as string;
        const password = credentials.password as string;

        // Try to find the user in the database
        const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);

        if (adminUser) {
          // Verify password
          const isValid = await bcrypt.compare(password, adminUser.passwordHash);
          if (isValid) {
            return { id: adminUser.id, name: adminUser.username, email: adminUser.username };
          }
          return null; // Invalid DB password
        }

        // If no user exists in DB, check if they match the initial ENV variables to seed the first account
        const envUser = process.env.ADMIN_USERNAME;
        const envPass = process.env.ADMIN_PASSWORD;

        if (envUser && envPass && username === envUser && password === envPass) {
          // Seed the account into the DB so they can change it later
          const salt = await bcrypt.genSalt(10);
          const passwordHash = await bcrypt.hash(password, salt);
          
          const [newUser] = await db.insert(adminUsers).values({
            username,
            passwordHash,
          }).returning();

          return { id: newUser.id, name: newUser.username, email: newUser.username };
        }

        return null; // Doesn't match DB and doesn't match ENV
      }
    })
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      if (isOnAdmin && nextUrl.pathname !== '/admin/login') {
        if (isLoggedIn) return true;
        return Response.redirect(new URL('/admin/login', nextUrl)); // Redirect unauthenticated users to login page
      }
      if (isLoggedIn && nextUrl.pathname === '/admin/login') {
        return Response.redirect(new URL('/admin', nextUrl));
      }
      return true;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
})
