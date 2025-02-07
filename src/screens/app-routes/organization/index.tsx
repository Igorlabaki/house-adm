import {
  StyledText,
  StyledView,
  StyledPressable,
} from "styledComponents";
import { User } from "@store/auth/authSlice";
import React, { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { fecthOrganizations } from "@store/organization/organizationSlice";
import { OrganizationFlatList } from "../../../components/organization/list";
import OrganizationFormModalComponent from "../../../components/organization/form";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";

export default function OrganizationListScreen() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector((state: RootState) => state?.user.user);
  const { loading, organizations } = useSelector(
    (state: RootState) => state.organizationList
  );

  const queryParams = new URLSearchParams();
  queryParams.append("userId", user?.id);

  useEffect(() => {
    dispatch(fecthOrganizations(`${queryParams.toString()}`));
  }, []);

  return (
    <StyledView className="w-full bg-gray-dark  py-5 h-screen">
      <StyledView className="flex flex-col justify-center items-start gap-y-4 w-full mt-10">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
          justify-center items-center bg-green-800 active:scale-95
          rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Nova Organização
          </StyledText>
        </StyledPressable>
        <SearchFilterListByQueryComponent
          entityId=""
          entityName=""
          queryName="name"
          fectData={fecthOrganizations}
          queryParams={queryParams}
        />
        <OrganizationFlatList
          isLoading={loading}
          organizationList={organizations}
        />
      </StyledView>
      {isModalOpen && (
        <OrganizationFormModalComponent
          isModalOpen={isModalOpen}
          setMenuModalIsOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
