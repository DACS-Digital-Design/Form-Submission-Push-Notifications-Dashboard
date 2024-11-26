import Credentials from "@auth/core/providers/credentials";
import Google from "next-auth/providers/google";
import NextAuth, { User } from "next-auth";

const myEmails: string[] = [
  // Add your authorized emails here
  "administrator@example.com"
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (credentials.username === "administrator" && credentials.password === "password") {
          return {
            id: "admin-01",
            email: "administrator@example.com",
            name: "Administrator",
            image: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
          } as User
        }
        return null
      }
    })
  ],
  callbacks: {
    signIn({ profile, user }) {
      // Replace this with your own login logic, I limited
      // this to my emails only so only I can login to my instance
      const email = profile ? profile.email : user?.email;
      return myEmails.includes(email as string)
    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  },
})