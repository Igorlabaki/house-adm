import AppRoutes from "./app-routes";
import AuthRoutes from "./auth-routes";
import React, { useEffect, useState } from "react";
import { loadSession } from "@store/auth/authSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import SafeAreaViewComponent from "@components/safeAreaView";

export default function Routes() {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => state.session.session);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Carrega a sessão salva
        await dispatch(loadSession()).unwrap();
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, [dispatch]);

  if (isLoading) {
    return (
      <SafeAreaViewComponent>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaViewComponent>
    );
  }

  // Se tiver sessão válida, mostra as rotas do app
  if (session?.isValid) {
    return (
      <SafeAreaViewComponent>
        <AppRoutes />
      </SafeAreaViewComponent>
    );
  }

  // Caso contrário, mostra as rotas de autenticação
  return (
    <SafeAreaViewComponent>
      <AuthRoutes />
    </SafeAreaViewComponent>
  );
}