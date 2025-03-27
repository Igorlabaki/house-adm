import { useState } from "react";
import { Formik } from "formik";
import { ImageType } from "type";
import { Image } from "react-native";
import { api } from "services/axios";
import Toast from "react-native-simple-toast";
import { Venue } from "@store/venue/venueSlice";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createImageFormSchema } from "@schemas/createImageFormZodSchema";
import { updateImageRequestParams } from "@schemas/image/update-image-in-db-params-schema";
import {
  createImageAsync,
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
import {
  createImageRequestParams,
  CreateImageRequestParams,
} from "@schemas/image/create-image-params-schema";
import * as FileSystem from "expo-file-system";

interface ImageFormProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function CreateImageForm({ setIsModalOpen }: ImageFormProps) {
  const [newImage, setNewImage] = useState(null);
  const dispatch = useDispatch<AppDispatch>();

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const isLoading: boolean = useSelector(
    (state: RootState) => state.imageList.loading
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      Toast.show("Permissão para acessar as fotos é necessária!", 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
  
      // Obtém informações do arquivo
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
  
      if (!fileInfo.exists) {
        console.error("Não foi possível obter informações do arquivo.");
        return;
      }
  
      const fileSizeInMB = fileInfo.size / (1024 * 1024); // Converte para MB
  
  
      if (fileSizeInMB > 2.5) {
        Toast.show("Imagem maior que 2.5 MB.", 3000, {
          backgroundColor: "rgb(75,181,67)",
          textColor: "white",
        });
        return;
      }
  
      return imageUri;
    }
  };

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={toFormikValidationSchema(createImageFormSchema)}
      initialValues={{
        venueId: venue?.id,
        tag: "",
        position: "",
        imageUrl: "",
        description: "",
        responsiveMode: "",
      }}
      validate={(values) => {
        try {
          createImageRequestParams.safeParse(values);
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
      onSubmit={async (values: CreateImageRequestParams) => {
        if (!values.imageUrl) {
          Toast.show("Selecione uma imagem.", 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
        }

        if (!values.imageUrl) {
          Toast.show("Imagem maior que 2.5 MB.", 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
        }

        const uriParts = values.imageUrl.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();
        formData.append("file", {
          uri: values.imageUrl,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
        
        formData.append("tag", values.tag);
        formData.append("position", values.position);
        formData.append("venueId", venue?.id); // Convertendo para string
        formData.append("description", values.description);
        formData.append("responsiveMode", values.responsiveMode); // Convertendo boolean para string

        const response = await dispatch(createImageAsync(formData));

        if (response.meta.requestStatus == "fulfilled") {
          Toast.show("Imagem enviada com sucesso.", 3000, {
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
      }}
    >
      {({
        values,
        errors,
        handleBlur,
        getFieldMeta,
        handleSubmit,
        handleChange,
        setFieldValue,
      }) => (
        <StyledScrollView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="relative flex-col gap-y-2 flex justify-center items-center w-full ">
              <StyledView className="h-[200px] flex justify-center items-center w-full border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] cursor-pointer hover:bg-gray-100 transition duration-300">
                {getFieldMeta("imageUrl").value && (
                  <Image
                    source={{ uri: getFieldMeta("imageUrl").value as string }}
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
                  {/* Se você quiser adicionar texto ou outros filhos, pode fazer aqui */}
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
            disabled={isLoading ? true : false}
            onPress={() => {
              handleSubmit();
            }}
            className={`bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md`}
          >
            <StyledText className="font-bold text-custom-white">
              {isLoading ? "Enviando" : "Cadastrar"}
            </StyledText>
          </StyledPressable>
        </StyledScrollView>
      )}
    </Formik>
  );
}
