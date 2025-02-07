
import { useState } from "react";
import { OwnerType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { OwnerFormComponent } from "../form";
import { Organization } from "@store/organization/organizationSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

interface OwnerItemListProps {
  owner: OwnerType;
}

export function OwnerItemListComponent({ owner }: OwnerItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const organization: Organization = useSelector((state: RootState) => state?.organizationList.organization);
  
  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-row gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex-row justify-start items-start gap-x-2">
          <StyledText className="text-[12px] text-white font-semibold">
            {owner?.completeName}
          </StyledText>
        </StyledView>
      </StyledView>
      <OwnerFormComponent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        organizationId={organization.id}
        owner={owner}
      />
    </StyledPressable>
  );
}
