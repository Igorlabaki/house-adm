import React, { useState } from "react";
import { Formik } from "formik";
import { registerUserSchema } from "@schemas/user/register-user-params-schema";
import {
  StyledButton,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { registerUser } from "@store/auth/authSlice";
import { showMessage } from "react-native-flash-message";
import { ActivityIndicator } from "react-native";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.session.loading);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn: googleSignIn } = useGoogleAuth();

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      validationSchema={toFormikValidationSchema(registerUserSchema)}
      initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
      validate={(values) => {
        try {
          registerUserSchema.parse(values);
          if (values.password !== values.confirmPassword) {
            return { confirmPassword: "As senhas não coincidem" };
          }
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
      onSubmit={async (values, { resetForm }) => {
        const { confirmPassword, ...params } = values;
        const response = await dispatch(registerUser(params));
        if (response.meta.requestStatus === "fulfilled") {
          showMessage({
            duration: 3000,
            floating: true,
            type: "success",
            position: "bottom",
            message: `Conta criada com sucesso!`,
          });
          resetForm();
        } else {
          showMessage({
            type: "danger",
            floating: true,
            duration: 3000,
            message: "Erro ao criar conta",
            description: response.payload as string,
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
      }) => (
        <StyledView className="w-full mx-auto my-5 flex flex-col gap-y-4 mt-5 px-10">
          <StyledView className="flex flex-col gap-y-1">
            <StyledText className="text-eventhub-text text-[14px] font-semibold">
              Nome completo
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={String(values?.username)}
              placeholder={errors.username ? String(errors.username) : "Seu nome"}
              placeholderTextColor={errors.username ? "rgb(127 29 29)" : "rgb(156 163 175)"}
              className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                errors.username
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-white"
              }`}
            />
          </StyledView>
          <StyledView className="flex flex-col gap-y-1">
            <StyledText className="text-eventhub-text text-[14px] font-semibold">
              Email
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("email")}
              onBlur={handleBlur("email")}
              value={String(values?.email)}
              placeholder={errors.email ? String(errors.email) : "seu@email.com"}
              placeholderTextColor={errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"}
              className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                errors.email
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-white"
              }`}
            />
          </StyledView>
          <StyledView className="flex flex-col gap-y-1 relative">
            <StyledText className="text-eventhub-text text-[14px] font-semibold">
              Senha
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={String(values?.password)}
              placeholder={errors.password ? String(errors.password) : "********"}
              placeholderTextColor={errors.password ? "rgb(127 29 29)" : "rgb(156 163 175)"}
              secureTextEntry={showPassword ? false : true}
              className={`rounded-md px-3 py-1 pr-7 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                errors.password
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-white"
              }`}
            />
            <StyledView className="absolute top-1/2 right-3 -translate-y-1/2">
              {showPassword ? (
                <Entypo
                  name="eye"
                  size={16}
                  color="#333"
                  onPress={() => setShowPassword(false)}
                />
              ) : (
                <Entypo
                  name="eye-with-line"
                  size={16}
                  color="#333"
                  onPress={() => setShowPassword(true)}
                />
              )}
            </StyledView>
          </StyledView>
          <StyledView className="flex flex-col gap-y-1 relative">
            <StyledText className="text-eventhub-text text-[14px] font-semibold">
              Confirmar senha
            </StyledText>
            <StyledTextInput
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={String(values?.confirmPassword)}
              placeholder={errors.confirmPassword ? String(errors.confirmPassword) : "********"}
              placeholderTextColor={errors.confirmPassword ? "rgb(127 29 29)" : "rgb(156 163 175)"}
              secureTextEntry={showPassword ? false : true}
              className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                errors.confirmPassword
                  ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                  : "bg-white"
              }`}
            />
          </StyledView>
          <StyledPressable
            onPress={() => handleSubmit()}
            className="bg-eventhub-primaryDark flex justify-center items-center py-3 mt-5 rounded-md"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <StyledText className="font-bold text-custom-white">
                Criar conta
              </StyledText>
            )}
          </StyledPressable>
          <StyledView className="flex flex-row items-center my-1">
            <StyledView className="flex-1 h-[1px] bg-gray-600" />
            <StyledText className="mx-4 text-eventhub-text font-semibold">OU</StyledText>
            <StyledView className="flex-1 h-[1px] bg-gray-600" />
          </StyledView>
          <StyledPressable
            onPress={() => googleSignIn()}
            className="bg-[#EA4335] flex flex-row justify-center items-center py-3 rounded-md shadow-sm"
            disabled={loading}
          >
            <AntDesign
              name="google"
              size={20}
              color="white"
              style={{ marginRight: 10 }}
            />
            <StyledText className="font-medium text-white">
              Registrar com Google
            </StyledText>
          </StyledPressable>
          <StyledView className="flex flex-row justify-center items-center gap-x-2">
            <StyledText className="text-eventhub-text">
              Já tem uma conta?
            </StyledText>
            <StyledPressable onPress={onSwitchToLogin}>
              <StyledText className="text-eventhub-primaryDark font-semibold">
                Entrar
              </StyledText>
            </StyledPressable>
          </StyledView>
        </StyledView>
      )}
    </Formik>
  );
} 