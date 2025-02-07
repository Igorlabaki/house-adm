import { useState } from "react";
import { PaymentList } from "./payment-list";
import { PaymentInfo } from "./payment-info";
import Toast from "react-native-simple-toast";
import { PaymentType, ProposalType } from "type";
import { PaymentFormComponent } from "./payment-form";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";
import { deletePaymentByIdAsync } from "@store/payment/payment-slice";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

export default function PagamentoScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentType | null>(null);

  return (
    <StyledView className="bg-gray-dark h-full">
      <PaymentInfo />
      <StyledView>
        <StyledText className="text-white font-bold  w-full text-center mt-8">
          Pagamentos ja realizados:
        </StyledText>
        <StyledView className="mt-5 flex flex-col">
          <PaymentList setSelectedPayment={setSelectedPayment} />
        </StyledView>
      </StyledView>
      <PaymentFormComponent
        setSelectedPayment={setSelectedPayment}
        setDeleteModalIsOpen={setDeleteModalIsOpen}
        proposalId={proposal?.id}
        selectedPayment={selectedPayment}
      />
      {
        <DeleteConfirmationModal
          visible={deleteModalIsOpen}
          entity="data"
          onCancel={() => setDeleteModalIsOpen(false)}
          onConfirm={async () => {
            const response = await dispatch(
              deletePaymentByIdAsync(selectedPayment?.id)
            );
            if (response.meta.requestStatus == "fulfilled") {
              dispatch(fetchProposalByIdAsync(proposal?.id));
              Toast.show(response?.payload?.message as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setSelectedPayment(null);
              setDeleteModalIsOpen(false);
            }
          }}
        />
      }
    </StyledView>
  );
}
