import { Formik } from "formik";
import { useState } from "react";
import { ImageType } from "type";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import Toast from "react-native-simple-toast";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { UpdateImageRequestParams, updateImageRequestParams } from "@schemas/image/update-image-in-db-params-schema";
import {
  updateImageByIdAsync,
  updateImageInfoByIdAsync,
} from "@store/image/imagesSlice";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";

interface ImageFormProps {
  imageItem: ImageType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdateImageForm({ imageItem, setIsModalOpen }: ImageFormProps) {
  const [newImage, setNewImage] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

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
    }

    return result.assets[0].uri
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

    return result.assets[0].uri
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={toFormikValidationSchema(updateImageRequestParams)}
      initialValues={{
        tag: imageItem?.tag,
        imageId: imageItem?.id, 
        imageUrl: imageItem?.imageUrl,
        description: imageItem?.description,
        position: String(imageItem?.position),
        responsiveMode: imageItem?.responsiveMode,
      }}
      validate={(values) => {
        try {
          updateImageRequestParams.parse(values);
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
      onSubmit={async (values: UpdateImageRequestParams) => {
        if (newImage) {
          const uriParts = newImage.split(".");
          const fileType = uriParts[uriParts.length - 1];

          const formData = new FormData();
          formData.append("file", {
            uri: newImage,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          } as any);
          formData.append("tag", values.tag);
          formData.append("position", values.position);
          formData.append("imageId", String(values.imageId)); // Convertendo para string
          formData.append("description", values.description);
          formData.append("imageUrl", String(values.imageUrl)); // Convertendo para string
          formData.append("responsiveMode", values.responsiveMode); // Convertendo boolean para string
          
          const response = await dispatch(updateImageByIdAsync(formData));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Imagem atualizada com sucesso.", 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload.data, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
          }
        }
        if (!newImage) {
          const response = await dispatch(updateImageInfoByIdAsync({
            ...values
          }));

          if (response?.meta?.requestStatus == "fulfilled") {
            Toast.show("Imagem atualizada com sucesso.", 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
          }

          if (response?.meta?.requestStatus == "rejected") {
            Toast.show(response?.payload?.data, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
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
                {(newImage || imageItem) && (
                  <Image
                    source={{ uri: newImage ? newImage : imageItem.imageUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                )}
              </StyledView>
              <StyledView className=" flex justify-center flex-row items-center gap-x-10 py-3 w-full">
                <StyledPressable
                  onPress={async () => {
                    const url = await pickImage();
                    setFieldValue("imageUrl", url);
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
                    setFieldValue("imageUrl", url);
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
                  errors.position
                    ? errors.position
                    : "Digite a posicao da imagem"
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
                Descricao
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                placeholder={
                  errors.description
                    ? errors.description
                    : "Type the description"
                }
                placeholderTextColor={
                  errors.description ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.description
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
                    : "Digite a resonsividade da imagem"
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
