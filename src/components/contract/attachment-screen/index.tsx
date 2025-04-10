import React, { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { fecthClauses } from "@store/clause/clause-slice";
import { Organization } from "@store/organization/organizationSlice";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { fecthAttachments } from "@store/attachment/attachment-slice";
import { AttachmentModalComponent } from "./modal";
import { AttachmentFlatList } from "./list/flat-list";

export default function AttachmentScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams();
  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  return (
    <StyledView className="bg-gray-dark  flex-1 flex flex-col h-full w-full pt-5 pb-10">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
                  justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                  rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]
                  "
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Anexo
        </StyledText>
      </StyledPressable>
      <SearchFilterListByQueryComponent
        entityId={organization.id}
        queryName="name"
        entityName="organizationId"
        fectData={fecthAttachments}
        queryParams={queryParams}
      />
      <AttachmentFlatList />
      {isModalOpen && (
        <AttachmentModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
