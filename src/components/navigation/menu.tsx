import { View, Text, Image } from "react-native";
import React, { useState } from "react";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { logout, User } from "@store/auth/authSlice";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { UpdateUserFormComponent } from "@components/user/form/update-form";
import { StackNavigationProp } from "@react-navigation/stack";

interface MenuComponentProps {
  isModalOpen: boolean;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuComponent({
  isModalOpen,
  setMenuModalIsOpen,
}: MenuComponentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state: RootState) => state?.session.user);
  const [formIsOpen, setFormIsOpen] = useState<boolean>(false);
 
  const handleLogout = () => {
    dispatch(logout());// Redireciona para a tela de login
  };

  return (
    <StyledModal
      visible={isModalOpen}
      transparent={true}
      onRequestClose={() => {
        setMenuModalIsOpen(false);
      }}
      animationType="slide"
    >
      <StyledView className="w-screen h-screen bg-gray-reg ">
        <StyledPressable  onPress={() => setFormIsOpen(true)} className="absolute top-10 right-5">
          <FontAwesome5 name="edit" size={20} color="white" />
        </StyledPressable>
        <StyledView className="flex justify-start items-center h-full py-20">
          {user?.avatarUrl ? (
            <StyledPressable
              className="h-40 w-40 rounded-full bg-transparent overflow-hidden"
              onPress={() => setMenuModalIsOpen(true)}
            >
              <Image
                source={{
                  uri: user?.avatarUrl,
                }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />
            </StyledPressable>
          ) : (
            <StyledView className="pt-20">
              <FontAwesome5 name="user-circle" size={100} color="white" />
            </StyledView>
          )}
          <StyledView className=" flex justify-center items-center py-10">
            <StyledText className="text-white font-semibold text-2xl">
              {user?.username}
            </StyledText>
            <StyledText className="text-white font-semibold text-md">
              {user?.email}
            </StyledText>
            <StyledPressable
              onPress={() => handleLogout()}
              className="mt-10 py-2 px-4 rounded-md bg-red-900 flex justify-center items-center"
            >
              <StyledText className="font-semibold text-white">
                Logout
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledModal
        visible={formIsOpen}
        transparent={true}
        onRequestClose={() => {
          setFormIsOpen(false);
        }}
        animationType="slide"
      >
        <StyledView className="w-screen h-screen bg-gray-dark ">
          <UpdateUserFormComponent  user={user} setIsModalOpen={setFormIsOpen} />
        </StyledView>
      </StyledModal>
    </StyledModal>
  );
}
