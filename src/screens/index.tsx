
import AppRoutes from "./app-routes";
import AuthRoutes from "./auth-routes";
import React, { useEffect } from "react";
import { User } from "@store/auth/authSlice";
import { fetchUser } from "@store/user/userSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";

export default function Routes() {
  const dispatch = useDispatch<AppDispatch>();
  const user : User = useSelector((state: RootState) => state?.user.user);
  const session  = useSelector((state: RootState) => state?.session.session);

  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch,session?.id])
 
  /*   
    if (userDataLoading) {
      return (
        <StyledView className="h-screen w-screen bg-gray-dark flex justify-center items-center gap-y-4">
          <Image
            source={{
              uri: "https://res.cloudinary.com/dzvyh5r33/image/upload/v1729762079/WhatsApp_Image_2024-02-22_at_14.24.35-removebg-preview_receru.png",
            }}
            style={{ width: 400, height: 100 }}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#ffff" />
        </StyledView>
      );
    }
 */

  if (user?.id) {
    return <AppRoutes />;
  }

  return <AuthRoutes />;
}
