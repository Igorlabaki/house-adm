import React, { useState } from "react";
import { Formik } from "formik";
import { loginFormSchema } from "@schemas/loginFormZodSchema";
import {
  StyledButton,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import Toast from "react-native-toast-message";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { authenticateUser } from "@store/auth/authSlice";
import { showMessage } from "react-native-flash-message";
import { ActivityIndicator } from "react-native";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { AuthenticateDataResponse } from "@store/auth/authSlice";

export default function AuthForm() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.session.loading);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn: googleSignIn } = useGoogleAuth();

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={toFormikValidationSchema(loginFormSchema)}
      initialValues={{ email: "", password: "" }}
      validate={(values) => {
        try {
          loginFormSchema.parse(values);
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
      onSubmit={async (values: { email: string; password: string }) => {
        const response = await dispatch(authenticateUser(values));
        const payload = response.payload as AuthenticateDataResponse | string;

        if (response.meta.requestStatus === "rejected") {
          showMessage({
            type: "danger",
            floating: true,
            duration: 3000,
            message: "Erro na autenticação",
            description:
              typeof payload === "string" ? payload : "Erro ao autenticar",
          });
        }

        if (
          response.meta.requestStatus === "fulfilled" &&
          typeof payload !== "string"
        ) {
          showMessage({
            duration: 3000,
            floating: true,
            type: "success",
            position: "bottom",
            message: `Bem Vindo ${payload.session?.user?.username || ""}!`,
          });
        }
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        getFieldMeta,
        setFieldValue,
        resetForm,
      }) => (
        <StyledView className="w-full mx-auto my-5 flex flex-col gap-y-4 mt-10">
          <StyledView className="flex flex-col gap-y-1">
            <StyledText className="text-custom-gray text-[14px] font-semibold">
              Email
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={String(values?.email)}
              placeholder={
                errors.email ? String(errors.email) : "Digite o email"
              }
              placeholderTextColor={
                errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
              }
              className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                errors.email
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-gray-ligth"
              }`}
            />
          </StyledView>
          <StyledView className="flex flex-col gap-y-1 relative">
            <StyledText className="text-custom-gray text-[14px] font-semibold">
              Senha
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={String(values?.password)}
              placeholder={
                errors.password ? String(errors.password) : "Digite o password"
              }
              placeholderTextColor={
                errors.password ? "rgb(127 29 29)" : "rgb(156 163 175)"
              }
              secureTextEntry={showPassword ? false : true}
              className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                errors.password
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-gray-ligth"
              }`}
            />
            <StyledView className="absolute bottom-3 right-4">
              {showPassword ? (
                <Entypo
                  name="eye"
                  size={15}
                  color="white"
                  onPress={() => setShowPassword(false)}
                />
              ) : (
                <Entypo
                  name="eye-with-line"
                  size={15}
                  color="white"
                  onPress={() => setShowPassword(true)}
                />
              )}
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-gray-ligth border-[1px] border-custom-white flex flex-row justify-center items-center py-3 mt-5 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <StyledText className="font-bold text-custom-white">
                  Entrar
                </StyledText>
              </>
            )}
          </StyledPressable>

          <StyledView className="flex flex-row items-center my-1">
            <StyledView className="flex-1 h-[1px] bg-gray-600" />
            <StyledText className="mx-4 text-gray-400">ou</StyledText>
            <StyledView className="flex-1 h-[1px] bg-gray-600" />
          </StyledView>

          <StyledPressable
            onPress={() => googleSignIn()}
            className="bg-[#DB4437] flex flex-row justify-center items-center py-3 rounded-md border-[1px] border-custom-white"
            disabled={loading}
          >
            <AntDesign
              name="google"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <StyledText className="font-bold text-white">
              Entrar com Google
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
