import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      try {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      } catch (error) {
        console.error("Redirect error:", error)
        return baseUrl
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.id as string
        }
        return session
      } catch (error) {
        console.error("Session error:", error)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error("JWT error:", error)
        return token
      }
    },
  },
})

export { handler as GET, handler as POST } 