import GoogleProvider from "next-auth/providers/google";

const options = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
  
  const provider = GoogleProvider(options);
  
  export default provider;
  