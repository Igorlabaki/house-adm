import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { QuestionType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { createQuestionFormSchema } from "@schemas/createQuestionFormZodSchema";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import {
  createQuestionAsync,
  updateQuestionByIdAsync,
} from "@store/question/questionSlice";
import { Venue } from "@store/venue/venueSlice";

interface TextFormProps {
  question?: QuestionType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QuestionFormComponent({
  question,
  setIsModalOpen,
}: TextFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
  );

  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );
  return (
    <Formik
      validationSchema={toFormikValidationSchema(createQuestionFormSchema)}
      initialValues={{
        venueId: venue.id,
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
          const response = await dispatch(createQuestionAsync(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Pergunta criada com sucesso." as string, 3000, {
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
        } else {
          const response = await dispatch(
            updateQuestionByIdAsync({
              venueId: venue?.id,
              questionId: question.id,
              data: {
                question: values.question,
                response: values.response,
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Pergunta atualizada com sucesso." as string, 3000, {
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
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Pergunta
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("question")}
                onBlur={handleBlur("question")}
                value={values.question}
                placeholder={
                  errors.question ? errors.question : "Digite pergunta"
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
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Resposta
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("response")}
                onBlur={handleBlur("response")}
                value={values.response}
                multiline={true}
                numberOfLines={7} // Define a altura inicial
                textAlignVertical="top" // Alinha o texto no topo
                placeholder={errors.response ? errors.response : "Digite a resposta"}
                placeholderTextColor={
                  errors.response ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white  ${
                  errors.response
                    ? "bg-red-50 border-[2px] border-red-900 "
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
              {question ? "Atualizar" : "Cadastrar"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
