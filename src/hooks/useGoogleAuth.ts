import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAppDispatch } from '../store/hooks';
import { googleAuth } from '../store/auth/authSlice';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const dispatch = useAppDispatch();
  const [_, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      
      const params = {
        googleToken: id_token,
        userData: {
          email: response.params.email || '',
          name: response.params.name || '',
          googleId: response.params.sub || '',
          picture: response.params.picture || ''
        }
      };

      dispatch(googleAuth(params));
    }
  }, [response]);

  return {
    signIn: promptAsync
  };
}; 