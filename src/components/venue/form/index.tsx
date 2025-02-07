import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import Toast from "react-native-simple-toast";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  Organization,
  createOrganizationVenueAsync,
} from "@store/organization/organizationSlice";
import { createVenueFormSchema } from "@schemas/venue/create-venue-params-schema";
import { OwnerType } from "type";
import React, { useRef } from "react";
import { Entypo } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { updateVenueAsync, Venue } from "@store/venue/venueSlice";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { transformMoneyToNumber } from "function/transform-money-to-number";

interface VenueFormModalComponentProps {
  venue?: Venue;
  isModalOpen: boolean;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface CreateVenueDataResponse {
  success: boolean;
  message: string;
  data: {
    venue: Venue;
  };
  count: number;
  type: string;
}

export function VenueFormModalComponent({
  venue,
  isModalOpen,
  setMenuModalIsOpen,
}: VenueFormModalComponentProps) {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(
    (state: RootState) => state.organizationList.loading
  );

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const ownersByVenueList: OwnerType[] = useSelector(
    (state: RootState) => state.ownerList.ownersByVenue
  );

  const ownersByOrganizationList: OwnerType[] = useSelector(
    (state: RootState) => state.ownerList.ownersByOrganization
  );

  const navigation = useNavigation();

  const flashMessageRef = useRef(null);

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
      <StyledScrollView className="h-full w-full bg-gray-dark  px-3">
        <Formik
          validateOnBlur={false}
          validationSchema={toFormikValidationSchema(createVenueFormSchema)}
          initialValues={{
            cep: (venue?.cep && venue?.cep) || "",
            city: (venue?.city && venue?.city) || "",
            name: (venue?.name && venue?.name) || "",
            state: (venue?.state && venue?.state) || "",
            street: (venue?.street && venue?.street) || "",
            maxGuest: (venue?.maxGuest && String(venue?.maxGuest)) || "",
            complement: (venue?.complement && venue?.complement) || "",
            streetNumber: (venue?.streetNumber && venue?.streetNumber) || "",
            checkOut: venue?.checkOut && venue?.checkOut,
            checkIn: venue?.checkIn && venue?.checkIn,
            neighborhood: (venue?.neighborhood && venue?.neighborhood) || "",
            pricingModel:
              venue?.pricingModel || venue?.pricingModel || "PER_PERSON",
            hasOvernightStay:
              (venue?.hasOvernightStay && venue?.hasOvernightStay) || false,
            pricePerPerson:
              (venue?.pricePerPerson && venue?.pricePerPerson.toString()) ||
              "0",
            pricePerDay:
              (venue?.pricePerDay && venue?.pricePerDay.toString()) || "0",
            owners:
              ownersByVenueList?.length > 0
                ? ownersByVenueList?.map((item) => item.id)
                : [],
          }}
          validate={(values) => {
            try {
              createVenueFormSchema.parse(values);
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
          onSubmit={async (values) => {
            if (venue?.id) {
              const response = await dispatch(
                updateVenueAsync({
                  data: {
                    ...values,
                    maxGuest: String(values.maxGuest),
                    pricePerDay: transformMoneyToNumber(values.pricePerDay),
                    pricePerPerson: transformMoneyToNumber(
                      values.pricePerPerson
                    ),
                  },
                  venueId: venue.id,
                })
              );

              if (response.meta.requestStatus == "fulfilled") {
                Toast.show("Locacao atualizada com sucesso." as string, 3000, {
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

              return;
            }

            const response = await dispatch(
              createOrganizationVenueAsync({
                organizationId: organization.id,
                data: {
                  ...values,
                  maxGuest: String(values.maxGuest),
                  pricePerDay: transformMoneyToNumber(values.pricePerDay),
                  pricePerPerson: transformMoneyToNumber(values.pricePerPerson),
                },
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Locacao criada com sucesso." as string, 3000, {
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
            <StyledView className=" w-full mx-auto my-5 flex flex-col gap-4 mt-10">
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
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Lotacao maxima
                </StyledText>
                <StyledTextInput
                  onFocus={(e) => e.stopPropagation()}
                  onChangeText={(value) =>
                    handleChange("maxGuest")(value.replace(/[^0-9]/g, ""))
                  }
                  onBlur={handleBlur("maxGuest")}
                  value={values?.maxGuest.toString()}
                  keyboardType="numeric"
                  placeholder={
                    errors?.maxGuest
                      ? errors.maxGuest?.toString()
                      : "Digite quantidade de convidados"
                  }
                  placeholderTextColor={
                    errors.maxGuest ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.maxGuest
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Rua
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("street")}
                  onBlur={handleBlur("street")}
                  value={String(values?.street)}
                  placeholder={
                    errors.street ? String(errors.street) : "Digite a rua"
                  }
                  placeholderTextColor={
                    errors.street ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.street
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Numero
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("streetNumber")}
                  onBlur={handleBlur("streetNumber")}
                  value={String(values?.streetNumber)}
                  placeholder={
                    errors.streetNumber
                      ? String(errors.streetNumber)
                      : "Digite o numero"
                  }
                  placeholderTextColor={
                    errors.streetNumber ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric"
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.streetNumber
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Complemento
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("complement")}
                  onBlur={handleBlur("complement")}
                  value={String(values?.complement)}
                  placeholder={
                    errors.complement
                      ? String(errors.complement)
                      : "Digite o nome"
                  }
                  placeholderTextColor={
                    errors.complement ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.complement
                      ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Bairro
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("neighborhood")}
                  onBlur={handleBlur("neighborhood")}
                  value={String(values?.neighborhood)}
                  placeholder={
                    errors.neighborhood
                      ? String(errors.neighborhood)
                      : "Digite o nome"
                  }
                  placeholderTextColor={
                    errors.neighborhood ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.neighborhood
                      ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  CEP
                </StyledText>
                <StyledTextInputMask
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.cep
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
                    errors.cep
                      ? String(errors.cep)
                      : "Digite o cep do locatario"
                  }
                  placeholderTextColor={
                    errors.cep ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric" // Define o teclado numéri
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Cidade
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  value={String(values?.city)}
                  placeholder={
                    errors.city ? String(errors.city) : "Digite o nome"
                  }
                  placeholderTextColor={
                    errors.city ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.city
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Estado
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("state")}
                  onBlur={handleBlur("state")}
                  value={String(values?.state)}
                  placeholder={
                    errors.state ? String(errors.state) : "Digite o nome"
                  }
                  placeholderTextColor={
                    errors.state ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                    errors.state
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Locacao permite pernoite?
              </StyledText>
              <StyledView className="flex flex-row gap-x-1">
                <StyledView
                  className="
                  flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  
                  text-[12px] md:text-[15px]"
                >
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("hasOvernightStay", true);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("hasOvernightStay").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Sim
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("hasOvernightStay", false);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("hasOvernightStay").value === false && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Nao
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
              {getFieldMeta("hasOvernightStay").value === true && (
                <StyledView className="flex flex-col gap-y-3">
                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Check In
                    </StyledText>
                    <StyledTextInputMask
                      className={`rounded-md px-3 py-1 text-white ${
                        errors.checkIn
                          ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                          : "bg-gray-ligth"
                      }`}
                      type={"custom"}
                      options={{
                        mask: "99:99", // Máscara para HH:MM
                      }}
                      onChangeText={(formatted, extracted) => {
                        handleChange("checkIn")(formatted); // Usa o texto formatado no formato HH:MM
                      }}
                      onBlur={handleBlur("checkIn")}
                      value={String(values?.checkIn)}
                      placeholder={
                        errors.checkIn
                          ? String(errors.checkIn)
                          : "Digite o horário do checkin"
                      }
                      placeholderTextColor={
                        errors.checkIn ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      keyboardType="numeric" // Define o teclado numéri
                    />
                  </StyledView>
                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Check Out
                    </StyledText>
                    <StyledTextInputMask
                      className={`rounded-md px-3 py-1 text-white ${
                        errors.checkOut
                          ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                          : "bg-gray-ligth"
                      }`}
                      type={"custom"}
                      options={{
                        mask: "99:99", // Máscara para HH:MM
                      }}
                      onChangeText={(formatted, extracted) => {
                        handleChange("checkOut")(formatted); // Usa o texto formatado no formato HH:MM
                      }}
                      onBlur={handleBlur("checkOut")}
                      value={String(values?.checkOut)}
                      placeholder={
                        errors.checkOut
                          ? String(errors.checkOut)
                          : "Digite o horário do checkout"
                      }
                      placeholderTextColor={
                        errors.checkOut ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      keyboardType="numeric" // Define o teclado numéri
                    />
                    {errors?.checkOut &&
                      errors?.checkOut.toString() != "Required" && (
                        <StyledText className="text-red-700 font-semibold">
                          {errors.checkOut?.toString()}
                        </StyledText>
                      )}
                  </StyledView>
                  {errors?.checkIn &&
                    errors?.checkIn.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.checkIn?.toString()}
                      </StyledText>
                    )}
                </StyledView>
              )}
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Metodo de cobranca
              </StyledText>
              <StyledView className="flex flex-row gap-x-1">
                <StyledView
                  className="
                  flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  
                  text-[12px] md:text-[15px]"
                >
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("pricingModel", "PER_PERSON");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("pricingModel").value === "PER_PERSON" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Por Pessoa
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("pricingModel", "PER_DAY");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("pricingModel").value === "PER_DAY" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Por Dia
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
              {getFieldMeta("pricingModel").value === "PER_DAY" ? (
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Valor por Dia
                  </StyledText>
                  <StyledTextInputMask
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                      errors.pricePerDay
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    type="money"
                    options={{
                      maskType: "BRL",
                    }}
                    onChangeText={handleChange("pricePerDay")}
                    onBlur={handleBlur("pricePerDay")}
                    value={String(Number(values.pricePerDay) * 100)}
                  />
                  {errors?.pricePerDay &&
                    errors?.pricePerDay.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.pricePerDay?.toString()}
                      </StyledText>
                    )}
                </StyledView>
              ) : (
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Valor por Pessoa
                  </StyledText>
                  <StyledTextInputMask
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                      errors.pricePerPerson
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    type="money"
                    options={{
                      maskType: "BRL",
                    }}
                    onChangeText={handleChange("pricePerPerson")}
                    onBlur={handleBlur("pricePerPerson")}
                    value={String(Number(values.pricePerPerson) * 100)}
                  />
                  {errors?.pricePerPerson &&
                    errors?.pricePerPerson.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.pricePerPerson?.toString()}
                      </StyledText>
                    )}
                </StyledView>
              )}
              <StyledView className="font-semibold text-custom-gray text-[14px] gap-y-3">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Proprietário
                </StyledText>
                <StyledView className="flex flex-col justify-start items-start  flex-wrap">
                  {ownersByOrganizationList?.length === 0 ? (
                    <>
                      <StyledText className="text-sm text-center font-light text-gray-400">
                        Nao ha proprietarios cadastrados nessa organizacao
                      </StyledText>
                      {errors?.owners &&
                        errors?.owners.toString() !=
                          "Obrigatorio ter um proprietairo cadastrado" && (
                          <StyledText className="text-red-700 font-semibold">
                            Obrigatorio ter um proprietairo cadastrado
                          </StyledText>
                        )}
                    </>
                  ) : (
                    ownersByOrganizationList?.map((item: OwnerType) => {
                      const isSelected = getFieldMeta("owners").value.includes(
                        item.id
                      ); // Verifica se o proprietário já foi selecionado

                      return (
                        <StyledView
                          key={item.id}
                          className="
            flex flex-wrap flex-col gap-1 text-sm font-light text-veryDarkGraishCyan  
            text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className={`flex flex-row items-center justify-center gap-x-1 cursor-pointer rounded-sm  py-1 $`}
                            onPress={() => {
                              const currentOwners =
                                getFieldMeta("owners").value;
                              if (isSelected) {
                                // Remove o proprietário se ele já estiver na lista
                                setFieldValue(
                                  "owners",
                                  currentOwners.filter(
                                    (id: string) => id !== item.id
                                  )
                                );
                              } else {
                                // Adiciona o proprietário
                                setFieldValue("owners", [
                                  ...currentOwners,
                                  item.id,
                                ]);
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
                            <StyledText className="text-custom-gray text-[14px] font-semibold">
                              {item.completeName}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })
                  )}
                </StyledView>
              </StyledView>
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <StyledText className="font-bold text-custom-white">
                    {venue ? "Atualizar" : "Salvar"}
                  </StyledText>
                )}
              </StyledPressable>
            </StyledView>
          )}
        </Formik>
      </StyledScrollView>

      <FlashMessage ref={flashMessageRef} />
    </StyledModal>
  );
}
