import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { TextType } from "../../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Pressable, Text, TextInput, View } from "react-native";
import { AppDispatch, RootState } from "../../../../../../store";
import { createTextAsync, updateTextByIdAsync } from "../../../../../../store/text/textSlice";
import { createTextFormSchema } from "../../../../../../zod/schemas/createTextFormZodSchema";

interface TextFormProps {
  text?: TextType;
}

export function TextForm({ text }: TextFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.textList.error
  );

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createTextFormSchema)}
      initialValues={{
        id: text?.id && text.id,
        text: text?.text && text.text,
        area: text?.area && text.area,
        titulo: text?.titulo ? text.titulo : null ,
        position: text?.position && String(text.position),
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
      onSubmit={async (values: TextType) => {
        if (!text) {
          const newText = await dispatch(
            createTextAsync({
              area: values.area,
              position: Number(values.position),
              text: values.text,
              titulo: values?.titulo,
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
        }else{
          const updatedText = await dispatch(
            updateTextByIdAsync({
              textId: text.id,
              data : {
                area: values.area,
                position: Number(values.position),
                titulo: values.titulo,
                text: values.text,
              }
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
        <View className="w-[90%] mx-auto my-5 flex flex-col">
          <View className="flex flex-col gap-y-3">
            <View className="flex flex-col gap-y-1">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Position
              </Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={handleChange("position")}
                onBlur={handleBlur("position")}
                value={values.position}
                placeholder={errors.position ? errors.position : "Type the position"}
                placeholderTextColor={errors.position ? "rgb(127 29 29)" : "rgb(156 163 175)"}
                className={`rounded-md px-3 py-1 text-white ${errors.position ? "bg-red-50  border-[2px] border-red-900" : "bg-gray-ligth"}`}
              />
            </View>
            <View className="flex flex-col gap-y-1">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Area
              </Text>
              <TextInput
                onChangeText={handleChange("area")}
                onBlur={handleBlur("area")}
                value={values.area}
                placeholder={errors.area ? errors.area : "Type the area"}
                placeholderTextColor={errors.area ? "rgb(127 29 29)" : "rgb(156 163 175)"}
                className={`rounded-md px-3 py-1 text-white ${errors.area ? "bg-red-50 border-[2px] border-red-900 " : "bg-gray-ligth"}`}
              />
            </View>
            <View className="flex flex-col gap-y-1">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Title
              </Text>
              <TextInput
                onChangeText={handleChange("titulo")}
                onBlur={handleBlur("titulo")}
                value={values.titulo}
                placeholder={errors.titulo ? errors.titulo : "Type the title"}
                placeholderTextColor={errors.titulo ? "rgb(127 29 29)" : "rgb(156 163 175)"}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${errors.titulo ? "bg-red-50  border-[2px] border-red-900" : "bg-gray-ligth"}`}
              />
            </View>
            <View className="flex flex-col gap-y-1">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Text
              </Text>
              <TextInput
                multiline={true}
                numberOfLines={15}
                value={values.text}
                onChangeText={handleChange("text")}
                placeholder={errors.text ? errors.text : "Type the text"}
                style={{ textAlignVertical: "top" }}
                placeholderTextColor={errors.text ? "rgb(127 29 29)" : "rgb(156 163 175)"}
                className={`bg-gray-ligth rounded-md p-3 text-white ${errors.text ? "bg-red-50  border-[2px] border-red-900" : "bg-gray-ligth"}`}
              />
            </View>
          </View>
          <Pressable
            onPress={() => handleSubmit()}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <Text className="font-bold text-custom-white">
              {text ? "UPDATE" : "CREATE"}
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
}
