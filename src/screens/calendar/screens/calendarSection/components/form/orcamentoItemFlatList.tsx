import { format } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";

import { BugdetType } from "type";
import { FieldMetaProps, FormikErrors } from "formik";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface ItemFlatListProps {
    budget: BugdetType;
    getFieldMeta: <Value>(name: string) => FieldMetaProps<Value>;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => Promise<void | FormikErrors<any>>
}

export function OrcamentoItemFlatList({budget, setFieldValue, getFieldMeta}:ItemFlatListProps) {
  return (
    <StyledPressable
      key={budget.id}
      className="flex-row justify-between items-center h-8"
      onPress={() => {
        setFieldValue("orcamentoId", budget.id);
        setFieldValue("horarioInicio", format(budget?.dataInicio, "HH:mm"));
        setFieldValue("dataInicio", format(budget?.dataInicio, "dd/MM/yyyy"));
        setFieldValue("horarioFim", format(budget?.dataFim, "HH:mm"));
        setFieldValue("tipo", "Evento");
        setFieldValue("titulo", `Evento - ${budget?.nome}`);
      }}
    >
      <StyledText className="text-white">{budget.nome}</StyledText>
      <StyledView className="bg-white flex justify-center items-center   h-5 w-5">
        {getFieldMeta("orcamentoId").value === budget.id && (
          <FontAwesome name="check" size={12} color="black" />
        )}
      </StyledView>
    </StyledPressable>
  );
}
