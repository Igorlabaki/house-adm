import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { QuestionType } from "../../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Pressable, Text, TextInput, View } from "react-native";
import { AppDispatch, RootState } from "../../../../../../store";
import { createQuestionFormSchema } from "../../../../../../zod/schemas/createQuestionFormZodSchema";
import {
  createQuestionAsync,
  updateQuestionByIdAsync,
} from "../../../../../../store/question/questionSlice";
import { createDateEvent, createDateEventAsync } from "../../../../../../store/dateEvent/dateEventSlice";

interface TextFormProps {
  question?: QuestionType;
}

export function QuestionFormComponent({ question }: TextFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
  );

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createQuestionFormSchema)}
      initialValues={{
        id: question?.id && question.id,
        question: question?.question && question.question,
        response: question?.response && question.response,
      }}
      validate={(values) => {
        try {
          createQuestionFormSchema.parse(values);
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
      onSubmit={async (values: QuestionType) => {
        if (!question) {
          const newQuestion = await dispatch(
            createQuestionAsync({
              question: values.question,
              response: values?.response,
            })
          );

          if (newQuestion.meta.requestStatus == "fulfilled") {
            Toast.show("Question created successfully." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (newQuestion.meta.requestStatus == "rejected") {
            Toast.show(error as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        } else {
          const updatedQuestion = await dispatch(
            updateQuestionByIdAsync({
              questionId: question.id,
              data: {
                question: values.question,
                response: values.response,
              },
            })
          );

          if (updatedQuestion.meta.requestStatus == "fulfilled") {
            Toast.show("Question updated successfully." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (updatedQuestion.meta.requestStatus == "rejected") {
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
                Question
              </Text>
              <TextInput
                onChangeText={handleChange("question")}
                onBlur={handleBlur("question")}
                value={values.question}
                placeholder={
                  errors.question ? errors.question : "Type the question"
                }
                placeholderTextColor={
                  errors.question ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.question
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </View>
            <View className="flex flex-col gap-y-1">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Answer
              </Text>
              <TextInput
                onChangeText={handleChange("response")}
                onBlur={handleBlur("response")}
                value={values.response}
                placeholder={
                  errors.response ? errors.response : "Type the answer"
                }
                placeholderTextColor={
                  errors.response ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.response
                    ? "bg-red-50 border-[2px] border-red-900 "
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
              {question ? "UPDATE" : "CREATE"}
            </Text>
          </Pressable>
        </View>
      )}
    </Formik>
  );
}
