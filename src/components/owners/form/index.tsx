import { useRef, useState } from "react";
import { Formik } from "formik";
import { OwnerType } from "type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import {
  createOrganizationOwnerAsync,
  createVenueOwnerAsync,
  deleteOwnerAsync,
  updateOwnerAsync,
} from "@store/owner/ownerSlice";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import {
  CreateOwnerFormSchema,
  createOwnerFormSchema,
} from "@schemas/owner/create-owner-params-schema";
import { Feather } from "@expo/vector-icons";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { Venue } from "@store/venue/venueSlice";
import Toast from "react-native-simple-toast";

interface OwnerFormProps {
  owner?: OwnerType;
  isModalOpen: boolean;
  organizationId: string;
  type?: "ORGANIZATION" | "VENUE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function OwnerFormComponent({
  type,
  owner,
  isModalOpen,
  setIsModalOpen,
  organizationId,
}: OwnerFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalDeleteVisible, setDeleteModalVisible] = useState(false);

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const confirmDelete = async () => {
    const response = await dispatch(deleteOwnerAsync(owner.id));

    if (response.meta.requestStatus === "fulfilled") {
      showMessage({
        duration: 3000,
        floating: true,
        type: "success",
        position: "bottom",
        message: "Sucesso",
        description: `Proprietario ${response.payload?.data?.completeName} foi deletado com sucesso!`,
      });
    }

    if (response.meta.requestStatus == "rejected") {
      showMessage({
        type: "danger",
        floating: true,
        duration: 3000,
        position: "bottom",
        message: "Erro ao deletar proprietario",
      });
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
  };

  const flashMessageRef = useRef(null);
  return (
    <StyledModal
      visible={isModalOpen}
      transparent={true}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
      animationType="slide"
      pointerEvents="box-none"
    >
      <StyledScrollView
        className="h-full w-full bg-gray-dark  px-3"
        ref={flashMessageRef}
      >
        {owner && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        <Formik
          validationSchema={toFormikValidationSchema(createOwnerFormSchema)}
          initialValues={{
            rg: owner?.rg && owner.rg,
            pix: owner?.pix && owner.pix,
            cep: owner?.cep && owner.cep,
            cpf: owner?.cpf && owner.cpf,
            organizationId: organizationId,
            city: owner?.city && owner.city,
            state: owner?.state && owner.state,
            street: owner?.street && owner.street,
            bankName: owner?.bankName && owner.bankName,
            bankAgency: owner?.bankAgency && owner?.bankAgency,
            complement: (owner?.complement && owner.complement) || "",
            streetNumber: owner?.streetNumber && owner.streetNumber,
            neighborhood: owner?.neighborhood && owner.neighborhood,
            completeName: owner?.completeName && owner.completeName,
            bankAccountNumber:
              owner?.bankAccountNumber && owner?.bankAccountNumber,
          }}
          validate={(values) => {
            try {
              createOwnerFormSchema.parse(values);
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
          onSubmit={async (values: CreateOwnerFormSchema) => {
            if (!owner) {
              if (type === "ORGANIZATION") {
                const response = await dispatch(
                  createOrganizationOwnerAsync(values)
                );

                if (response.meta.requestStatus == "fulfilled") {
                  Toast.show(response.payload.message, 3000, {
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

              if (type === "VENUE") {
                const response = await dispatch(
                  createVenueOwnerAsync({ venueId: venue.id, ...values })
                );

                if (response.meta.requestStatus == "fulfilled") {
                  Toast.show(response.payload.message, 3000, {
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
            } else {
              const response = await dispatch(
                updateOwnerAsync({
                  ownerId: owner.id,
                  data: values,
                })
              );

              if (response.meta.requestStatus == "fulfilled") {
                Toast.show(response.payload.message, 3000, {
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
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <StyledView className="w-[90%] mx-auto my-5 flex flex-col pt-10">
              <StyledView className="flex flex-col gap-y-3">
                <StyledView className="flex flex-col gap-y-1">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Nome Completo
                  </StyledText>
                  <StyledTextInput
                    onChangeText={handleChange("completeName")}
                    onBlur={handleBlur("completeName")}
                    value={
                      values?.completeName ? String(values?.completeName) : ""
                    }
                    placeholder={
                      errors.completeName
                        ? String(errors.completeName)
                        : "Digite o nome completo do proprietario"
                    }
                    placeholderTextColor={
                      errors.completeName
                        ? "rgb(127 29 29)"
                        : "rgb(156 163 175)"
                    }
                    className={`rounded-md px-3 py-1 text-white focus:border-[1.5px] focus:border-blue-400  ${
                      errors.completeName
                        ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                        : "bg-gray-ligth"
                    }`}
                  />
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
                        errors.cpf
                          ? String(errors.cpf)
                          : "Digite o cpf do locatario"
                      }
                      placeholderTextColor={
                        errors.cpf ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      keyboardType="numeric" // Define o teclado numéri
                    />
                  </StyledView>
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
                    Pix
                  </StyledText>
                  <StyledTextInput
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                      errors.pix
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    placeholder={
                      errors.pix ? String(errors.pix) : "Digite o pix"
                    }
                    placeholderTextColor={
                      errors.pix ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                    onChangeText={handleChange("pix")}
                    onBlur={handleBlur("pix")}
                    value={values.pix}
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Instituicao Financeira
                  </StyledText>
                  <StyledTextInput
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                      errors.bankName
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    onChangeText={handleChange("bankName")}
                    onBlur={handleBlur("bankName")}
                    value={values.bankName}
                    placeholder={
                      errors.bankName
                        ? String(errors.bankName)
                        : "Digite o nome da instituicao financeira"
                    }
                    placeholderTextColor={
                      errors.bankName ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Agencia
                  </StyledText>
                  <StyledTextInput
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                      errors.bankAgency
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    onChangeText={handleChange("bankAgency")}
                    onBlur={handleBlur("bankAgency")}
                    value={values.bankAgency}
                    placeholder={
                      errors.bankAgency
                        ? String(errors.bankAgency)
                        : "Digite o nome da agencia bancaria"
                    }
                    placeholderTextColor={
                      errors.bankAgency ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Conta Bancaria
                  </StyledText>
                  <StyledTextInput
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                      errors.bankAccountNumber
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    onChangeText={handleChange("bankAccountNumber")}
                    onBlur={handleBlur("bankAccountNumber")}
                    value={values.bankAccountNumber}
                    placeholder={
                      errors.bankAccountNumber
                        ? String(errors.bankAccountNumber)
                        : "Digite o numero da conta bancaria"
                    }
                    placeholderTextColor={
                      errors.bankAccountNumber
                        ? "rgb(127 29 29)"
                        : "rgb(156 163 175)"
                    }
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Rua
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
                    placeholder={
                      errors.street
                        ? String(errors.street)
                        : "Digite o nome da rua"
                    }
                    placeholderTextColor={
                      errors.street ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                  />
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
                    placeholder={
                      errors.streetNumber
                        ? String(errors.streetNumber)
                        : "Digite o numero da rua"
                    }
                    placeholderTextColor={
                      errors.streetNumber
                        ? "rgb(127 29 29)"
                        : "rgb(156 163 175)"
                    }
                  />
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
                    placeholder={
                      errors.neighborhood
                        ? String(errors.neighborhood)
                        : "Digite o nome do bairro"
                    }
                    placeholderTextColor={
                      errors.neighborhood
                        ? "rgb(127 29 29)"
                        : "rgb(156 163 175)"
                    }
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Complemento
                  </StyledText>
                  <StyledTextInput
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
                      errors.complement
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    placeholder={
                      errors.complement
                        ? String(errors.complement)
                        : "Digite o complement"
                    }
                    placeholderTextColor={
                      errors.complement ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                    onChangeText={handleChange("complement")}
                    onBlur={handleBlur("complement")}
                    value={values.complement}
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
                      errors.cep ? String(errors.cep) : "Digite o cep"
                    }
                    placeholderTextColor={
                      errors.cep ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                    keyboardType="numeric" // Define o teclado numéri
                  />
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
                    placeholder={
                      errors.city
                        ? String(errors.city)
                        : "Digite o nome da cidade"
                    }
                    placeholderTextColor={
                      errors.city ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                  />
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
                    placeholder={
                      errors.state
                        ? String(errors.state)
                        : "Digite a sigla do estado"
                    }
                    placeholderTextColor={
                      errors.state ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                  />
                </StyledView>
              </StyledView>
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
              >
                <StyledText className="font-bold text-custom-white">
                  {owner ? "Atualizar" : "Criar"}
                </StyledText>
              </StyledPressable>
            </StyledView>
          )}
        </Formik>
        <DeleteConfirmationModal
          entity="orcamento"
          visible={modalDeleteVisible}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </StyledScrollView>
      <FlashMessage ref={flashMessageRef} />
    </StyledModal>
  );
}
