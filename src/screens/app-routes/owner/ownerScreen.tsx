import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { OwnerFormComponent } from "@components/owners/form";
import { OwnerListComponent } from "@components/owners/list";
import { useRoute } from "@react-navigation/native";
import { RootState } from "@store/index";
import { Organization } from "@store/organization/organizationSlice";
import { fecthOwnersByOrganization } from "@store/owner/ownerSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { OwnerType } from "type";

export default function OwnerScreenComponent() {
  const [ownerModaIslOpen, setIsOwnerModalOpen] = useState(false);

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const ownersByOrganization: OwnerType[] = useSelector(
    (state: RootState) => state.ownerList.ownersByOrganization
  );

  const ownersByVenueList: OwnerType[] = useSelector(
    (state: RootState) => state.ownerList.ownersByVenue
  );

  const isLoading = useSelector((state: RootState) => state.ownerList.loading);

  const route = useRoute();
  const params: { type: "ORGANIZATION" | "VENUE" } = route.params || {};
  const queryParams = new URLSearchParams();
  return (
    <StyledView className="h-full w-full bg-gray-dark">
      <StyledPressable
        onPress={() => setIsOwnerModalOpen(true)}
        className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-5 border-[0.6px] border-white border-solid w-[50%]"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Proprietario
        </StyledText>
      </StyledPressable>
      {params?.type === "ORGANIZATION" && (
        <SearchFilterListByQueryComponent
          entityId={organization.id}
          queryName="completeName"
          entityName="organizationId"
          fectData={fecthOwnersByOrganization}
          queryParams={queryParams}
        />
      )}
      <OwnerListComponent
        owners={
          params?.type === "ORGANIZATION"
            ? ownersByOrganization
            : ownersByVenueList
        }
        isLoading={isLoading}
      />
      <OwnerFormComponent
        type={params?.type}
        isModalOpen={ownerModaIslOpen}
        setIsModalOpen={setIsOwnerModalOpen}
        organizationId={organization.id}
      />
    </StyledView>
  );
}
