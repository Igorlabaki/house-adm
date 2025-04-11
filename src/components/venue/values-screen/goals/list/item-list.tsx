import moment from "moment";
import "moment/locale/pt-br";
import { useState } from "react";
import { format } from "date-fns";
import { GoalType } from "type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { GoalFormComponent } from "../form";
import { formatCurrency } from "react-native-format-currency";

/* import { GoalModalComponent } from "../../calendarSection/components/modal"; */
interface GoalItemFlatListProps {
  goal: GoalType;
}
moment.locale("pt-br");
export function GoalItemFlatList({ goal }: GoalItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const monthTranslation: { [key: string]: string } = {
    "1": "Jan",
    "2": "Fev",
    "3": "Mar",
    "4": "Abr",
    "5": "Mai",
    "6": "Jun",
    "7": "Jul",
    "8": "Ago",
    "9": "Set",
    "10": "Out",
    "11": "Nov",
    "12": "Dez",
  };

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      {goal.months && (
        <StyledView className="flex justify-center items-center flex-col gap-y-2 mb-4">
          <StyledText className="text-[14px] text-custom-white text-center">
            Periodo:
          </StyledText>
          <StyledView className="flex flex-row w-full justify-center items-center flex-wrap">
            {goal.months?.split(",").map((item: string) => {
              return (
                <StyledText
                  className="text-custom-white text-[14px]  font-bold"
                  key={item}
                >
                  {monthTranslation[item.toLowerCase()] || item}{" "}
                  {/* Aqui estamos fazendo a tradução */}
                </StyledText>
              );
            })}
          </StyledView>
        </StyledView>
      )}
      <StyledView className="flex flex-row justify-between items-center w-full mt-5">
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-[13px] text-custom-white">
            Meta:
          </StyledText>
          <StyledView className="flex flex-row gap-x-1 justify-start items-center">
            <StyledText className="text-[13px] font-bold text-custom-white text-center">
              {goal?.minValue ?
                formatCurrency({
                  amount: Number(goal?.minValue.toFixed(2)),
                  code: "BRL",
                })[0] : "R$ 0,00"}
            </StyledText>
            <StyledText className="text-[13px] text-custom-white">/</StyledText>
            <StyledText className="text-[13px] font-bold text-custom-white text-center">
              {goal?.maxValue ?
                formatCurrency({
                  amount: Number(goal?.maxValue.toFixed(2)),
                  code: "BRL",
                })[0] : null}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledView className="flex flex-row gap-x-2">
          <StyledText className="text-[13px] text-custom-white">
            Acrecimo:
          </StyledText>
          <StyledText className="text-[13px] font-bold text-custom-white text-center">
            {goal.increasePercent} %
          </StyledText>
        </StyledView>
      </StyledView>
      <GoalFormComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        goal={goal}
      />
    </StyledPressable>
  );
}
