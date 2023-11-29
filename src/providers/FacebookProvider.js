import FacebookProvider from 'next-auth/providers/facebook';

const options = {
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
};

const provider = FacebookProvider(options);

export default provider;
