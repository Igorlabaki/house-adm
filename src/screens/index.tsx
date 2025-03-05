import AppRoutes from "./app-routes";
import AuthRoutes from "./auth-routes";
import React, { useEffect } from "react";
import { User } from "@store/auth/authSlice";
import { fetchUser } from "@store/user/userSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Routes() {
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state: RootState) => state?.user.user);
  const session = useSelector((state: RootState) => state?.session.session);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch, session?.id]);

  if (user?.id) {
    return (
      <SafeAreaProvider>
        <AppRoutes />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthRoutes />
    </SafeAreaProvider>
  );
}
