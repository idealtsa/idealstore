import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "@/models";
import connectMongoose from "@/lib/connectMongoose";
export const authOptions = {

  providers: [
    // OAuth authentication providers

    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const { email, password } = credentials;
        // Check if email and password is entered
        if (!email || !password) {
          throw new Error("Please enter email or password");
        }
        await connectMongoose();
        // Find user in the database
        const user = await User.findOne({ email: email.toLowerCase() }).select(
          "+password"
        );
        if (!user) {
          throw new Error("Email is Not Exist!");
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
          throw new Error("Invalid Credentials or Forget Password!");
        }
        if (user.status != "Active") {
          throw new Error("Pending Account. Please Verify Your Email!");
        }
        return {name:user?.name,email:user?.email,image:user?.avatar?.url};
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
    encryption: true,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("singin auth",user, account, profile, email, credentials)
      return true
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect",url, baseUrl )
      return baseUrl
    },
    async session({ session, user, token }) {
      console.log("session",session, user, token)
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("jwt",token, user, account, profile, isNewUser)
      return token
    }
  },
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    colorScheme: "light",
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
    newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  debug: true,
};

export default NextAuth(authOptions);
