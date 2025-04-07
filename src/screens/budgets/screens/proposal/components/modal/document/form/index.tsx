import moment from "moment";
import { Formik } from "formik";
import { ActivityIndicator, Image } from "react-native";
import { useRef, useState } from "react";
import Toast from "react-native-simple-toast";
import * as DocumentPicker from 'expo-document-picker'; // Mudar de ImagePicker para DocumentPicker
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { transformMoneyToNumber } from "function/transform-money-to-number";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createDocumentAsync } from "@store/document/document-slice";
import {
  CreateDocumentRequestParams,
  createDocumentSchema,
} from "@schemas/document/create-document-params-schema";
import { DocumentType } from "type";

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

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'], // Aceita tanto imagens quanto PDFs
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const fileInfo = await FileSystem.getInfoAsync(result.uri);

        if (!fileInfo.exists) {
          console.error("Não foi possível obter informações do arquivo.");
          return;
        }

        const fileSizeInMB = fileInfo.size / (1024 * 1024); // Converte para MB

        if (fileSizeInMB > 2.5) {
          Toast.show("Arquivo maior que 2.5 MB.", 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
          return;
        }

        return result.uri;
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      Toast.show("Erro ao selecionar o arquivo", 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }
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
      onSubmit={async (values: CreateDocumentRequestParams) => {
        const uriParts = values.imageUrl.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        // Determina o tipo MIME correto
        let mimeType = `image/${fileType}`;
        if (fileType === 'pdf') {
          mimeType = 'application/pdf';
        }

        const formData = new FormData();
        formData.append("file", {
          uri: values.imageUrl,
          name: `document.${fileType}`,
          type: mimeType,
        } as any);

        formData.append("title", values.title);
        formData.append("proposalId", proposal.id);

        const response = await dispatch(createDocumentAsync(formData));

        if (response.meta.requestStatus == "fulfilled") {
          Toast.show("Documento cadastrado com sucesso.", 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
          setIsModalOpen(false);
        }

        if (response.meta.requestStatus == "rejected") {
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
        const fileUri = getFieldMeta("imageUrl").value as string;
        const isPdf = fileUri?.endsWith('.pdf');
        
        return (
          <StyledView className=" w-full mx-auto my-5 flex flex-col px-3">
            <StyledView className="flex flex-col gap-2 ">
              <StyledView className="relative flex-col gap-y-2 flex justify-center items-center w-full ">
                <StyledView className="h-[300px] flex justify-center items-center w-[100%] border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] cursor-pointer hover:bg-gray-100 transition duration-300">
                  {fileUri ? (
                    isPdf ? (
                      <StyledView className="flex items-center justify-center h-full">
                        <MaterialIcons name="picture-as-pdf" size={80} color="red" />
                        <StyledText className="text-white mt-2">PDF selecionado</StyledText>
                      </StyledView>
                    ) : (
                      <Image
                        source={{ uri: fileUri }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                    )
                  ) : (
                    <StyledText className="text-md text-white font-bold">
                      Selecione o Arquivo (PDF ou Imagem)
                    </StyledText>
                  )}
                </StyledView>
                <StyledView className=" flex justify-center flex-row items-center gap-x-10 py-3 w-full">
                  <StyledPressable
                    onPress={async () => {
                      const url = await pickDocument();
                      if (url) setFieldValue("imageUrl", url);
                    }}
                  >
                    <MaterialIcons
                      name="attach-file"
                      size={24}
                      color="white"
                    />
                  </StyledPressable>
                </StyledView>
                <StyledText className="text-red-700 text-[15px] w-full">
                  {errors.imageUrl && errors.imageUrl}
                </StyledText>
              </StyledView>
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Título
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                placeholder={
                  errors.title ? errors.title : "Digite o título do documento"
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
            <StyledView className="flex flex-col justify-center items-center gap-y-2 w-full mt-5">
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-green-800 flex justify-center items-center py-3  rounded-md w-full"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#faebd7" />
                ) : (
                  <StyledText className="font-bold text-custom-white">
                    {document ? "Atualizar" : "Cadastrar"}
                  </StyledText>
                )}
              </StyledPressable>
            </StyledView>
          </StyledView>
        );
      }}
    </Formik>
  );
}