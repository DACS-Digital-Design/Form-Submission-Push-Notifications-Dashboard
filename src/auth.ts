import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
const myEmails = JSON.parse(process.env.MY_EMAILS || '[]')

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google
  ],
  callbacks: {
    signIn({ profile }) {
      // Replace this with your own login logic, I limited
      // this to my emails only so only I can login to my instance
      return myEmails.includes((profile as any).email)
    },
    authorized: async ({ auth }) => {
      return !!auth
    },
  }
})