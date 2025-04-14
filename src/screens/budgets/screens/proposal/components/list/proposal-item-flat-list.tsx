import { useMemo } from "react";
import { format } from "date-fns";
import { ProposalType } from "type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { useNavigation } from "@react-navigation/native";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import {
  fetchProposalByIdAsync,
  openModal,
} from "@store/proposal/proposal-slice";

interface ItemFlatListProps {
  proposal: ProposalType;
}

export function ProposalItemFlatList({ proposal }: ItemFlatListProps) {
  const navigation = useNavigation();
  const dispatch: AppDispatch = useDispatch();
  const formattedDate = useMemo(() => {
    return proposal?.startDate
      ? format(new Date(proposal.startDate), "dd/MM/yyyy")
      : "Data inválida";
  }, [proposal?.startDate]);

  const venue = useSelector((state: RootState) => state.venueList.venue);

  const formattedTotal = useMemo(() => {
    return proposal?.totalAmount
      ? formatCurrency({
          amount: Number(proposal.totalAmount.toFixed(2)),
          code: "BRL",
        })[0]
      : "R$ 0,00";
  }, [proposal?.totalAmount]);

  async function handleButton() {
    await dispatch(fetchProposalByIdAsync(proposal.id));
    navigation.navigate("ProposaInfoScreen");
  }

  const authorizedScreens = venue?.permissions?.includes("VIEW_AMOUNTS");

  return (
    <>
      <StyledPressable
        onPress={() => handleButton()}
        className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
      >
        <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
          <StyledView className="flex-row justify-start items-start min-w-[30%] max-w-[30%]">
            <StyledText className="text-[13px] text-white font-semibold">
              {proposal?.completeClientName || "Nome indisponível"}
            </StyledText>
          </StyledView>
          <StyledView className="flex-row justify-start items-start">
            <StyledText className="text-[13px] text-white font-semibold">
              {formattedDate}
            </StyledText>
          </StyledView>
          {authorizedScreens && (
            <StyledView className="flex-row items-start text-center">
              <StyledText className="text-[13px] text-white font-semibold">
                {formattedTotal}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      </StyledPressable>
    </>
  );
}
