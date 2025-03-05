import moment from "moment";
import { Formik } from "formik";
import { useState } from "react";
import { format } from "date-fns";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  CreateExpenseFormData,
  createExpenseFormSchema,
} from "@schemas/expense/create-expense-params-schema";
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
  createExpenseAsync,
  ExpenseType,
  updateExpenseByIdAsync,
} from "@store/expense/expenseSlice";
import { Venue } from "@store/venue/venueSlice";
import { transformMoneyToNumber } from "function/transform-money-to-number";

interface ExpenseFormProps {
  expense?: ExpenseType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ExpenseForm({ expense, setIsModalOpen }: ExpenseFormProps) {
  const [selected, setSelected] = useState<any>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.expenseList.error
  );
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  const types = [
    { display: "Anual", value: "ANNUAL" },
    { display: "Mensal", value: "MONTHLY" },
    { display: "Semanal", value: "WEEKLY" },
    { display: "Quinzenal", value: "BIWEEKLY" },
  ];

  const categories = [
    { display: "Imposto", value: "TAX" },
    { display: "Marketing", value: "ADVERTISING" },
    { display: "Manutencao", value: "MAINTENANCE" },
    { display: "Investimento", value: "INVESTMENT" },
  ];

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createExpenseFormSchema)}
      initialValues={{
        venueId: venue.id,
        type: expense?.type || "SPORADIC",
        name: expense?.name && expense.name,
        category: expense?.category || "TAX",
        amount: expense?.amount && String(expense?.amount),
        description: (expense?.description && expense.description) || "",
        recurring: expense?.recurring ? expense.recurring : false,
        paymentDate:
          expense?.paymentDate &&
          format(expense?.paymentDate, "dd/MM/yyyy").toString(),
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validate={(values) => {
        try {
          createExpenseFormSchema.parse(values);
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
      onSubmit={async (values: CreateExpenseFormData) => {
        const { amount, paymentDate, ...rest } = values;

        const today = new Date();
        const formattedDate = format(today, "dd/MM/yyyy"); // "04/03/2025" (exemplo)

        // Verifica se existe `paymentDate`, senão usa a data de hoje
        const [dayInicio, monthInicio, yearInicio] = paymentDate
          ? paymentDate.split("/")
          : formattedDate.split("/");

        // Criando a data corretamente (ano, mês-1, dia)
        const dataPagamento = new Date(
          Number(yearInicio),
          Number(monthInicio) - 1, // O mês no JS começa do 0 (Janeiro = 0, Fevereiro = 1, ...)
          Number(dayInicio)
        );
        const formatedAmount = transformMoneyToNumber(values?.amount);

        if (!expense) {
          const response = await dispatch(
            createExpenseAsync({
              amount: Number(formatedAmount),
              paymentDate: dataPagamento,
              venueId: venue?.id,
              ...rest,
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response?.payload?.message, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload.message, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        } else {
          const response = await dispatch(
            updateExpenseByIdAsync({
              expenseId: expense.id,
              data: {
                ...rest,
                paymentDate: dataPagamento,
                amount: Number(formatedAmount),
              },
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
            Toast.show(response.payload.message, 3000, {
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
        getFieldMeta,
        setFieldValue,
        values,
        errors,
      }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  placeholder={errors.name ? errors.name : "Digite o nome"}
                  placeholderTextColor={
                    errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.name
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-2 mt-3">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Valor
                </StyledText>
                <StyledTextInputMask
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.amount
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="money"
                  options={{
                    maskType: "BRL",
                  }}
                  onChangeText={handleChange("amount")}
                  onBlur={handleBlur("amount")}
                  value={String(Number(values?.amount) * 100)}
                />
                {errors?.amount && errors?.amount?.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.amount?.toString()}
                  </StyledText>
                )}
              </StyledView>

              <StyledView className="pt-3">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Recorrente:
                </StyledText>
                <StyledView className="flex justify-start items-start flex-row py-2 mt-1">
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("recurring", true);
                        setFieldValue("paymentDate", undefined);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("recurring").value === true && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray  text-[13px] font-semibold">
                        Sim
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("recurring", false);
                        setFieldValue("type", "SPORADIC");
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("recurring").value === false && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray  text-[13px] font-semibold">
                        Nao
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                </StyledView>
              </StyledView>
              {getFieldMeta("recurring").value === false && (
                <StyledView className="flex flex-col gap-2 mb-2">
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Data do Pagamento :
                  </StyledText>
                  <StyledPressable
                    onPress={() => setIsCalendarModalOpen(true)}
                    className={`rounded-md px-3 py-1 text-white ${
                      errors.paymentDate
                        ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                        : "bg-gray-ligth"
                    }`}
                  >
                    <StyledText
                      className={`
                    ${
                      (getFieldMeta("paymentDate")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.paymentDate
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                    >
                      {(getFieldMeta("paymentDate")?.value as string)
                        ? getFieldMeta("paymentDate")?.value?.toString()
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
                              "paymentDate",
                              moment.utc(day.dateString).format("DD/MM/yyyy")
                            );
                            setSelected(day.dateString);
                            setIsCalendarModalOpen(false);
                          }}
                        />
                      </StyledView>
                    </StyledTouchableOpacity>
                  </StyledModal>
                </StyledView>
              )}
              {getFieldMeta("recurring").value && (
                <StyledView className="py-3">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Tipo:
                  </StyledText>
                  <StyledView className="flex justify-start items-start flex-row py-2 mt-1">
                    {types.map((item, index) => {
                      return (
                        <StyledView
                          key={index}
                          className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className="flex flex-row items-center justify-center gap-x-2 cursor-pointer"
                            onPress={() => {
                              setFieldValue("type", item.value); // Salva o valor em inglês
                            }}
                          >
                            <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                              {getFieldMeta("type").value === item.value && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray text-[13px] font-semibold">
                              {item.display}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })}
                  </StyledView>
                </StyledView>
              )}
              <StyledView className="">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Categoria:
                </StyledText>
                <StyledView className="flex justify-start items-start flex-row py-2 flex-wrap gap-y-2 mt-1">
                  {categories.map((item, index) => {
                    return (
                      <StyledView
                        key={index}
                        className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan text-[12px] md:text-[15px]"
                      >
                        <StyledPressable
                          className="flex flex-row items-center justify-center gap-x-2 cursor-pointer"
                          onPress={() => {
                            setFieldValue("category", item.value); // Salva o valor em inglês
                          }}
                        >
                          <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                            {getFieldMeta("category").value === item.value && (
                              <Entypo name="check" size={12} color="white" />
                            )}
                          </StyledView>
                          <StyledText className="text-custom-gray text-[13px] font-semibold">
                            {item.display} {/* Exibe o texto em português */}
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                    );
                  })}
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {expense ? "Atualizar" : "Criar"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
