import moment from "moment";
import { Formik } from "formik";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Entypo, Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ProposalService, ProposalType, ServiceType } from "type";
import { transformMoneyToNumber } from "function/transform-money-to-number";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import { createProposalFormSchema } from "@schemas/proposal/create-proposal-form-schema.ts";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import {
  fetchProposalByIdAsync,
  createProposalPerPersonAsync,
  updateProposalPerPersonAsync,
  deleteProposalByIdAsync,
} from "@store/proposal/proposal-slice";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

interface ProposalFormProps {
  proposal?: ProposalType;
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProposalPerPersonForm({
  setIsEditModalOpen,
  setIsInfoModalOpen,
  proposal,
}: ProposalFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [selected, setSelected] = useState<any>();
  const [isLoading, setIsLoding] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const serviceByVenueList: ServiceType[] = useSelector(
    (state: RootState) => state?.serviceList.services
  );
  const queryParams = new URLSearchParams();
  const venue = useSelector((state: RootState) => state?.venueList.venue);
  const user = useSelector((state: RootState) => state?.session.user);

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const confirmDelete = async () => {
    const response = await dispatch(deleteProposalByIdAsync(proposal.id));
    if (response.meta.requestStatus === "fulfilled") {
      dispatch(fetchNotificationsList(venue.id));

      Toast.show(response.payload.message as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      setIsEditModalOpen(false);
      setIsInfoModalOpen(false);
      navigation.navigate("MainTabs");
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }

    setModalVisible(false);
  };
  const handleDelete = () => {
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    queryParams.append("venueId", venue?.id);
  }, [venue]);

  return (
    <StyledView className="bg-gray-dark">
      <Formik
        validationSchema={toFormikValidationSchema(createProposalFormSchema)}
        validate={(values) => {
          try {
            createProposalFormSchema.parse(values);
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
        initialValues={{
          venueId: venue.id,
          type: (proposal?.type && proposal?.type) || "EVENT",
          completeClientName:
            proposal?.completeClientName && proposal?.completeClientName,
          email: proposal?.email && proposal?.email,
          whatsapp: proposal?.whatsapp && proposal?.whatsapp,
          knowsVenue: proposal?.knowsVenue && proposal?.knowsVenue,
          description: proposal?.description && proposal?.description,
          trafficSource:
            (proposal?.trafficSource && proposal?.trafficSource) || "OTHER",
          totalAmountInput: proposal?.totalAmount
            ? proposal?.totalAmount.toString()
            : "0",
          guestNumber: proposal?.guestNumber
            ? proposal.guestNumber.toString()
            : "0",
          date:
            proposal?.startDate && format(proposal?.startDate, "dd/MM/yyyy"),
          endHour:
            proposal?.endDate && moment.utc(proposal?.endDate).format("HH:mm"),
          startHour:
            proposal?.startDate &&
            moment.utc(proposal?.startDate).format("HH:mm"),
          serviceIds:
            proposal?.proposalServices?.length > 0
              ? proposal.proposalServices.map(
                  (item: ProposalService) => item.service.id
                )
              : [],
        }}
        onSubmit={async (values) => {
          setIsLoding(true);
          if (proposal) {
            const response = await dispatch(
              updateProposalPerPersonAsync({
                data: {
                  ...values,
                  totalAmountInput: transformMoneyToNumber(
                    values?.totalAmountInput
                  ),
                  guestNumber: transformMoneyToNumber(values.guestNumber),
                },
                proposalId: proposal.id,
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              dispatch(fetchNotificationsList(venue.id));
              await dispatch(fetchProposalByIdAsync(proposal?.id));
              Toast.show(response?.payload?.message as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setIsEditModalOpen(false);
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show(response.payload as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }

            setIsLoding(false);
            return;
          }

          const response = await dispatch(
            createProposalPerPersonAsync({
              ...values,
              totalAmountInput: transformMoneyToNumber(
                values?.totalAmountInput
              ),
              userId: user.id,
              guestNumber: transformMoneyToNumber(values.guestNumber),
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response?.payload?.message, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsEditModalOpen(false);
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response?.payload, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }

          setIsLoding(false);
          return;
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
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
            {proposal && (
              <StyledPressable
                onPress={async () => {
                  handleDelete();
                }}
                className="absolute -top-3 right-2"
              >
                <Feather name="trash" size={16} color="white" />
              </StyledPressable>
            )}
            <StyledView className="flex flex-col gap-y-3">
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  onFocus={(e) => e.stopPropagation()}
                  placeholderTextColor={
                    errors.description ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.completeClientName
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                  onChangeText={handleChange("completeClientName")}
                  onBlur={handleBlur("completeClientName")}
                  value={values.completeClientName}
                  placeholder={
                    errors.completeClientName
                      ? String(errors.completeClientName)
                      : "Digite o horário de início"
                  }
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Email
                </StyledText>
                <StyledTextInput
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.email
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={
                    errors.email
                      ? String(errors.email)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Whatsapp
                </StyledText>
                <StyledTextInputMask
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.whatsapp
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="cel-phone"
                  options={{
                    maskType: "BRL",
                    withDDD: true,
                    dddMask: "(99) ",
                  }}
                  onChangeText={handleChange("whatsapp")}
                  onBlur={handleBlur("whatsapp")}
                  value={values.whatsapp}
                  placeholder={
                    errors.whatsapp
                      ? String(errors.whatsapp)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.whatsapp ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                />
              </StyledView>
              <StyledView className="flex flex-col gap-2">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Data do evento :
                </StyledText>
                <StyledPressable
                  onPress={() => setIsCalendarModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.date
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
                    className={`
                    ${
                      (getFieldMeta("date")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.date
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("date")?.value as string)
                      ? getFieldMeta("date")?.value?.toString()
                      : "Escolha a data"}
                  </StyledText>
                </StyledPressable>
                <StyledModal
                  visible={isCalendarModalOpen}
                  onRequestClose={() => setIsCalendarModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <StyledTouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <Calendar
                        onDayPress={(day) => {
                          setFieldValue(
                            "date",
                            moment.utc(day.dateString).format("DD/MM/yyyy")
                          );
                          setSelected(day.dateString);
                          setIsCalendarModalOpen(false);
                        }}
                        markedDates={{
                          "2024-01-22": {
                            selected: true,
                            marked: true,
                            disableTouchEvent: true,
                            selectedColor: "gray",
                          },
                          [selected]: { selected: true, selectedColor: "blue" },
                        }}
                      />
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
              </StyledView>

              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Horario Inicio
                </StyledText>
                <StyledTextInputMask
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.startHour
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                  type={"custom"}
                  options={{
                    mask: "99:99", // Máscara para HH:MM
                  }}
                  onChangeText={(formatted, extracted) => {
                    handleChange("startHour")(formatted); // Usa o texto formatado no formato HH:MM
                  }}
                  onBlur={handleBlur("startHour")}
                  value={String(values?.startHour)}
                  placeholder={
                    errors.startHour
                      ? String(errors.startHour)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.startHour ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric" // Define o teclado numéri
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Horario Fim
                </StyledText>
                <StyledTextInputMask
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.endHour
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                  type={"custom"}
                  options={{
                    mask: "99:99", // Máscara para HH:MM
                  }}
                  onChangeText={(formatted, extracted) => {
                    handleChange("endHour")(formatted); // Usa o texto formatado no formato HH:MM
                  }}
                  onBlur={handleBlur("endHour")}
                  value={String(values?.endHour)}
                  placeholder={
                    errors.endHour
                      ? String(errors.endHour)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.endHour ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric" // Define o teclado numéri
                />
              </StyledView>
            </StyledView>
            <StyledView className="flex flex-col gap-y-2 mt-3">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Convidados
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                onChangeText={(value) =>
                  handleChange("guestNumber")(value.replace(/[^0-9]/g, ""))
                }
                onBlur={handleBlur("guestNumber")}
                value={values?.guestNumber.toString()}
                keyboardType="numeric"
                placeholder={
                  errors?.guestNumber
                    ? errors.guestNumber?.toString()
                    : "Digite quantidade de convidados"
                }
                placeholderTextColor={
                  errors.guestNumber ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.guestNumber
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
              />
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Total
                </StyledText>
                <StyledTextInputMask
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.totalAmountInput
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="money"
                  options={{
                    maskType: "BRL",
                  }}
                  onChangeText={handleChange("totalAmountInput")}
                  onBlur={handleBlur("totalAmountInput")}
                  value={String(Number(values.totalAmountInput) * 100)}
                />
              </StyledView>
            </StyledView>
            <StyledView className="mt-4 space-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Descricao:
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                multiline
                numberOfLines={4} // Defina o número desejado de linhas visíveis
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                textAlignVertical="top"
                placeholder={
                  errors.description
                    ? errors.description.toString()
                    : "Digite uma breve descricao..."
                }
                placeholderTextColor={
                  errors.description ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-2 text-white ${
                  errors.description
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Ja conhece o espaco?
              </StyledText>
              <StyledView className="flex flex-row pt-3 gap-x-1">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("knowsVenue", true);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("knowsVenue").value === true && (
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
                      setFieldValue("knowsVenue", false);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("knowsVenue").value === false && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Nao
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledView
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Tipo do aluguel:
              </StyledText>
              <StyledView className="flex flex-row pt-3 ">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("type", "PRODUCTION");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("type").value === "PRODUCTION" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Filmagem
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("type", "EVENT");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("type").value === "EVENT" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Festa
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("type", "BARTER");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("type").value === "BARTER" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Permuta
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("type", "OTHER");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("type").value === "OTHER" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Outro
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledView className="font-semibold text-custom-gray text-[14px] gap-y-3 mt-2">
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Servicos
              </StyledText>
              <StyledView className="flex flex-row gap-x-1 justify-start items-start  flex-wrap">
                {serviceByVenueList?.length === 0 ? (
                  <StyledText className="text-sm text-center font-light text-gray-400">
                    Nao ha servicos cadastrados nessa organizacao
                  </StyledText>
                ) : (
                  serviceByVenueList?.map((item: ServiceType) => {
                    const isSelected = getFieldMeta(
                      "serviceIds"
                    ).value.includes(item.id); // Verifica se o proprietário já foi selecionado

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
                              getFieldMeta("serviceIds").value;
                            if (isSelected) {
                              // Remove o proprietário se ele já estiver na lista
                              setFieldValue(
                                "serviceIds",
                                currentOwners.filter(
                                  (id: string) => id !== item.id
                                )
                              );
                            } else {
                              // Adiciona o proprietário
                              setFieldValue("serviceIds", [
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
                            {item.name}
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                    );
                  })
                )}
              </StyledView>
            </StyledView>
            <StyledView
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Onde nos achou?
              </StyledText>
              <StyledView className="flex flex-row pt-1 flex-wrap gap-y-1">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "INSTAGRAM");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "INSTAGRAM" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Instagram
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "TIKTOK");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "TIKTOK" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      TiTok
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "FRIEND");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "FRIEND" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Amigos
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "FACEBOOK");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "FACEBOOK" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Facebook
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "AIRBNB");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "AIRBNB" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Airbnb
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "GOOGLE");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "GOOGLE" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Google
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafficSource", "OTHER");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafficSource").value === "OTHER" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Outros
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledPressable
              disabled={isLoading ? true : false}
              onPress={() => {
                handleSubmit();
              }}
              className={`bg-green-800 flex justify-center items-center py-3 mt-10 rounded-md`}
            >
              <StyledText className="font-bold text-custom-white">
                {isLoading ? (
                  <ActivityIndicator size="small" color="#faebd7" />
                ) : proposal ? (
                  "Atualizar"
                ) : (
                  "Cadastrar"
                )}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
      <DeleteConfirmationModal
        entity="orcamento"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledView>
  );
}
