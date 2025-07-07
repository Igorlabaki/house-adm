import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAppDispatch } from '../store/hooks';
import { googleAuth } from '../store/auth/authSlice';
import { useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt_decode = require('jwt-decode');

WebBrowser.maybeCompleteAuthSession();

type GoogleIdTokenPayload = {
  email: string;
  name: string;
  sub: string;
  picture: string;
};

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const decoded: GoogleIdTokenPayload = jwt_decode(id_token);

      const params = {
        googleToken: id_token,
        userData: {
          email: decoded.email,
          name: decoded.name,
          googleId: decoded.sub,
          picture: decoded.picture,
        }
      };

      dispatch(googleAuth(params));
    }
  }, [response]);

  return {
    signIn: promptAsync
  };
};