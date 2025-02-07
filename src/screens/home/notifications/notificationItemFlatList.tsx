import { NotificationType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { fetchProposalByIdAsync, openModal } from "@store/proposal/proposal-slice";

interface ItemFlatListProps {
  notification: NotificationType;
}

export function NotificationItemFlatList({ notification }: ItemFlatListProps) {
  const isModalOpen = useSelector((state: RootState) => state.proposalList.isModalOpen);
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  return (
    <StyledPressable
      onPress={() => {
        if(notification.proposalId){
          dispatch(fetchProposalByIdAsync(notification.proposalId));  
          navigation.navigate("ProposaInfoScreen")
        }
      }}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledText className="text-[12px] text-white ">
          {notification?.content}
        </StyledText>
      </StyledView>
    </StyledPressable>
  );
}
