import { Formik } from "formik";
import { AttachmentType } from "type";
import Toast from "react-native-simple-toast";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Organization } from "@store/organization/organizationSlice";

import {
  createAttachmentAsync,
  updateAttachmentByIdAsync,
} from "@store/attachment/attachment-slice";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { Venue } from "@store/venue/venueSlice";
import { useRef, useState } from "react";
import {
  clientVariables,
  ownerVariables,
  paymentInfoVariables,
  proposalVariables,
  venueVariables,
} from "const/contract-variables";
import { ActivityIndicator } from "react-native";
import { Entypo } from "@expo/vector-icons";
import { CreateAttachmentFormData, createAttachmentFormData } from "@schemas/attachment/create-attachment-params-schema";

interface AttachmentFormProps {
  attachment?: AttachmentType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AttachmentFormComponent({
  attachment,
  setIsModalOpen,
}: AttachmentFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [info, setInfo] = useState<
    "Locacao" | "Proposta" | "Cliente" | "Proprietario" | "Pagamento"
  >("Locacao");

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const loading: boolean = useSelector(
    (state: RootState) => state.attachmentState.loading
  );

  const [selection, setSelection] = useState({ start: 0, end: 0 });

  const variableGroups = {
    Locacao: venueVariables,
    Proprietario: ownerVariables,
    Cliente: clientVariables,
    Proposta: proposalVariables,
  };

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createAttachmentFormData)}
      initialValues={{
        organizationId: organization.id,
        text: attachment?.text && attachment.text,
        title: attachment?.title && attachment.title,
        venueId: attachment?.venueId && attachment.venueId,
      }}
      validate={(values) => {
        try {
          createAttachmentFormData.safeParse(values);
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
      onSubmit={async (values: CreateAttachmentFormData) => {
        if (!attachment) {
          const response = await dispatch(createAttachmentAsync(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Anexo criada com sucesso." as string, 3000, {
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
            updateAttachmentByIdAsync({
              attachmentId: attachment.id,
              data: {
                text: values.text,
                title: values.title,
                venueId: values.venueId
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Anexo atualizada com sucesso." as string, 3000, {
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
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        getFieldMeta,
        values,
        errors,
      }) => (
        <StyledView className="w-[90%] max-h-[90vh] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Titulo
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                placeholder={errors.title ? errors.title : "Digite pergunta"}
                placeholderTextColor={
                  errors.title ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.title
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
                onChangeText={handleChange("text")}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Enter") {
                    setFieldValue("text", values.text + "[PULA LINHA]");
                    return false; // Evita o comportamento padrão de pular linha
                  }
                }}
                onBlur={handleBlur("text")}
                value={values.text}
                multiline={true}
                numberOfLines={10} // Define a altura inicial
                textAlignVertical="top" // Alinha o texto no topo
                placeholder={errors.text ? errors.text : "Digite a resposta"}
                placeholderTextColor={
                  errors.text ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white h-[300px] ${
                  errors.text
                    ? "bg-red-50 border-[2px] border-red-900 "
                    : "bg-gray-ligth"
                }`}
                onSelectionChange={(e) => {
                  setSelection(e.nativeEvent.selection);
                }}
              />
            </StyledView>
          </StyledView>
          <StyledView className="flex flex-col gap-y-2 mt-3">
            <StyledText className="text-custom-gray text-[14px] font-semibold">
              Selecione as Locacoes:
            </StyledText>
            <StyledView className="flex flex-row">
              {organization.venues.map((item: Venue) => {
                return (
                  <StyledView className="flex flex-row gap-x-1" key={item.id}>
                    <StyledView
                      className="
                  flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  
                  text-[12px] md:text-[15px]"
                    >
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                        onPress={() => {
                         setFieldValue("venueId", item.id)
                        }}
                      >
                        <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                          {getFieldMeta("venueId").value === item.id && (
                            <Entypo name="check" size={12} color="white" />
                          )}
                        </StyledView>
                        <StyledText className="text-custom-gray text-[14px] font-semibold">
                          {item.name}
                        </StyledText>
                      </StyledPressable>
                    </StyledView>
                  </StyledView>
                );
              })}
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#faebd7" />
            ) : (
              <StyledText className="font-bold text-custom-white">
                {attachment ? "Atualizar" : "Cadastrar"}
              </StyledText>
            )}
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
