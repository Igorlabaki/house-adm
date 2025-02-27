import { useState } from "react";
import { ContractType } from "type";
import { ContractModalComponent } from "../modal";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { selectContractAsync } from "@store/contract/contract-slice";

interface ItemFlatListProps {
  contract: ContractType;
}

export default function ContractItemFlatList({ contract }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start  gap-x-1">
          <StyledText className="text-[14px] text-white font-semibold">
            {contract?.name}
          </StyledText>
        </StyledView>
      </StyledView>
      <ContractModalComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        type="UPDATE"
        contract={contract}
      />
    </StyledPressable>
  );
}
