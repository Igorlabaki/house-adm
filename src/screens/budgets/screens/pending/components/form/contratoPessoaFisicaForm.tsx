import { SendModal } from "@components/list/sendModal";
import { generateContractFormSchema } from "@schemas/generateContractFormZodSchema";
import { RootState } from "@store/index";
import { Formik } from "formik";
import { sendContractPessoFisicaEmail } from "function/sendContractPessoFisicaEmail";
import { sendContractPessoFisicaWhatsapp } from "function/sendContractPessoFisicaWhatsapp";
import {
  gerarContratoPessoaFisicaHTML,
  InfoPessoaisFisicaFormParams,
} from "html/contrato-pessoa-fisica";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import { BugdetType } from "type";
import { toFormikValidationSchema } from "zod-formik-adapter";


export default function ContratoPessoaFisicaForm() {
  const [isLoading, setIsLoding] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const {orcamento} = useSelector((state: RootState) => state.orcamentosById);
  return (
    <>
      <Formik
        validationSchema={toFormikValidationSchema<any>(
          generateContractFormSchema
        )}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          cidade: "São Paulo",
          estado: "SP",
          nomeCompleto: orcamento?.nome,
          bairro: "",
          cep: "",
          cpf: "",
          numero: "",
          rua: "",
          rg: "",
        }}
        validate={(values) => {
          try {
            generateContractFormSchema.parse(values);
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
        onSubmit={async (values: InfoPessoaisFisicaFormParams) => {
          setSendModal(true)
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          getFieldMeta,
        }) => (
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col gap-y-2">
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Nome Completo
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.nomeCompleto
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("nomeCompleto")}
                onBlur={handleBlur("nomeCompleto")}
                value={values.nomeCompleto}
              />
              {errors?.nomeCompleto &&
                errors?.nomeCompleto.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.nomeCompleto?.toString()}
                  </StyledText>
                )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                CPF
              </StyledText>
              <StyledTextInputMask
                className={`rounded-md px-3 py-1 text-white ${
                  errors.cpf
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
                type={"custom"}
                options={{
                  mask: "999.999.999-99", // Máscara para HH:MM
                }}
                onChangeText={handleChange("cpf")}
                onBlur={handleBlur("cpf")}
                value={String(values?.cpf)}
                placeholder={
                  errors.cpf ? String(errors.cpf) : "Digite o cpf do locatario"
                }
                placeholderTextColor={
                  errors.cpf ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                keyboardType="numeric" // Define o teclado numéri
              />
              {errors?.cpf && errors?.cpf.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.cpf?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                RG
              </StyledText>
              <StyledTextInputMask
                className={`rounded-md px-3 py-1 text-white ${
                  errors.rg
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
                type={"custom"}
                options={{
                  mask: "99.999.999-9", // Máscara para HH:MM
                }}
                onChangeText={handleChange("rg")}
                onBlur={handleBlur("rg")}
                value={String(values?.rg)}
                placeholder={
                  errors.rg ? String(errors.rg) : "Digite o rg do locatario"
                }
                placeholderTextColor={
                  errors.rg ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                keyboardType="numeric" // Define o teclado numéri
              />
              {errors?.rg && errors?.rg.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.rg?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Rua
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.rua
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("rua")}
                onBlur={handleBlur("rua")}
                value={values.rua}
              />
              {errors?.rua && errors?.rua.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.rua?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Numero
              </StyledText>
              <StyledTextInput
                keyboardType="numeric"
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.numero
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("numero")}
                onBlur={handleBlur("numero")}
                value={values.numero}
              />
              {errors?.numero && errors?.numero.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.numero?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Bairro
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.bairro
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("bairro")}
                onBlur={handleBlur("bairro")}
                value={values.bairro}
              />
              {errors?.bairro && errors?.bairro.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.bairro?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-1">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                CEP
              </StyledText>
              <StyledTextInputMask
                className={`rounded-md px-3 py-1 text-white ${
                  errors.cpf
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
                type={"custom"}
                options={{
                  mask: "99999-999", // Máscara para HH:MM
                }}
                onChangeText={handleChange("cep")}
                onBlur={handleBlur("cep")}
                value={String(values?.cep)}
                placeholder={
                  errors.cep ? String(errors.cep) : "Digite o cep do locatario"
                }
                placeholderTextColor={
                  errors.cep ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                keyboardType="numeric" // Define o teclado numéri
              />
              {errors?.cep && errors?.cep.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.cep?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Cidade
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.cidade
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("cidade")}
                onBlur={handleBlur("cidade")}
                value={values.cidade}
              />
              {errors?.cidade && errors?.cidade.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.cidade?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2 mb-5">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Estado
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.estado
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("estado")}
                onBlur={handleBlur("estado")}
                value={values.estado}
              />
              {errors?.estado && errors?.estado.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.estado?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledPressable
              onPress={() => {
                handleSubmit();
              }}
              className={`bg-gray-ligth flex justify-center items-center py-3  rounded-md`}
            >
              <StyledText className="font-bold text-custom-white">
                {isLoading ? "Carregando..." : "Enviar"}
              </StyledText>
            </StyledPressable>
            {sendModal && (
              <SendModal
                viaEmail={() => sendContractPessoFisicaEmail({
                  orcamento: orcamento,
                  infoPessoais: { ...values },
                })}
                viaWhatsapp={() => sendContractPessoFisicaWhatsapp({
                  orcamento: orcamento,
                  infoPessoais: { ...values },
                })}
                entity="contrato"
                visible={sendModal}
                onCancel={() => setSendModal(false)}
              />
            )}
          </StyledView>
        )}
      </Formik>
    </>
  );
}
