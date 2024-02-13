import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { TextType, ValueType } from "../../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Pressable, Text, TextInput, View } from "react-native";
import { AppDispatch, RootState } from "../../../../../../store";
import { createValueFormSchema } from "../../../../../../zod/schemas/createValueFormZodSchema";
import {
  createValueAsync,
  updateValueByIdAsync,
} from "../../../../../../store/value/valuesSlice";

interface ValueFormProps {
  value?: ValueType;
}

export function ValueForm({ value }: ValueFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.valueList.error
  );
  return (
    <Formik
      validationSchema={toFormikValidationSchema(createValueFormSchema)}
      initialValues={{
        id: value?.id && value.id,
        titulo: value?.titulo && value.titulo,
        valor: value?.valor && value?.valor,
      }}
      validate={(values) => {
        try {
          createValueFormSchema.parse(values);
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
      onSubmit={async (values: ValueType) => {
        if (!value) {
          const newText = await dispatch(
            createValueAsync({
              valor: Number(values.valor),
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
        } else {
          const updatedText = await dispatch(
            updateValueByIdAsync({
              valueId: value.id,
              data: {
                valor: Number(values.valor),
                titulo: values?.titulo,
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
        <View className="w-[90%] mx-auto my-5 flex flex-col">
          <View className="flex flex-col gap-y-3">
            <View className="flex flex-col gap-y-1">
              <View className="flex flex-col gap-y-1">
                <Text className="text-custom-gray text-[14px] font-semibold">
                  Title
                </Text>
                <TextInput
                  onChangeText={handleChange("titulo")}
                  onBlur={handleBlur("titulo")}
                  value={values.titulo}
                  placeholder={errors.titulo ? errors.titulo : "Type the title"}
                  placeholderTextColor={
                    errors.titulo ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.titulo
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </View>
              <Text className="text-custom-gray text-[14px] font-semibold">
                Valor
              </Text>
              <TextInput
                keyboardType="numeric"
                onChangeText={handleChange("valor")}
                onBlur={handleBlur("valor")}
                value={values?.valor ? String(values.valor) : ""}
                placeholder={
                  errors.valor ? errors.valor : "Type the value"
                }
                placeholderTextColor={
                  errors.valor ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.valor
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </View>
          </View>
          <Pressable
            onPress={() => handleSubmit()}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <Text className="font-bold text-custom-white">
              {value ? "UPDATE" : "CREATE"}
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
}
