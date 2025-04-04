import AppRoutes from "./app-routes";
import AuthRoutes from "./auth-routes";
import React, { useEffect, useState } from "react";
import { User } from "@store/auth/authSlice";
import { fetchUser } from "@store/user/userSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SafeAreaViewComponent from "@components/safeAreaView";

export default function Routes() {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((state: RootState) => state?.session.session);
  const user = useSelector((state: RootState) => state?.session.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      if (session?.id && !user) {
        await dispatch(fetchUser())
          .unwrap()
          .catch((error) => {
            console.error("Erro ao carregar usuário:", error);
          });
      }
      setIsLoading(false);
    };

    checkSession();
  }, [session?.id, user, dispatch]);

  if (isLoading) {
    return (
      <SafeAreaViewComponent>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaViewComponent>
    );
  }

  if (session) {
    return (
      <SafeAreaViewComponent>
        <AppRoutes />
      </SafeAreaViewComponent>
    );
  }

  return (
    <SafeAreaViewComponent>
      <AuthRoutes />
    </SafeAreaViewComponent>
  );
}