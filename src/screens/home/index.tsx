import { Image } from "react-native";
import { StyledView } from "styledComponents";
import ListNotifications from "./notifications/listNotifications";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";


export function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchNotificationsList())
  }, []);

  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <StyledView className="w-full justify-center items-center">
        <Image
          source={{uri:"https://res.cloudinary.com/dzvyh5r33/image/upload/v1729762079/WhatsApp_Image_2024-02-22_at_14.24.35-removebg-preview_receru.png"}}
          style={{ width: 400, height: 100 }}
          resizeMode="contain"
        />
      </StyledView>
      <ListNotifications />
    </StyledView>
  );
}
