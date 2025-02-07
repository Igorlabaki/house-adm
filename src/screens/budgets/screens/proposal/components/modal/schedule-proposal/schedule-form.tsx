import moment from "moment";
import { Formik } from "formik";
import { ProposalType } from "type";
import { useEffect, useRef, useState } from "react";
import Toast from "react-native-simple-toast";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { fecthApprovedProposals, fecthProposals, fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  createScheduleAsync,
  deleteScheduleAsync,
  Schedule,
  updateScheduleAsync,
} from "@store/schedule/schedule-slice";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import {
  CreateScheduleRequestParams,
  createScheduleSchema,
} from "@schemas/schedule/create-schedule-params-schema";
import { createScheduleFormSchema, CreateScheduleFormSchema } from "@schemas/schedule/create-schedule-form-schema";
import { Venue } from "@store/venue/venueSlice";

interface scheduleFormProps {
  schedule?: Schedule;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ScheduleForm({ schedule, setIsModalOpen }: scheduleFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.scheduleList.error
  );

  const proposal: ProposalType = useSelector<RootState>(
    (state: RootState) => state.proposalList.proposal
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const flashMessageRef = useRef(null);

  async function onConfirmDelete() {
    const response = await dispatch(deleteScheduleAsync(schedule?.id));

    if (response.meta.requestStatus == "fulfilled") {
      await dispatch(fetchProposalByIdAsync(proposal?.id));
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

  function onCancel() {
    setModalVisible(false);
  }
  const queryParams = new URLSearchParams();

  return (
    <StyledView className="py-5">
      {schedule && (
        <StyledPressable
          className="absolute top-3 right-1"
          onPress={() => setModalVisible(true)}
        >
          <MaterialCommunityIcons name="delete" size={20} color="white" />
        </StyledPressable>
      )}
      <Formik
        validationSchema={toFormikValidationSchema(createScheduleFormSchema)}
        initialValues={{
          name: schedule?.name,
          proposalId: proposal?.id,
          description: schedule?.description,
          endHour: schedule?.startHour
          ? moment.utc(schedule?.endHour)?.format("HH:mm")
          : "",
          startHour: schedule?.startHour
          ? moment.utc(schedule.startHour)?.format("HH:mm")
          : "",
          workerNumber: schedule?.workerNumber ? schedule?.workerNumber.toString() : "0",
        }}
        validate={(values) => {
          try {
            createScheduleFormSchema.parse(values)
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
        onSubmit={async (values: CreateScheduleFormSchema) => {
          if (!schedule) {
            const response = await dispatch(
              createScheduleAsync({
                name: values?.name,
                proposalId: proposal?.id,
                endHour: values?.endHour,
                startHour: values?.startHour,
                description: values?.description,
                workerNumber: Number(values?.workerNumber),
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              await dispatch(fetchProposalByIdAsync(proposal?.id));
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
          } else {
            const response = await dispatch(
              updateScheduleAsync({
                scheduleId: schedule.id,
                data: {
                  name: values?.name,
                  endHour: values?.endHour,
                  startHour: values.startHour,
                  description: values?.description,
                  workerNumber: Number(values?.workerNumber)
                },
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              await dispatch(fetchProposalByIdAsync(proposal?.id));
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
          <StyledView
            className="w-full mx-auto my-5 flex flex-col"
            ref={flashMessageRef}
          >
            <StyledView className="flex flex-col gap-y-3">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values?.name}
                  placeholder={
                    errors?.name ? errors?.name : "Digite o nome do convidado"
                  }
                  placeholderTextColor={
                    errors?.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors?.name
                      ? "bg-red-50 border-[2px] border-red-900 "
                      : "bg-gray-ligth"
                  }`}
                />
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
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Colaboradores
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
                onChangeText={(value) =>
                  handleChange("workerNumber")(value?.replace(/[^0-9]/g, ""))
                }
                onBlur={handleBlur("workerNumber")}
                value={values?.workerNumber?.toString()}
                keyboardType="numeric"
                placeholder={
                  errors?.workerNumber
                    ? errors.workerNumber?.toString()
                    : "Digite quantidade de convidados"
                }
                placeholderTextColor={
                  errors.workerNumber ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.workerNumber
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
              />
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
                    ? errors.description?.toString()
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
            <StyledPressable
              onPress={() => {
                handleSubmit();
              }}
              className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
            >
              <StyledText className="font-bold text-custom-white">
                {schedule ? "Atualizar" : "Criar"}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
      <DeleteConfirmationModal
        entity="programacao"
        visible={modalVisible}
        onConfirm={onConfirmDelete}
        onCancel={onCancel}
      />
    </StyledView>
  );
}
