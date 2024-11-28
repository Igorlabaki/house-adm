import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";

import { ImageType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createImageFormSchema } from "@schemas/createImageFormZodSchema";
import {
  createImageAsync,
  updateImageByIdAsync,
} from "@store/image/imagesSlice";
import {
  StyledButton,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { useState } from "react";
import { Button, Image, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
interface ImageFormProps {
  imageItem?: ImageType;
}

export function ImageForm({ imageItem }: ImageFormProps) {
  const [newImage, setNewImage] = useState(null);
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );

  /* const [urlImage, setUrlImage] = useState(); */

  async function handleFile() {
    const formData = new FormData();

    formData.append("api_key", "972746539144337");
    formData.append("api_secret", "-odjGAqU-hd76JQeZUCHx5tbC8Y");
    formData.append("upload_preset", "onbridge");

    if (newImage) {
      const uriParts = newImage.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("file", {
        uri: newImage,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);

      // Envia a imagem para o Cloudinary
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dzvyh5r33/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Upload bem-sucedido:", data);
      return data;
    } else {
      console.log("Nenhuma imagem foi selecionada.");
    }
  }

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

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
      setNewImage(result.assets[0].uri);
    }
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

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
    }
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={toFormikValidationSchema(createImageFormSchema)}
      initialValues={{
        id: imageItem?.id && imageItem.id,
        imageUrl: imageItem?.imageUrl && imageItem.imageUrl,
        area: imageItem?.area && imageItem.area,
        responsiveMode: imageItem?.responsiveMode && imageItem.responsiveMode,
        position: imageItem?.position && imageItem.position,
        tag: imageItem?.tag && imageItem.tag,
      }}
      validate={(values) => {
        try {
          createImageFormSchema.parse(values);
          return {};
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
      onSubmit={async (values: ImageType) => {
        if (!imageItem) {
          handleFile();
          const newText = await dispatch(
            createImageAsync({
              tag: values?.tag,
              area: values.area,
              imageUrl: values.imageUrl,
              position: Number(values.position),
              responsiveMode: values?.responsiveMode,
            })
          );

          if (newText.meta.requestStatus == "fulfilled") {
            Toast.show("Text created successfully." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (newText.meta.requestStatus == "rejected") {
            Toast.show(error as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        } else {
          handleFile();
          const updatedText = await dispatch(
            updateImageByIdAsync({
              imageId: imageItem.id,
              data: {
                tag: values?.tag,
                area: values.area,
                imageUrl: values.imageUrl,
                position: Number(values.position),
                responsiveMode: values?.responsiveMode,
              },
            })
          );

          if (updatedText.meta.requestStatus == "fulfilled") {
            Toast.show("Text updated successfully." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (updatedText.meta.requestStatus == "rejected") {
            Toast.show(error as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        values,
        errors,
      }) => (
        <StyledScrollView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="relative flex-col gap-y-2 flex justify-center items-center w-full ">
              <StyledView className="h-[200px] flex justify-center items-center w-full border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] cursor-pointer hover:bg-gray-100 transition duration-300">
                {newImage || imageItem && (
                  <Image
                    source={{ uri: newImage ? newImage : imageItem.imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                )}
              </StyledView>
              <StyledView className=" flex justify-center flex-row items-center gap-x-10 py-3 w-full">
                <StyledPressable
                  onPress={() => {
                    pickImage();
                    setFieldValue("imageUrl", newImage);
                  }}
                >
                  <MaterialIcons
                    name="add-photo-alternate"
                    size={24}
                    color="white"
                  />
                  {/* Se você quiser adicionar texto ou outros filhos, pode fazer aqui */}
                </StyledPressable>
                <StyledPressable
                  onPress={() => {
                    takePhoto();
                    setFieldValue("imageUrl", newImage);
                  }}
                >
                  <MaterialIcons name="add-a-photo" size={24} color="white" />
                </StyledPressable>
              </StyledView>
              <StyledText className="text-red-700 text-[15px] w-full">
                {errors.imageUrl && errors.imageUrl}
              </StyledText>
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Position
              </StyledText>
              <StyledTextInput
                keyboardType="numeric"
                onChangeText={handleChange("position")}
                onBlur={handleBlur("position")}
                value={values?.position?.toString()}
                placeholder={
                  errors.position ? errors.position : "Type the position"
                }
                placeholderTextColor={
                  errors.position ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.position
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Area
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("area")}
                onBlur={handleBlur("area")}
                value={values.area}
                placeholder={errors.area ? errors.area : "Type the area"}
                placeholderTextColor={
                  errors.area ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.area
                    ? "bg-red-50 border-[2px] border-red-900 "
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Tag
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("tag")}
                onBlur={handleBlur("tag")}
                value={values.tag}
                placeholder={errors.tag ? errors.tag : "Type the tag"}
                placeholderTextColor={
                  errors.tag ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                  errors.tag
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Responsive mode
              </StyledText>
              <StyledTextInput
                value={values.responsiveMode}
                onChangeText={handleChange("responsiveMode")}
                placeholder={
                  errors.responsiveMode
                    ? errors.responsiveMode
                    : "Type the responsive mode"
                }
                style={{ textAlignVertical: "top" }}
                placeholderTextColor={
                  errors.responsiveMode ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`bg-gray-ligth rounded-md p-3 text-white ${
                  errors.responsiveMode
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => handleSubmit()}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {imageItem ? "UPDATE" : "CREATE"}
            </StyledText>
          </StyledPressable>
        </StyledScrollView>
      )}
    </Formik>
  );
}
