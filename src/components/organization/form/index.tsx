import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useRef } from "react";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Toast from "react-native-simple-toast";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { createOrganizationFormSchema } from "@schemas/organization/createOrganizationZodSchema";
import {
  createOrganizationAsync,
  Organization,
  updateOrganizationAsync,
} from "@store/organization/organizationSlice";

interface OrganizationFormModalComponentProps {
  isModalOpen: boolean;
  organization?: Organization;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrganizationFormModalComponent({
  isModalOpen,
  organization,
  setMenuModalIsOpen,
}: OrganizationFormModalComponentProps) {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(
    (state: RootState) => state.userOrganizationList.loading
  );

  const error = useSelector((state: RootState) => state.organizationList.error);

  const user = useSelector((state: RootState) => state.session.user);
  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.append("userId", user?.id);
  }, [user]);

  return (
    <StyledModal
      visible={isModalOpen}
      transparent={true}
      onRequestClose={() => {
        setMenuModalIsOpen(false);
      }}
      animationType="slide"
      pointerEvents="box-none"
    >
      <StyledView className="h-full w-full bg-gray-dark mx-auto px-3">
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={toFormikValidationSchema(
            createOrganizationFormSchema
          )}
          initialValues={{
            name: (organization?.name && organization?.name) || "",
          }}
          validate={(values) => {
            try {
              createOrganizationFormSchema.parse(values);
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
          onSubmit={async (values: { name: string }) => {
            if (organization?.name) {
              const response = await dispatch(
                updateOrganizationAsync({
                  data: { name: values?.name },
                  organizationId: organization.id,
                })
              );

              if (response.meta.requestStatus == "fulfilled") {
                Toast.show(
                  "Organizacao atualizada com sucesso." as string,
                  3000,
                  {
                    backgroundColor: "rgb(75,181,67)",
                    textColor: "white",
                  }
                );
                setMenuModalIsOpen(false);
              }

              if (response.meta.requestStatus == "rejected") {
                Toast.show(response.payload as string, 3000, {
                  backgroundColor: "#FF9494",
                  textColor: "white",
                });
              }

              return;
            }

            const response = await dispatch(
              createOrganizationAsync({ userId: user.id, name: values?.name })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Organizacao criada com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setMenuModalIsOpen(false);
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show(response.payload as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
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
            <StyledView className=" w-full mx-auto my-5 flex flex-col gap-y-4 mt-10">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Name
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={String(values?.name)}
                  placeholder={
                    errors.name ? String(errors.name) : "Digite o nome"
                  }
                  placeholderTextColor={
                    errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.name
                      ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <StyledText className="font-bold text-custom-white">
                    {organization ? "Atualizar" : "Cadastrar"}
                  </StyledText>
                )}
              </StyledPressable>
            </StyledView>
          )}
        </Formik>
      </StyledView>
    </StyledModal>
  );
}
