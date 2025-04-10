import moment from "moment";
import { Formik } from "formik";
import { useRef, useState } from "react";
import Toast from "react-native-simple-toast";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { DocumentType } from "type";
import { Image, Linking } from "react-native";
import { CreateDocumentRequestParams, createDocumentSchema } from "@schemas/document/create-document-params-schema";
import { CreatePdfDocumentSchema } from "@schemas/document/create-pdf-document-params-schema";
import { createDocumentAsync } from "@store/document/document-slice";

interface DocumentFormProps {
  document?: DocumentType;
  setIsModalOpen: (value: React.SetStateAction<boolean>) => void;
}

export function DocumentForm({ document, setIsModalOpen }: DocumentFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const formikRef = useRef(null);

  const proposal = useSelector(
    (state: RootState) => state?.proposalList.proposal
  );
  const loading = useSelector(
    (state: RootState) => state?.proposalList.loading
  );

  const pickPdf = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Permitir apenas arquivos PDF
    });

    if (result.assets && result.assets.length > 0) {
      const { uri, name } = result.assets[0];
      return uri;
    } else {
      console.log("Nenhum arquivo selecionado.");
      return null;
    }
  };

  const downloadPdf = (url: string) => {
    // Abre o PDF na URL fornecida (na AWS)
    Linking.openURL(url);
  };

  return (
    <Formik
      innerRef={formikRef}
      validationSchema={toFormikValidationSchema(createDocumentSchema)}
      initialValues={{
        proposalId: proposal?.id || "",
        title: document?.title || "",
        imageUrl: document?.imageUrl || "",
      }}
      validate={(values) => {
        try {
          createDocumentSchema.parse(values);
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
      onSubmit={async (values: CreateDocumentRequestParams) => {
        const uriParts = values.imageUrl.split(".");
        const fileType = uriParts[uriParts.length - 1];

        const formData = new FormData();

        formData.append("file", {
          uri: values.imageUrl,
          name: `document.${fileType}`,
          type: `application/pdf`, // Mudando o tipo para PDF
        } as any);

        formData.append("title", values.title);
        formData.append("proposalId", proposal.id);

        const response = await dispatch(createDocumentAsync(formData));

        if (response.meta.requestStatus === "fulfilled") {
          Toast.show("Documento cadastrado com sucesso.", 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
          setIsModalOpen(false);
        }

        if (response.meta.requestStatus === "rejected") {
          Toast.show(response.payload.data, 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
        }
      }}
    >
      {({
        values,
        errors,
        handleBlur,
        handleSubmit,
        getFieldMeta,
        handleChange,
        setFieldValue,
      }) => {
        return (
          <StyledView className="w-full my-5 flex flex-col px-3">
            <StyledView className="w-full">
              {/* Exibindo a capa do PDF ou mostrando o botão */}
              {document?.imageUrl && document.fileType === "IMAGE" ? (
                <Image
                  source={{
                    uri: document.imageUrl,
                  }}
                  style={{ width: 270, height: 500 }}
                />
              ) : (
                <StyledPressable className="flex flex-col gap-y-2 justify-center items-center border-[1px] border-dotted border-custom-white p-2" onPress={async () => {
                  const url = await pickPdf();
                  setFieldValue("imageUrl", url);
                }}>
                  {
                    getFieldMeta("imageUrl").value ?
                    <StyledText className="text-custom-white font-light">{document?.title}</StyledText>
                    :
                    <StyledText className="text-custom-white font-light">Selecione um documento</StyledText>
                  }
                </StyledPressable>
              )}
            </StyledView>

            {document?.fileType === "PDF" ||
              (!document && (
                <StyledView className="flex flex-col justify-center items-center gap-y-3 w-full mt-5">
                  <StyledView className="flex flex-col gap-y-1 w-full">
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Titulo
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("title")}
                      onBlur={handleBlur("title")}
                      value={values.title}
                      placeholder={
                        errors.title
                          ? errors.title
                          : "Digite o título do documento"
                      }
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
                  <StyledPressable
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="bg-green-800 flex justify-center items-center py-3 rounded-md w-full"
                  >
                    <StyledText className="font-bold text-custom-white">
                      {loading
                        ? "Enviando"
                        : document
                        ? "Atualizar"
                        : "Cadastrar"}
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              ))}

            {/* Botão para download do PDF */}
            {document?.imageUrl && (
              <StyledView className="mt-3">
                <StyledPressable
                  onPress={() => downloadPdf(document.imageUrl)}
                  className="bg-blue-800 flex justify-center items-center py-3 rounded-md w-full"
                >
                  <StyledText className="font-bold text-custom-white">
                    Visualizar Arquivo
                  </StyledText>
                </StyledPressable>
              </StyledView>
            )}
          </StyledView>
        );
      }}
    </Formik>
  );
}
