import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";

import { ImageType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createImageFormSchema } from "@schemas/createImageFormZodSchema";
import { createImageAsync, updateImageByIdAsync } from "@store/image/imagesSlice";
import { StyledPressable, StyledText, StyledTextInput, StyledView } from "styledComponents";
interface ImageFormProps {
  image?: ImageType;
}

export function ImageForm({ image }: ImageFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );

  /* const [urlImage, setUrlImage] = useState(); */

  async function handleFile() {

    const formData = new FormData();
    

    formData.append('api_key', '972746539144337');
    formData.append('api_secret', '-odjGAqU-hd76JQeZUCHx5tbC8Y');
    formData.append('upload_preset', 'onbridge');

    return await fetch('https:api.cloudinary.com/v1_1/dcjkvwbvh/image/upload', {
      method: 'post',
      body: formData,
    }).then((res) => res.json());
  }

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createImageFormSchema)}
      initialValues={{
        id: image?.id && image.id,
        imageUrl: image?.imageUrl && image.imageUrl,
        area: image?.area && image.area,
        responsiveMode: image?.responsiveMode && image.responsiveMode,
        position: image?.position && image.position,
        tag: image?.tag && image?.tag,
      }}
      validate={(values) => {
        try {
          createImageFormSchema.parse(values);
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
      onSubmit={async (values: ImageType) => {
        if (!image) {
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
          const updatedText = await dispatch(
            updateImageByIdAsync({
              imageId: image.id,
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
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="relative h-[10rem] w-full flex flex-col gap-y-2">
              <StyledPressable
                onPress={() => handleFile}
                id="rgPhotos"
                className="absolute w-full opacity-0 cursor-pointer top-4"
              />
              <StyledView className="h-16 w-full border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] flex justify-start items-center px-5 gap-x-5 cursor-pointer hover:bg-gray-100 transition duration-300">
                <StyledText className="text-sm">Clique aqui para adicinar foto. </StyledText>
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
                value={values.position.toString()}
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
              {image ? "UPDATE" : "CREATE"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
