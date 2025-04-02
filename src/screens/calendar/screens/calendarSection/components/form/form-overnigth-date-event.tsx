import moment from "moment";
import { Formik } from "formik";
import { styled } from "nativewind";
import { FlatList } from "react-native";
import { useDebounce } from "use-debounce";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { ProposalType, DateEventType } from "type";
import { useState, useEffect, useRef } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  createOverNigthDateEventAsync,
  updateOverNightDateEventAsync,
} from "@store/dateEvent/dateEventSlice";
import { createSameDayDateEventFormSchema } from "@schemas/dateEvent/create-data-event-form-zod-schema";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import {
  fecthApprovedProposals,
  fecthProposals,
  fetchProposalByIdAsync,
} from "@store/proposal/proposal-slice";

import { Venue } from "@store/venue/venueSlice";
import { User } from "@store/auth/authSlice";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import {
  CreateOvernigthDateEventFormSchema,
  createOvernigthDateEventFormSchema,
} from "@schemas/dateEvent/create-overnigth-from-data-event-form-zod-schema";

interface DateEventFormProps {
  dateSelected?: DateEventType;
  setDeleteModalIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StyledFlatList = styled(FlatList<ProposalType>);

export function OverNigthDateEventFormComponent({
  dateSelected,
  setDeleteModalIsOpen,
}: DateEventFormProps) {
  const today = new Date();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>();
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query, 500);

  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoding] = useState(false);

  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
  );

  const formikRef = useRef(null);
  const user: User = useSelector((state: RootState) => state.session.user);

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.append("venueId", venue.id);
  }, []);

  const initialValuesProposal: {
    type?: "EVENT" | "OTHER" | "BARTER" | "PRODUCTION" | "VISIT" | "OVERNIGHT";
    title?: string;
    startDay?: string;
    endDay?: string;
    endHour?: string;
    startHour?: string;
  } = {
    type: "OVERNIGHT",
    startDay:
      proposal?.startDate &&
      moment.utc(proposal?.startDate).format("DD/MM/yyyy"),
    endDay:
      proposal?.endDate && moment.utc(proposal?.endDate).format("DD/MM/yyyy"),
    title: `Estadia - ${proposal?.completeClientName}`,
    endHour: proposal?.endDate
      ? moment.utc(proposal?.endDate).format("HH:mm")
      : venue?.checkOut
      ? moment.utc(venue?.checkOut).format("HH:mm")
      : "",
    startHour: proposal?.startDate
      ? moment.utc(proposal?.startDate).format("HH:mm")
      : venue?.checkIn
      ? moment.utc(venue?.checkIn).format("HH:mm")
      : "",
  };

  const queryProposalsParams = new URLSearchParams();
  const queryApprovedParams = new URLSearchParams();

  return (
    <StyledView>
      <Formik
        innerRef={formikRef}
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(
          createOvernigthDateEventFormSchema
        )}
        initialValues={initialValuesProposal}
        validate={(values) => {
          try {
            createOvernigthDateEventFormSchema.parse(values);
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
        onSubmit={async (values: CreateOvernigthDateEventFormSchema) => {
          setIsLoding(true);
          if (dateSelected) {
            const response = await dispatch(
              updateOverNightDateEventAsync({
                data: {
                  ...values,
                },
                userId: user?.id,
                venueId: venue?.id,
                username: user?.username,
                proposalId: proposal?.id,
                dateEventId: dateSelected?.id,
              })
            );
            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Data atualizada com sucesso", 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show("Erro ao atualizar a data", 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          } else {
            const response = await dispatch(
              createOverNigthDateEventAsync({
                userId: user.id,
                venueId: venue.id,
                username: user.username,
                proposalId: proposal.id,
                data: {
                  ...values,
                },
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              await dispatch(fetchProposalByIdAsync(proposal.id));
              if (response.payload.data.type === "OVERNIGHT") {
                queryProposalsParams.append("venueId", venue.id);
                queryApprovedParams.append("venueId", venue.id);
                queryApprovedParams.append("approved", "true");

                await dispatch(
                  fecthProposals(`${queryProposalsParams.toString()}`)
                );
                await dispatch(
                  fecthApprovedProposals(`${queryApprovedParams.toString()}`)
                );
              }
              Toast.show(response?.payload?.message, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show(response?.payload, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          }
          setIsLoding(false);
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
        }) => {
          useEffect(() => {
            // Utilize o `setFieldValue` fora do componente, usando a referência do Formik
            if (formikRef.current && dateSelected) {
              formikRef.current.setFieldValue(
                "startHour",
                moment.utc(dateSelected?.startDate).format("HH:mm")
              );
              formikRef.current.setFieldValue(
                "startDay",
                moment.utc(dateSelected?.startDate).format("DD/MM/yyyy")
              );
              formikRef.current.setFieldValue(
                "endDay",
                moment.utc(dateSelected?.endDate).format("DD/MM/yyyy")
              );
              formikRef.current.setFieldValue(
                "endHour",
                moment.utc(dateSelected?.endDate).format("HH:mm")
              );
              formikRef.current.setFieldValue("title", dateSelected?.title);
              formikRef.current.setFieldValue("type", dateSelected?.type);
            }
          }, [dateSelected]);
          return (
            <StyledView className="w-full mx-auto my-5 flex flex-col">
              <StyledView className="flex flex-col gap-y-3">
                <StyledView
                  className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
                >
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Tipo do Evento?
                  </StyledText>
                  <StyledView className="flex flex-row pt-3 ">
                    <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                        onPress={() => {
                          setFieldValue("type", "OVERNIGHT");
                          setFieldValue("title", `Estadia - ${proposal?.completeClientName}`);
                        }}
                      >
                        <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                          {getFieldMeta("type").value === "OVERNIGHT" && (
                            <Entypo name="check" size={12} color="white" />
                          )}
                        </StyledView>
                        <StyledText className="text-custom-gray text-[14px] font-semibold">
                          Estadia
                        </StyledText>
                      </StyledPressable>
                    </StyledView>
                    <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                        onPress={() => {
                          setFieldValue("type", "VISIT");
                          setFieldValue("title", `Visita - ${proposal?.completeClientName}`);
                        }}
                      >
                        <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                          {getFieldMeta("type").value === "VISIT" && (
                            <Entypo name="check" size={12} color="white" />
                          )}
                        </StyledView>
                        <StyledText className="text-custom-gray text-[14px] font-semibold">
                          Visita
                        </StyledText>
                      </StyledPressable>
                    </StyledView>
                    <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                        onPress={() => {
                          setFieldValue("type", "OTHER");
                          setFieldValue("title", `Outro - ${proposal?.completeClientName}`);
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
                {getFieldMeta("type").value === "OVERNIGHT" ? (
                  <StyledView className="flex flex-col gap-y-2">
                    <StyledView className="flex flex-col gap-2 mt-3">
                      <StyledText className="font-semibold text-custom-gray text-[14px]">
                        Data do checkIn :
                      </StyledText>
                      <StyledPressable
                        onPress={() => setIsCheckInModalOpen(true)}
                        className={`rounded-md px-3 py-1 text-white ${
                          errors.startDay
                            ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                            : "bg-gray-ligth"
                        }`}
                      >
                        <StyledText
                          className={`
                      ${
                        (getFieldMeta("startDay")?.value as string)
                          ? "text-white"
                          : "text-['rgb(156 163 175)']"
                      }
                      text-white  py-1 ${
                        errors.startDay
                          ? " text-red-800 font-normal"
                          : "font-semibold"
                      }}`}
                        >
                          {(getFieldMeta("startDay")?.value as string)
                            ? getFieldMeta("startDay")?.value.toString()
                            : "Choose date"}
                        </StyledText>
                      </StyledPressable>
                      <StyledModal
                        visible={isCheckInModalOpen}
                        onRequestClose={() => setIsCheckInModalOpen(false)}
                        animationType="fade"
                        transparent={true}
                        className="bg-black"
                      >
                        <StyledTouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setIsCheckInModalOpen(false);
                          }}
                        >
                          <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                            <Calendar
                              onDayPress={(day) => {
                                setFieldValue(
                                  "startDay",
                                  moment
                                    .utc(day.dateString)
                                    .format("DD/MM/yyyy")
                                );
                                setSelected(day.dateString);
                                setIsCheckInModalOpen(false);
                              }}
                              markedDates={{
                                "2024-01-22": {
                                  selected: true,
                                  marked: true,
                                  disableTouchEvent: true,
                                  selectedColor: "gray",
                                },
                                [selected]: {
                                  selected: true,
                                  selectedColor: "blue",
                                },
                              }}
                            />
                          </StyledView>
                        </StyledTouchableOpacity>
                      </StyledModal>
                      {errors.startDay &&
                        errors.startDay.includes(
                          "A data de início não pode ser depois da data de término!"
                        ) && (
                          <StyledText className="text-red-700 font-bold flex justify-start items-start">
                            A data de início não pode ser depois da data de
                            término!
                          </StyledText>
                        )}
                    </StyledView>
                    <StyledView className="flex flex-col gap-2">
                      <StyledText className="font-semibold text-custom-gray text-[14px]">
                        Data do chekout :
                      </StyledText>
                      <StyledPressable
                        onPress={() => setIsCheckOutModalOpen(true)}
                        className={`rounded-md px-3 py-1 text-white ${
                          errors.endDay
                            ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                            : "bg-gray-ligth"
                        }`}
                      >
                        <StyledText
                          className={`
                      ${
                        (getFieldMeta("endDay")?.value as string)
                          ? "text-white"
                          : "text-['rgb(156 163 175)']"
                      }
                      text-white  py-1 ${
                        errors.endDay
                          ? " text-red-800 font-normal"
                          : "font-semibold"
                      }}`}
                        >
                          {(getFieldMeta("endDay")?.value as string)
                            ? getFieldMeta("endDay")?.value.toString()
                            : "Escolha a data do check out"}
                        </StyledText>
                      </StyledPressable>
                      <StyledModal
                        visible={isCheckOutModalOpen}
                        onRequestClose={() => setIsCheckOutModalOpen(false)}
                        animationType="fade"
                        transparent={true}
                        className="bg-black"
                      >
                        <StyledTouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setIsCheckOutModalOpen(false);
                          }}
                        >
                          <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                            <Calendar
                              onDayPress={(day) => {
                                setFieldValue(
                                  "endDay",
                                  moment
                                    .utc(day.dateString)
                                    .format("DD/MM/yyyy")
                                );
                                setSelected(day.dateString);
                                setIsCheckOutModalOpen(false);
                              }}
                              markedDates={{
                                "2024-01-22": {
                                  selected: true,
                                  marked: true,
                                  disableTouchEvent: true,
                                  selectedColor: "gray",
                                },
                                [selected]: {
                                  selected: true,
                                  selectedColor: "blue",
                                },
                              }}
                            />
                          </StyledView>
                        </StyledTouchableOpacity>
                      </StyledModal>
                    </StyledView>
                  </StyledView>
                ) : (
                  <>
                    <StyledView className="flex flex-col gap-2 mt-3">
                      <StyledText className="font-semibold text-custom-gray text-[14px]">
                        Data:
                      </StyledText>
                      <StyledPressable
                        onPress={() => setIsCheckInModalOpen(true)}
                        className={`rounded-md px-3 py-1 text-white ${
                          errors.startDay
                            ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                            : "bg-gray-ligth"
                        }`}
                      >
                        <StyledText
                          className={`
                      ${
                        (getFieldMeta("startDay")?.value as string)
                          ? "text-white"
                          : "text-['rgb(156 163 175)']"
                      }
                      text-white  py-1 ${
                        errors.startDay
                          ? " text-red-800 font-normal"
                          : "font-semibold"
                      }}`}
                        >
                          {(getFieldMeta("startDay")?.value as string)
                            ? getFieldMeta("startDay")?.value.toString()
                            : "Choose date"}
                        </StyledText>
                      </StyledPressable>
                      <StyledModal
                        visible={isCheckInModalOpen}
                        onRequestClose={() => setIsCheckInModalOpen(false)}
                        animationType="fade"
                        transparent={true}
                        className="bg-black"
                      >
                        <StyledTouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setIsCheckInModalOpen(false);
                          }}
                        >
                          <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                            <Calendar
                              onDayPress={(day) => {
                                setFieldValue(
                                  "startDay",
                                  moment
                                    .utc(day.dateString)
                                    .format("DD/MM/yyyy")
                                );
                                setFieldValue(
                                  "endDay",
                                  moment
                                    .utc(day.dateString)
                                    .format("DD/MM/yyyy")
                                );
                                setSelected(day.dateString);
                                setIsCheckInModalOpen(false);
                              }}
                              markedDates={{
                                "2024-01-22": {
                                  selected: true,
                                  marked: true,
                                  disableTouchEvent: true,
                                  selectedColor: "gray",
                                },
                                [selected]: {
                                  selected: true,
                                  selectedColor: "blue",
                                },
                              }}
                            />
                          </StyledView>
                        </StyledTouchableOpacity>
                      </StyledModal>
                    </StyledView>
                  </>
                )}
                <StyledView className="flex flex-col gap-y-1">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Check in
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
                    Check out
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
                <StyledView className="flex flex-col gap-y-1">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Titulo
                  </StyledText>
                  <StyledTextInput
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={String(values?.title)}
                    placeholder={
                      errors.title ? String(errors.title) : "Digite o title"
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
              </StyledView>
              <StyledView className="flex flex-col justify-center items-center gap-y-2 w-full mt-5">
                <StyledPressable
                  onPress={() => {
                    handleSubmit();
                  }}
                  className="bg-gray-ligth flex justify-center items-center py-3  rounded-md w-full"
                >
                  <StyledText className="font-bold text-custom-white">
                    {isLoading
                      ? "Enviando"
                      : dateSelected
                      ? "Atualizar"
                      : "Criar"}
                  </StyledText>
                </StyledPressable>
                {dateSelected && (
                  <StyledPressable
                    onPress={() => {
                      setDeleteModalIsOpen(true);
                    }}
                    className="bg-red-900 flex justify-center items-center py-3 rounded-md w-full"
                  >
                    <StyledText className="font-bold text-custom-white">
                      {isLoading ? "Deletando" : "Deletar"}
                    </StyledText>
                  </StyledPressable>
                )}
              </StyledView>
            </StyledView>
          );
        }}
      </Formik>
    </StyledView>
  );
}
