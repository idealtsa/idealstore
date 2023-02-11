import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongodb";
import { User } from "@/models";
const options = {
  site: process.env.NEXTAUTH_URL,
};
export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: "idealstore",
  }),
  providers: [
    // OAuth authentication providers

      CredentialsProvider({
        name: 'credentials',
        async authorize(credentials, req) {
            const { email, password } = credentials;
            // Check if email and password is entered
            if (!email || !password) {
                throw new Error('Please enter email or password');
            }
            // Find user in the database
            const user = await User.findOne({ email }).select('+password')
            if (!user) {
                throw new Error('Invalid Email or Password')
            }
            // Check if password is correct or not
            const isPasswordMatched = await User.comparePassword(password);
            if (!isPasswordMatched) {
                throw new Error('Invalid Email or Password')
            }
            return Promise.resolve(user)
        },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    encryption: true,
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    }
  },
  pages: {
    signin: "/login",
  },
};

export default NextAuth(authOptions);
