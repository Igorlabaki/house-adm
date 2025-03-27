import { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { fecthClauses } from "@store/clause/clause-slice";
import { Organization } from "@store/organization/organizationSlice";
import { StyledPressable, StyledScrollView, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { ContractFormComponent } from "./form";
import { ContractModalComponent } from "./modal";
import { fecthContacts } from "@store/contact/contact-slice";
import { ContractFlatList } from "./list/flat-list";
import { fecthContracts } from "@store/contract/contract-slice";

export default function ContractScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams();

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );
  
  return (
    <StyledView className="bg-gray-dark flex-1 flex flex-col h-full w-full pt-5">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
                       justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                       rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]
                       "
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Contrato
        </StyledText>
      </StyledPressable>
      <SearchFilterListByQueryComponent
        entityId={organization.id}
        queryName="title"
        entityName="organizationId"
        fectData={fecthContracts}
        queryParams={queryParams}
      />
      <ContractFlatList />
      {isModalOpen && (
        <ContractModalComponent
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
