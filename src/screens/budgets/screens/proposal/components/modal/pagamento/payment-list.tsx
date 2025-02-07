import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { PaymentType, ProposalType } from "type";
import PaymentItemList from "./payment-item-list";

interface PaymentListProps{
  setSelectedPayment: React.Dispatch<React.SetStateAction<PaymentType>>
}

export function PaymentList({setSelectedPayment}:PaymentListProps) {
  const proposal : ProposalType = useSelector((state: RootState) => state.proposalList.proposal);

  return (
    <>
      {proposal?.payments?.map((payment: PaymentType, index = 0) => {
        return (
          <PaymentItemList
            setSelectedPayment={setSelectedPayment}
            payment={payment}
            index={index}
            key={payment.id}
            
          />
        );
      })}
    </>
  );
}
