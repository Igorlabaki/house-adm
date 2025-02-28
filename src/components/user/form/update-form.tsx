import moment from "moment";
import { Formik } from "formik";
import { Image } from "react-native";
import Toast from "react-native-simple-toast";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { transformMoneyToNumber } from "function/transform-money-to-number";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { User } from "@store/auth/authSlice";
import {
  UpdateUserRequestParams,
  updateUserSchema,
} from "@schemas/user/update-user-params-schema";
import { updateUserAsync } from "@store/user/userSlice";

interface UserFormProps {
  user: User;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateUserFormComponent({
  user,
  setIsModalOpen,
}: UserFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const formikRef = useRef(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    return result.assets[0].uri;
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a câmera é necessária!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    return result.assets[0].uri;
  };

  const loading = useSelector((state: RootState) => state?.user.loading);

  return (
    <Formik
      innerRef={formikRef}
      validationSchema={toFormikValidationSchema(updateUserSchema)}
      initialValues={{
        userId: user.id || "",
        email: user.email || "",
        username: user.username || "",
        avatarUrl: user.avatarUrl || "",
      }}
      validate={(values) => {
        try {
          updateUserSchema.parse(values);
          return {}; // Retorna um objeto vazio se os dados estiverem válidos
        } catch (error) {
          return error.errors.reduce((acc, curr) => {
            const [field, message] = curr.message.split(": ");
            return {
              ...acc,
              [field]: message || "Erro de validação",
            };
          }, {});
        }
      }}
      onSubmit={async (values: UpdateUserRequestParams) => {

        const uriParts = values.avatarUrl.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();

        formData.append("file", {
          uri: values.avatarUrl,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);

        formData.append("email", values.email);
        formData.append("userId", values.userId);
        formData.append("username", values.username);
        formData.append("avatarUrl", values.avatarUrl);

        const response = await dispatch(updateUserAsync(formData));

        if (response.meta.requestStatus == "fulfilled") {
          Toast.show(response?.payload?.message as string, 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
          setIsModalOpen(false);
        }

        if (response.meta.requestStatus == "rejected") {
          Toast.show(response.payload as string, 3000, {
            backgroundColor: "#FF9494",
            textColor: "white",
          });
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        getFieldMeta,
        setFieldValue,
        resetForm,
      }) => {
        useEffect(() => {}, []);
        return (
          <StyledView className=" w-full mx-auto my-5 flex flex-col px-3">
            <StyledView className="flex flex-col gap-2 ">
              <StyledView className="relative flex-col gap-y-2 flex justify-center items-center w-full ">
                <StyledView className="h-[320px] flex justify-center items-center w-full border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] cursor-pointer hover:bg-gray-100 transition duration-300">
                  {user?.avatarUrl || getFieldMeta("avatarUrl").value ? (
                    <Image
                      source={{
                        uri: user?.avatarUrl
                          ? user?.avatarUrl
                          : (getFieldMeta("avatarUrl").value as string),
                      }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <StyledText className="text-md text-white font-bold">
                      Selecione a foto de perfil
                    </StyledText>
                  )}
                </StyledView>
                <StyledView className=" flex justify-center flex-row items-center gap-x-10 py-3 w-full">
                  <StyledPressable
                    onPress={async () => {
                      const url = await pickImage();
                      setFieldValue("avatarUrl", url);
                    }}
                  >
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={24}
                      color="white"
                    />
                  </StyledPressable>
                  <StyledPressable
                    onPress={async () => {
                      const url = await takePhoto();
                      setFieldValue("avatarUrl", url);
                    }}
                  >
                    <MaterialIcons name="add-a-photo" size={24} color="white" />
                  </StyledPressable>
                </StyledView>
                <StyledText className="text-red-700 text-[15px] w-full">
                  {errors.avatarUrl && errors.avatarUrl}
                </StyledText>
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome de usuario
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                  placeholder={
                    errors.username ? errors.username : "Digite pergunta"
                  }
                  placeholderTextColor={
                    errors.username ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.username
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Email
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={String(values?.email)}
                  placeholder={
                    errors.email ? String(errors.email) : "Digite o email"
                  }
                  placeholderTextColor={
                    errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.email
                      ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
            </StyledView>
            <StyledView className="flex flex-col justify-center items-center gap-y-2 w-full mt-5">
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-gray-ligth flex justify-center items-center py-3  rounded-md w-full"
              >
                <StyledText className="font-bold text-custom-white">
                  {loading ? "Enviando" : "Atualizar"}
                </StyledText>
              </StyledPressable>
            </StyledView>
          </StyledView>
        );
      }}
    </Formik>
  );
}
