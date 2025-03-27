import { Formik } from "formik";
import { ClauseType } from "type";
import Toast from "react-native-simple-toast";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Organization } from "@store/organization/organizationSlice";
import {
  CreateClauseRequestParams,
  createClauseSchema,
} from "@schemas/clause/create-clause-params-schema";
import {
  createClauseAsync,
  updateClauseByIdAsync,
} from "@store/clause/clause-slice";
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

interface ClauseFormProps {
  clause?: ClauseType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ClauseFormComponent({
  clause,
  setIsModalOpen,
}: ClauseFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.clauseList.error
  );

  const [info, setInfo] = useState<
    "Locacao" | "Proposta" | "Cliente" | "Proprietario" | "Pagamento"
  >("Locacao");

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
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
      validationSchema={toFormikValidationSchema(createClauseSchema)}
      initialValues={{
        organizationId: organization.id,
        text: clause?.text && clause.text,
        title: clause?.title && clause.title,
        position: clause?.position && String(clause.position),
      }}
      validate={(values) => {
        try {
          createClauseSchema.safeParse(values);
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
      onSubmit={async (values: CreateClauseRequestParams) => {
        if (!clause) {
          const response = await dispatch(createClauseAsync(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Clausula criada com sucesso." as string, 3000, {
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
            updateClauseByIdAsync({
              clauseId: clause.id,
              data: {
                text: values.text,
                title: values.title,
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Clausula atualizada com sucesso." as string, 3000, {
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
          <StyledView>
            <StyledView className="flex flex-row justify-between items-center mt-5">
              <StyledPressable onPress={() => setInfo("Locacao")}>
                <StyledText
                  className={` ${
                    info === "Locacao" ? "opacity-100" : "opacity-40"
                  } text-white text-[14px] font-semibold pt-3"`}
                >
                  Locacao
                </StyledText>
              </StyledPressable>
              <StyledPressable onPress={() => setInfo("Proprietario")}>
                <StyledText
                  className={` ${
                    info === "Proprietario" ? "opacity-100" : "opacity-40"
                  } text-white text-[14px] font-semibold pt-3"`}
                >
                  Proprietario
                </StyledText>
              </StyledPressable>
              <StyledPressable onPress={() => setInfo("Cliente")}>
                <StyledText
                  className={` ${
                    info === "Cliente" ? "opacity-100" : "opacity-40"
                  } text-white text-[14px] font-semibold pt-3"`}
                >
                  Cliente
                </StyledText>
              </StyledPressable>
              <StyledPressable onPress={() => setInfo("Proposta")}>
                <StyledText
                  className={` ${
                    info === "Proposta" ? "opacity-100" : "opacity-40"
                  } text-white text-[14px] font-semibold pt-3"`}
                >
                  Proposta
                </StyledText>
              </StyledPressable>
              <StyledPressable onPress={() => setInfo("Pagamento")}>
                <StyledText
                  className={` ${
                    info === "Pagamento" ? "opacity-100" : "opacity-40"
                  } text-white text-[14px] font-semibold pt-3"`}
                >
                  Pagamento
                </StyledText>
              </StyledPressable>
            </StyledView>
            {info === "Locacao" && (
              <StyledView className="flex flex-wrap flex-row gap-2 mt-3">
                {venueVariables.map(({ key, label }) => (
                  <StyledPressable
                    key={key}
                    onPress={() => {
                      const { start } = selection;
                      const newText =
                        values?.text?.slice(0, start) + `{{${key}}}` + values?.text?.slice(start); 
                      setFieldValue("text", newText);
                      setSelection({ start: start + `{{${key}}}`.length, end: start + `{{${key}}}`.length }); 
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                  >
                    <StyledText className="text-black">{label}</StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
            {info === "Proprietario" && (
              <StyledView className="flex flex-wrap flex-row gap-2 mt-3">
                {ownerVariables.map(({ key, label }) => (
                  <StyledPressable
                    key={key}
                    onPress={() => {
                      const { start } = selection;
                      const newText =
                      values?.text?.slice(0, start) + `{{${key}}}` + values?.text?.slice(start); 
                      setFieldValue("text", newText);
                      setSelection({ start: start + `{{${key}}}`.length, end: start + `{{${key}}}`.length }); 
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                  >
                    <StyledText className="text-black">{label}</StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
            {info === "Cliente" && (
              <StyledView className="flex flex-wrap flex-row gap-2 mt-3">
                {clientVariables.map(({ key, label }) => (
                  <StyledPressable
                    key={key}
                    onPress={() => {
                      const { start } = selection;
                      const newText =
                      values?.text?.slice(0, start) + `{{${key}}}` + values?.text?.slice(start); 
                      setFieldValue("text", newText);
                      setSelection({ start: start + `{{${key}}}`.length, end: start + `{{${key}}}`.length }); 
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                  >
                    <StyledText className="text-black">{label}</StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
            {info === "Proposta" && (
              <StyledView className="flex flex-wrap flex-row gap-2 mt-3">
                {proposalVariables.map(({ key, label }) => (
                  <StyledPressable
                    key={key}
                    onPress={() => {
                      const { start } = selection;
                      const newText =
                      values?.text?.slice(0, start) + `{{${key}}}` + values?.text?.slice(start); 
                      setFieldValue("text", newText);
                      setSelection({ start: start + `{{${key}}}`.length, end: start + `{{${key}}}`.length }); 
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                  >
                    <StyledText className="text-black">{label}</StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
            {info === "Pagamento" && (
              <StyledView className="flex flex-wrap flex-row gap-2 mt-3">
                {paymentInfoVariables.map(({ key, label }) => (
                  <StyledPressable
                    key={key}
                    onPress={() => {
                      const { start } = selection;
                      const newText =
                      values?.text?.slice(0, start) + `{{${key}}}` + values?.text?.slice(start); 
                      setFieldValue("text", newText);
                      setSelection({ start: start + `{{${key}}}`.length, end: start + `{{${key}}}`.length }); 
                    }}
                    className="bg-gray-300 px-3 py-1 rounded-md"
                  >
                    <StyledText className="text-black">{label}</StyledText>
                  </StyledPressable>
                ))}
              </StyledView>
            )}
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {clause ? "Atualizar" : "Cadastrar"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
