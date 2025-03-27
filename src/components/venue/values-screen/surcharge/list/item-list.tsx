import moment from "moment";
import "moment/locale/pt-br";
import { useState } from "react";
import { format } from "date-fns";
import { SeasonalFeeType } from "type";
import { Feather, Ionicons } from "@expo/vector-icons";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SeasonalFeeFormComponent } from "../../form";
/* import { SeasonalFeeModalComponent } from "../../calendarSection/components/modal"; */
interface SeasonalFeeItemFlatListProps {
  seasonalFee: SeasonalFeeType;
}
moment.locale("pt-br");
export function SeasonalFeeItemFlatList({
  seasonalFee,
}: SeasonalFeeItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekDaysTranslation: { [key: string]: string } = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  };

  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledText className="w-full text-[16px] font-bold text-custom-white text-center">
        {seasonalFee.title}
      </StyledText>
      <StyledView className="flex flex-row justify-between items-center w-full mx-auto mt-5">
        {seasonalFee.startDay && (
          <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
            <Ionicons name="calendar-outline" size={20} color="white" />
            <StyledText className="flex flex-row text-[13px] text-white font-semibold">
              <StyledText className="text-white text-[11px]">
                {seasonalFee.startDay} ate{" "}
              </StyledText>
              <StyledText className="text-white text-[11px]">
                {seasonalFee.endDay}
              </StyledText>
            </StyledText>
          </StyledView>
        )}
        {seasonalFee.affectedDays && (
          <StyledView>
            {seasonalFee.affectedDays?.split(",").map((item: string) => {
              return (
                <StyledText className="text-white text-[11px]" key={item}>
                  {weekDaysTranslation[item.toLowerCase()] || item}{" "}
                  {/* Aqui estamos fazendo a tradução */}
                </StyledText>
              );
            })}
          </StyledView>
        )}
        <StyledView className="flex flex-col justify-center items-center gap-y-1 w-[33%]">
          <StyledText className="w-full text-[16px] font-bold text-custom-white text-center">
            {" "}
            + {seasonalFee.fee} %
          </StyledText>
        </StyledView>
      </StyledView>
      <SeasonalFeeFormComponent
        type="SURCHARGE"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        seasonalFee={seasonalFee}
      />
    </StyledPressable>
  );
}
