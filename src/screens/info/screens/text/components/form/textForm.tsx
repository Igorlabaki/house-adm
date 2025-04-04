import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { TextType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { createTextFormSchema } from "@schemas/createTextFormZodSchema";
import { createTextAsync, updateTextByIdAsync } from "@store/text/textSlice";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";

import { Venue } from "@store/venue/venueSlice";
import { CreateTextFormData } from "@schemas/text/create-text-params-schema";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { useRef } from "react";
interface TextFormProps {
  text?: TextType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TextForm({ text, setIsModalOpen }: TextFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.textList.error
  );
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const flashMessageRef = useRef(null);

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createTextFormSchema)}
      initialValues={{
        venueId: venue.id,
        text: text?.text && text.text,
        area: text?.area && text.area,
        title: text?.title ? text.title : null,    
        position: text?.position ? text.position : 0,
      }}
      validate={(values) => {
        try {
          createTextFormSchema.parse(values);
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
      onSubmit={async (values: CreateTextFormData) => {
        if (!text) {
          const response = await dispatch(
            createTextAsync({
              venueId: venue.id,
              area: values.area,
              text: values.text,
              title: values?.title,
              position: Number(values.position),
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response.payload.message, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false)
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload  as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        } else {
          const response = await dispatch(
            updateTextByIdAsync({
              textId: text.id,
              venueId: venue?.id,
              data: {
                area: values.area,
                text: values.text,
                title: values.title,
                position: Number(values.position),
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response.payload.message, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false)
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col" ref={flashMessageRef}>
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Area
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("area")}
                onBlur={handleBlur("area")}
                value={values.area}
                placeholder={
                  errors.area ? errors.area : "Digite a area do texto"
                }
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
                Titulo
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                placeholder={
                  errors.title ? errors.title : "Digite o titulo do texto"
                }
                placeholderTextColor={
                  errors.title ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                  errors.title
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Posicao
              </StyledText>
              <StyledTextInput
                keyboardType="numeric"
                onChangeText={handleChange("position")}
                onBlur={handleBlur("position")}
                value={String(values.position)}
                placeholder={
                  errors.position
                    ? errors.position
                    : "Digite a posicao do texto"
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
                Texto
              </StyledText>
              <StyledTextInput
                multiline={true}
                numberOfLines={15}
                value={values.text}
                onChangeText={handleChange("text")}
                placeholder={errors.text ? errors.text : "Digite o texto"}
                style={{ textAlignVertical: "top" }}
                placeholderTextColor={
                  errors.text ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`bg-gray-ligth rounded-md p-3 text-white ${
                  errors.text
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {text ? "Atualizar" : "Cadastar"}
            </StyledText>
          </StyledPressable>
          <FlashMessage ref={flashMessageRef} />
        </StyledView>
      )}
    </Formik>
  );
}
