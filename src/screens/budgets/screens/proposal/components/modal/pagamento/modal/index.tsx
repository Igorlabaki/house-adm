import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { PaymentType, ProposalType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { CretePaymentFormComponent } from "../form/create-form";
import { UpdatePaymentFormComponent } from "../form/update-form";
import { deletePaymentByIdAsync } from "@store/payment/payment-slice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";

interface PaymentModalProps {
  payment?: PaymentType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PaymentModal({
  isModalOpen,
  payment,
  setIsModalOpen,
}: PaymentModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);

  const proposal: ProposalType = useSelector(
    (state: RootState) => state?.proposalList.proposal
  );

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(deletePaymentByIdAsync(payment.id));

    if (response.meta.requestStatus === "fulfilled") {
      Toast.show(response.payload.message, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      dispatch(fetchProposalByIdAsync(proposal?.id));
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="flex-1 bg-gray-dark pt-10 relative">
        {payment && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {payment ? (
          <UpdatePaymentFormComponent
            proposalId={proposal?.id}
            payment={payment}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <CretePaymentFormComponent
            proposalId={proposal?.id}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="paymentm"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
