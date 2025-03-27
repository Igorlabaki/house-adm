import { SendModal } from "@components/list/sendModal";
import { AppDispatch, RootState } from "@store/index";
import { Formik } from "formik";

import { sendContractPessoFisicaWhatsapp } from "function/send-natural-person-contract-via-whatsapp";
import Toast from "react-native-simple-toast";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  updatePersonalInfoRequestParamSchema,
  UpdatePersonalInfoRequestParamSchema,
} from "@schemas/contract/natural-person-contract-form";
import { Entypo } from "@expo/vector-icons";
import { ContractType, OwnerType, OwnerVenueType } from "type";
import { updateProposalPersonalInfoAsync } from "@store/proposal/proposal-slice";
import { Venue } from "@store/venue/venueSlice";
import { sendContractPessoFisicaEmail } from "function/send-natural-person-contrat-email";
import { selectOwnerAsync } from "@store/owner/ownerSlice";
import { transformMoneyToNumber } from "function/transform-money-to-number";

export default function NaturalPersonContractForm() {
  const [isLoading, setIsLoding] = useState(false);
  const [sendModal, setSendModal] = useState(false);
  const proposal = useSelector(
    (state: RootState) => state.proposalList.proposal
  );
  const dispatch = useDispatch<AppDispatch>();
  const contracts = useSelector(
    (state: RootState) => state.contractList.contracts
  );
  const [paymentMethod, setPaymentMethod] = useState<"vista" | "parcelado">(
    "vista"
  );
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  return (
    <>
      <Formik
        validationSchema={toFormikValidationSchema<UpdatePersonalInfoRequestParamSchema>(
          updatePersonalInfoRequestParamSchema
        )}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          rg: proposal?.rg || "",
          cep: proposal?.cep || "",
          cpf: proposal?.cpf || "",
          paymentInfo: {
            dueDate: "5",
            numberPayments: "1",
            signalAmount: String(proposal.totalAmount / 2),
          },
          proposalId: proposal?.id,
          state: proposal?.state || "SP",
          street: proposal?.street || "",
          city: proposal?.city || "São Paulo",
          streetNumber: proposal?.streetNumber || "",
          neighborhood: proposal?.neighborhood || "",
          completeName: proposal?.completeName || proposal?.name || "",
        }}
        validate={(values) => {
          try {
            const teste =
              updatePersonalInfoRequestParamSchema.safeParse(values);

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
        onSubmit={async (values: UpdatePersonalInfoRequestParamSchema) => {
          const { contract, ...rest } = values;
          const response = await dispatch(
            updateProposalPersonalInfoAsync({
              proposalId: proposal?.id,
              data: {
                ...rest,
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Dados atualizados com sucesso." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
          setSendModal(true);
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
                  errors.name
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {errors?.name &&
                errors?.name.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.name?.toString()}
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
                Logradouro
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                  errors.street
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("street")}
                onBlur={handleBlur("street")}
                value={values.street}
              />
              {errors?.street && errors?.street.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.street?.toString()}
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
                  errors.streetNumber
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("streetNumber")}
                onBlur={handleBlur("streetNumber")}
                value={values.streetNumber}
              />
              {errors?.streetNumber &&
                errors?.streetNumber.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.streetNumber?.toString()}
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
                  errors.neighborhood
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("neighborhood")}
                onBlur={handleBlur("neighborhood")}
                value={values.neighborhood}
              />
              {errors?.neighborhood &&
                errors?.neighborhood.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.neighborhood?.toString()}
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
                  errors.city
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                value={values.city}
              />
              {errors?.city && errors?.city.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.city?.toString()}
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
                  errors.state
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                onChangeText={handleChange("state")}
                onBlur={handleBlur("state")}
                value={values.state}
                maxLength={2}
              />
              {errors?.state && errors?.state.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.state?.toString()}
                </StyledText>
              )}
              <StyledView className="flex flex-col gap-y-2 mb-4">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Metodo de pagamento
                </StyledText>
                <StyledView className="flex flex-row gap-x-3">
                  <StyledView
                    className="
            flex flex-wrap flex-col justify-start items-center gap-1 text-sm font-light text-veryDarkGraishCyan  
            text-[12px] md:text-[15px]"
                  >
                    <StyledPressable
                      className={`flex flex-row items-start justify-center cursor-pointer rounded-sm `}
                      onPress={async () => {
                        if (paymentMethod === "parcelado") {
                          setPaymentMethod("vista");
                        }
                      }}
                    >
                      <StyledView
                        className={`
                              w-4 h-4 border-[1px] border-gray-500 cursor-pointer 
                              flex justify-center items-center rounded-sm overflow-hidden `}
                      >
                        {paymentMethod === "vista" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray text-[14px] font-semibold ml-2">
                        A vista
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                  <StyledView
                    className="
            flex flex-wrap flex-col justify-start items-center gap-1 text-sm font-light text-veryDarkGraishCyan  
            text-[12px] md:text-[15px]"
                  >
                    <StyledPressable
                      className={`flex flex-row items-start justify-center cursor-pointer rounded-sm `}
                      onPress={async () => {
                        if (paymentMethod === "vista") {
                          setPaymentMethod("parcelado");
                        }
                      }}
                    >
                      <StyledView
                        className={`
                              w-4 h-4 border-[1px] border-gray-500 cursor-pointer 
                              flex justify-center items-center rounded-sm overflow-hidden `}
                      >
                        {paymentMethod === "parcelado" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray text-[14px] font-semibold ml-2">
                        Parcelado
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                </StyledView>
              </StyledView>
              {paymentMethod === "parcelado" ? (
                <>
                  <StyledView className="flex flex-col gap-y-2">
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Valor do Sinal
                    </StyledText>
                    <StyledTextInputMask
                      onFocus={(e) => e.stopPropagation()}
                      className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                        errors.paymentInfo?.signalAmount
                          ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                          : "bg-gray-ligth"
                      }`}
                      type="money"
                      options={{
                        maskType: "BRL",
                      }}
                      onChangeText={handleChange("paymentInfo.signalAmount")}
                      onBlur={handleBlur("paymentInfo.signalAmount")}
                      value={String(
                        Number(values.paymentInfo?.signalAmount) * 100
                      )}
                    />
                    {errors?.paymentInfo?.signalAmount &&
                      errors?.paymentInfo?.signalAmount.toString() !=
                        "Required" && (
                        <StyledText className="text-red-700 font-semibold">
                          {errors.paymentInfo?.signalAmount?.toString()}
                        </StyledText>
                      )}
                  </StyledView>
                  <StyledView className="flex flex-col gap-y-2 mt-1">
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Numero de parcelas
                    </StyledText>
                    <StyledTextInput
                      onFocus={(e) => e.stopPropagation()}
                      keyboardType="numeric"
                      maxLength={2}
                      className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                        errors.city
                          ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                          : "bg-gray-ligth"
                      }`}
                      onChangeText={handleChange("paymentInfo.numberPayments")}
                      onBlur={handleBlur("paymentInfo.numberPayments")}
                      value={values.paymentInfo?.numberPayments}
                    />
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Dia do limite para pagamento
                    </StyledText>
                    <StyledTextInput
                      onFocus={(e) => e.stopPropagation()}
                      className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                        errors.paymentInfo?.dueDate
                          ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                          : "bg-gray-ligth"
                      }`}
                      onChangeText={handleChange("paymentInfo.dueDate")}
                      onBlur={handleBlur("paymentInfo.dueDate")}
                      value={values?.paymentInfo?.dueDate}
                      maxLength={2}
                    />
                  </StyledView>
                </>
              ) : null}
              <StyledView className="font-semibold text-custom-gray text-[14px] gap-y-3">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Proprietario:
                </StyledText>
                <StyledView className="flex flex-col justify-start items-start  flex-wrap">
                  {venue.ownerVenue?.length === 0 ? (
                    <>
                      <StyledText className="text-sm text-center font-light text-gray-400">
                        Nao ha proprietarios cadastrados nessa organizacao
                      </StyledText>
                      {errors?.contract &&
                        errors?.contract.toString() !=
                          "Obrigatorio ter um proprietairo cadastrado" && (
                          <StyledText className="text-red-700 font-semibold">
                            Obrigatorio ter um proprietario cadastrado
                          </StyledText>
                        )}
                    </>
                  ) : (
                    venue.ownerVenue?.map((item: OwnerVenueType) => {
                      const isSelected = String(
                        getFieldMeta("owner").value?.id
                      ).includes(item.owner.id); // Verifica se o proprietário já foi selecionado

                      return (
                        <StyledView
                          key={item.id}
                          className="
            flex flex-wrap flex-col justify-start items-center gap-1 text-sm font-light text-veryDarkGraishCyan  
            text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className={`flex flex-row items-start justify-center cursor-pointer rounded-sm `}
                            onPress={async () => {
                              if (isSelected) {
                                // Remove o proprietário se ele já estiver na lista
                                setFieldValue("owner", {});
                              } else {
                                // Adiciona o proprietário
                                setFieldValue("owner", item.owner);
                              }
                            }}
                          >
                            <StyledView
                              className={`
                              w-4 h-4 border-[1px] border-gray-500 cursor-pointer 
                              flex justify-center items-center rounded-sm overflow-hidden `}
                            >
                              {isSelected && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray text-[14px] font-semibold ml-2">
                              {item?.owner.completeName}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })
                  )}
                </StyledView>
              </StyledView>
              <StyledView className="font-semibold text-custom-gray text-[14px] gap-y-3">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Contrato:
                </StyledText>
                <StyledView className="flex flex-col justify-start items-start  flex-wrap">
                  {venue?.contracts?.length === 0 ? (
                    <>
                      <StyledText className="text-sm text-center font-light text-gray-400">
                        Nao ha contratos cadastrados nessa organizacao
                      </StyledText>
                      {errors?.contract &&
                        errors?.contract.toString() !=
                          "Obrigatorio ter um proprietairo cadastrado" && (
                          <StyledText className="text-red-700 font-semibold">
                            Obrigatorio ter um contrato cadastrado
                          </StyledText>
                        )}
                    </>
                  ) : (
                    venue?.contracts?.map((item: ContractType) => {
                      const isSelected = String(
                        getFieldMeta("contract").value?.id
                      ).includes(item.id); // Verifica se o proprietário já foi selecionado

                      return (
                        <StyledView
                          key={item.id}
                          className="
            flex flex-wrap flex-col justify-start items-center gap-1 text-sm font-light text-veryDarkGraishCyan  
            text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className={`flex flex-row items-start justify-center cursor-pointer rounded-sm `}
                            onPress={() => {
                              if (isSelected) {
                                // Remove o proprietário se ele já estiver na lista
                                setFieldValue("contract", {});
                              } else {
                                // Adiciona o proprietário
                                setFieldValue("contract", item);
                              }
                            }}
                          >
                            <StyledView
                              className={`
                              w-4 h-4 border-[1px] border-gray-500 cursor-pointer 
                              flex justify-center items-center rounded-sm overflow-hidden `}
                            >
                              {isSelected && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray text-[14px] font-semibold ml-2">
                              {item.name}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })
                  )}
                </StyledView>
              </StyledView>
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
                viaEmail={() => {
                  const { contract, owner, paymentInfo, ...rest } = values;
                  sendContractPessoFisicaEmail({
                    owner: owner,
                    venue: venue,
                    client: { ...rest },
                    proposal: proposal,
                    contractInformation: contract,
                    paymentInfo: {
                      dueDate: Number(paymentInfo.dueDate),
                      signalAmount: Number(
                        transformMoneyToNumber(paymentInfo.signalAmount)
                      ),
                      numberPayments: Number(paymentInfo.numberPayments),
                      paymentValue:
                        (proposal.totalAmount -
                          Number(
                            transformMoneyToNumber(paymentInfo.signalAmount)
                          )) /
                          Number(paymentInfo.numberPayments) || 1,
                    },
                  });
                }}
                viaWhatsapp={() => {
                  const { contract, owner, ...rest } = values;
                  sendContractPessoFisicaWhatsapp({
                    owner: owner,
                    venue: venue,
                    client: { ...rest },
                    proposal: proposal,
                    contractInformation: contract,
                  });
                }}
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
