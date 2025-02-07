import { useEffect } from "react";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector, useDispatch } from "react-redux";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { fecthServices, ServiceType } from "@store/service/service-slice";
import { ServiceItemFlatList } from "./serviceItemFlatList";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";


export const StyledFlatList = styled(FlatList<ServiceType>);

export function ServiceFlatList() {
  const serviceList = useSelector((state: RootState) => state.serviceList);

  if (serviceList.loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: ServiceType) => item?.id}
        data={serviceList?.services}
        renderItem={({ item }: { item: ServiceType }) => {
          return <ServiceItemFlatList service={item} key={item?.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="valor" />}
        className="flex-1"
      />
    </>
  );
}
