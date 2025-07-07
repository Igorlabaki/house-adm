import React, { useState } from "react";
import { Formik } from "formik";
import { forgotPasswordSchema } from "../../zod/schemas/forgotPasswordSchema";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { forgotPassword } from "@store/auth/authSlice";
import { ActivityIndicator } from "react-native";
import { StyledButton, StyledText, StyledTextInput, StyledView, StyledPressable } from "styledComponents";
import Toast from "react-native-toast-message";

export default function ForgotPasswordForm({ onBack }: { onBack?: () => void }) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.session.loading);
  const [success, setSuccess] = useState(false);

  return (
    <StyledView className="w-full max-w-md mx-auto my-10 p-8  flex flex-col gap-y-6">
      <StyledText className="text-center text-gray-600 mb-4">Digite seu e-mail para receber as instruções de recuperação.</StyledText>
      <Formik
        initialValues={{ email: "" }}
        validationSchema={toFormikValidationSchema(forgotPasswordSchema)}
        onSubmit={async (values, { resetForm }) => {
          setSuccess(false);
          const result = await dispatch(forgotPassword(values.email));
          if (forgotPassword.fulfilled.match(result)) {
            setSuccess(true);
            resetForm();
          } else {
            Toast.show({
              type: "danger",
              text1: "Erro",
              text2: result.payload as string || "Erro ao enviar instruções."
            });
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
          <>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-eventhub-text text-[14px] font-semibold">E-mail</StyledText>
              <StyledTextInput
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder={errors.email ? String(errors.email) : "seu@email.com"}
                placeholderTextColor={errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"}
                className={`rounded-md px-3 py-2 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${errors.email ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth" : "bg-white"}`}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </StyledView>
            <StyledPressable
              onPress={() => { if (!loading) handleSubmit(); }}
              className={`bg-eventhub-primaryDark py-3 mt-5 rounded-md ${loading ? 'opacity-60' : ''}`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <StyledText className="font-bold text-custom-white text-center">Enviar instruções</StyledText>
              )}
            </StyledPressable>
            {success && (
              <StyledText className="text-green-700 text-center mt-2">Instruções enviadas para seu e-mail!</StyledText>
            )}
            {onBack && (
              <StyledPressable onPress={onBack} className="mt-2 bg-transparent border-0">
                <StyledText className="text-eventhub-primaryDark text-center underline">Voltar para login</StyledText>
              </StyledPressable>
            )}
          </>
        )}
      </Formik>
    </StyledView>
  );
} 