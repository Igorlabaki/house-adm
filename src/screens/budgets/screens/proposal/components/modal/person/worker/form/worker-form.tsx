import { useRef, useState } from "react";
import { Formik } from "formik";
import { User } from "@store/auth/authSlice";
import Toast from "react-native-simple-toast";
import { Venue } from "@store/venue/venueSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  createWorkerAsync,
  deleteWorkerAsync,
  WorkerType,
  updateWorkerAsync,
} from "@store/worker/worker-slice";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import {
  CreateWorkerRequestParams,
  createWorkerSchema,
} from "@schemas/worker/create-worker-params-schema";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { ProposalType } from "type";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface WorkerFormProps {
  worker?: WorkerType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function WorkerForm({ worker, setIsModalOpen }: WorkerFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const user: User = useSelector((state: RootState) => state.user.user);

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const flashMessageRef = useRef(null);

  async function onConfirmDelete() {
    const response = await dispatch(deleteWorkerAsync(worker?.id));

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

  return (
    <StyledView className="pt-10">
      {worker && (
        <StyledPressable
          className="absolute top-6 right-1"
          onPress={() => setModalVisible(true)}
        >
          <Feather name="trash" size={16} color="white" />
        </StyledPressable>
      )}
      <Formik
        validationSchema={toFormikValidationSchema(createWorkerSchema)}
        initialValues={{
          proposalId: proposal?.id,
          rg: worker?.rg ? worker.rg : "",
          attendance: worker?.attendance,
          name: worker?.name ? worker.name : "",
          email: worker?.email ? worker.email : "",
          type: "WORKER",
          venueInfo: {
            city: venue.city,
            email: venue.email,
            name: venue.name,
            neighborhood: venue.neighborhood,
            state: venue.state,
            street: venue.street,
            streetNumber: venue.streetNumber,
          },
        }}
        validate={(values) => {
          try {
            createWorkerSchema.parse(values);
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
        onSubmit={async (values: CreateWorkerRequestParams) => {
          if (!worker) {
            const response = await dispatch(
              createWorkerAsync({
                rg: values.rg,
                userId: user?.id,
                name: values.name,
                type: values?.type,
                email: values.email,
                username: user?.username,
                proposalId: proposal?.id,
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
              updateWorkerAsync({
                personId: worker?.id,
                data: {
                  rg: values?.rg,
                  name: values?.name,
                  email: values?.email,
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
                  Nome Completo
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder={
                    errors.name ? errors.name : "Digite o nome do convidado"
                  }
                  placeholderTextColor={
                    errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.name
                      ? "bg-red-50 border-[2px] border-red-900 "
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
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
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Email
                </StyledText>
                <StyledTextInput
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={
                    errors.email ? errors.email : "Digite o email do convidado"
                  }
                  placeholderTextColor={
                    errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.email
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
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
                {worker ? "Atualizar" : "Criar"}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
      <DeleteConfirmationModal
        entity="convidado"
        visible={modalVisible}
        onConfirm={onConfirmDelete}
        onCancel={onCancel}
      />
    </StyledView>
  );
}
