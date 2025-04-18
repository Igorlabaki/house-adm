import { Formik } from "formik";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import Toast from "react-native-simple-toast";
import ClauseListComponent from "./clause-list";
import { ClauseType, ContractType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { FlatList } from "react-native-gesture-handler";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Organization } from "@store/organization/organizationSlice";
import {
  CreateContractRequestParams,
  createContractSchema,
} from "@schemas/contract/create-contract-params-schema";
import {
  createContractAsync,
  fecthContracts,
  updateContractByIdAsync,
} from "@store/contract/contract-slice";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { Venue } from "@store/venue/venueSlice";
import { Entypo } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";

interface ContractFormProps {
  contract?: ContractType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StyledFlatList = styled(FlatList<ClauseType>);

export function ContractFormComponent({
  contract,
  setIsModalOpen,
}: ContractFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const loading: boolean = useSelector(
    (state: RootState) => state.contractList.loading
  );

  const queryParams = new URLSearchParams();

  const [selectedClauses, setSelectedClauses] = useState<ClauseType[]>([]);

  const [venueIdList, setVenueIdList] = useState<string[]>(
    contract?.venues?.map((item) => item.id) || []
  );

  useEffect(() => {
    if (contract?.clauses && contract.clauses !== selectedClauses) {
      setSelectedClauses(contract.clauses);
    }
  }, [contract?.clauses]);

  useEffect(() => {
    queryParams.append("organizationId", organization?.id);
  }, [organization]);

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createContractSchema)}
      initialValues={{
        clauses: selectedClauses || [],
        organizationId: organization?.id || "",
        title: contract?.title || "",
        name: contract?.name || "",
      }}
      validate={(values) => {
        try {
          createContractSchema.parse(values);
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
      onSubmit={async (values: CreateContractRequestParams) => {
        if (!contract) {
          const response = await dispatch(createContractAsync(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Contrato cadastrado com sucesso." as string, 3000, {
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
            updateContractByIdAsync({
              name: values.name,
              title: values.title,
              contractId: contract.id,
              clauses: values.clauses,
              venueIds: values?.venueIds,
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Contrato atualizado com sucesso." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            await dispatch(fecthContracts(`${queryParams.toString()}`));
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
        getFieldMeta,
        values,
        errors,
      }) => {
        // Atualiza o Formik sempre que selectedClauses mudar
        useEffect(() => {
          setFieldValue("clauses", selectedClauses);
        }, [selectedClauses, setFieldValue]);

        useEffect(() => {
          setFieldValue("venueIds", venueIdList);
        }, [venueIdList]);

        return (
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col ">
            <StyledView className="flex flex-col gap-y-3">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder={errors.name ? errors.name : "Digite pergunta"}
                  placeholderTextColor={
                    errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.name
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Cabecalho
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
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Selecione as Locacoes:
                </StyledText>
                <StyledView className="flex flex-row">
                  {organization.venues.map((item: Venue) => {
                    return (
                      <StyledView
                        className="flex flex-row gap-x-1"
                        key={item.id}
                      >
                        <StyledView
                          className="
                  flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  
                  text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                            onPress={() => {
                              setVenueIdList((prev: string[]) =>
                                prev.includes(item.id)
                                  ? prev.filter((p) => p !== item.id)
                                  : [...prev, item.id]
                              );
                            }}
                          >
                            <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                              {venueIdList.includes(item.id) && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray text-[14px] font-semibold">
                              {item.name}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      </StyledView>
                    );
                  })}
                </StyledView>
              </StyledView>
              <ClauseListComponent
                selectedClauses={selectedClauses}
                setSelectedClauses={setSelectedClauses}
              />
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#faebd7" />
                ) : (
                  <StyledText className="font-bold text-custom-white">
                    {contract ? "Atualizar" : "Cadastrar"}
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
