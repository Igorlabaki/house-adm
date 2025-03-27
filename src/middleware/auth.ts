import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthMiddleware = ({ navigation, children }: { navigation: any; children: React.ReactNode }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        navigation.replace('Login'); // Redireciona para a tela de login se não houver token
      }
    };

    checkAuth();
  }, [navigation]);

  // Renderizar um `ActivityIndicator` enquanto a verificação está em andamento.
  return {children};
};

export default AuthMiddleware;