import NextAuth from "next-auth";
import GoogleProvider from "../../../providers/GoogleProvider";
import axios from "axios";

export default NextAuth({
  providers: [GoogleProvider],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token, user }) {
      session.jwt = token.jwt;
      session.id = token.id;
      return session;
    },

    async jwt({ token, user, account }) {
      const isSignIn = user ? true : false;
      const now = new Date();
      const trialExpires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (isSignIn) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/auth/${account.provider}/callback?access_token=${account?.access_token}`,
            {
              params: {
                access_token: account?.access_token,
              },
            }
          );
          const data = response.data;

          if (data.user.payment_duration === null) {
            await axios
              .put(
                `${process.env.NEXT_PUBLIC_BUILDING_URL}/api/users/${data.user.id}`,
                {
                  payment_duration: 'month',
                  payment_plan: {
                    connect: [{ id: 1 }],
                  },
                  trial_expires: trialExpires,
                  trial_used: true
                }
              )
          }

          token.jwt = data.jwt;
          token.id = data.user.id;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      return token;
    },
  },
});
