import {
  StyledModal,
  StyledPressable,
  StyledSafeAreaView,
  StyledScrollView,
  StyledView,
} from "styledComponents";
import { ProposalType } from "type";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { Venue } from "@store/venue/venueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { ProposalPerDayForm } from "../form/proposal-per-day-form";
import { ProposalPerPersonForm } from "../form/proposal-per-person-form";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  closeModal,
  deleteProposalByIdAsync,
} from "@store/proposal/proposal-slice";
import { useNavigation } from "@react-navigation/native";
interface ProposalModalProps {
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsInfoModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ProposalModal({
  type,
  isModalOpen,
  setIsEditModalOpen,
  setIsInfoModalOpen,
}: ProposalModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const { proposal }: { proposal: ProposalType } = useSelector(
    (state: RootState) => state.proposalList
  );

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.set("venueId", venue.id);
  }, []);
  const navigation = useNavigation();
  const confirmDelete = async () => {
    const response = await dispatch(deleteProposalByIdAsync(proposal.id));
    if (response.meta.requestStatus === "fulfilled") {
      dispatch(fetchNotificationsList(venue.id));

      Toast.show(response.payload.message as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      setIsEditModalOpen(false);
      setIsInfoModalOpen(false);
      navigation.navigate("MainTabs");
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }

    setModalVisible(false);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsEditModalOpen(false);
      }}
      animationType="fade"
    >
      <StyledSafeAreaView>
        <StyledScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <StyledView className="flex-1 bg-gray-dark pt-10 relative pb-16">
            <StyledPressable
              onPress={async () => handleDelete()}
              className="absolute top-5        right-5"
            >
              <Feather name="trash" size={16} color="white" />
            </StyledPressable>
            {proposal && (
              <StyledPressable
                onPress={async () => {
                  handleDelete();
                }}
                className="absolute top-5 right-5"
              >
                <Feather name="trash" size={16} color="white" />
              </StyledPressable>
            )}
            {type === "UPDATE" && venue?.pricingModel === "PER_DAY" ? (
              <ProposalPerDayForm
                setIsEditModalOpen={setIsEditModalOpen}
                proposal={proposal}
              />
            ) : type === "UPDATE" && venue?.pricingModel === "PER_PERSON" ? (
              <ProposalPerPersonForm
                setIsEditModalOpen={setIsEditModalOpen}
                proposal={proposal}
              />
            ) : type === "CREATE" && venue?.pricingModel === "PER_DAY" ? (
              <ProposalPerDayForm setIsEditModalOpen={setIsEditModalOpen} />
            ) : (
              <ProposalPerPersonForm setIsEditModalOpen={setIsEditModalOpen} />
            )}
          </StyledView>
        </StyledScrollView>
      </StyledSafeAreaView>
      <DeleteConfirmationModal
        entity="proposal"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
