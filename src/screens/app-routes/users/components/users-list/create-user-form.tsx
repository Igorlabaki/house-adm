import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { AppDispatch, RootState } from "@store/index";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { Venue } from "@store/venue/venueSlice";
import {
  RegisterUserRequestParams,
  registerUserSchema,
} from "@schemas/user/register-user-params-schema";
import { User } from "@store/auth/authSlice";
import { registerUser } from "@store/userList/user-list-slice";

interface TextFormProps {
  setUser: React.Dispatch<React.SetStateAction<User>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">
  >;
}

export function UserFormComponent({
  setIsModalOpen,
  setFormSection,
  setUser,
}: TextFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <StyledView className="bg-gray-dark h-full">
      <Formik
        validationSchema={toFormikValidationSchema(registerUserSchema)}
        initialValues={{
          password: "teste1234",
        }}
        validate={(values) => {
          try {
            registerUserSchema.parse(values);
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
        onSubmit={async (values: RegisterUserRequestParams) => {
          const response = await dispatch(registerUser(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response.payload.message, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
            setUser(response.payload.data);
            setFormSection("NEW_VENUE");
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
            <StyledView className="flex flex-col gap-y-3">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome do usuario
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
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.email
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  placeholder={
                    errors.email
                      ? errors.email.toString()
                      : "Digite o email do cliente..."
                  }
                  placeholderTextColor={
                    errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Senha
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                  placeholder={
                    errors.password ? errors.password : "Digite a resposta"
                  }
                  placeholderTextColor={
                    errors.password ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-3 text-white flex justify-start items-start ${
                    errors.password
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
                Cadastrar
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
    </StyledView>
  );
}
