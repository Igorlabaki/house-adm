import {
  StyledModal,
  StyledScrollView,
  StyledView,
} from "styledComponents";
import { ProposalType } from "type";
import { useEffect } from "react";
import { Venue } from "@store/venue/venueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { ProposalPerDayForm } from "../form/proposal-per-day-form";
import { ProposalPerPersonForm } from "../form/proposal-per-person-form";
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

  const { proposal }: { proposal: ProposalType } = useSelector(
    (state: RootState) => state.proposalList
  );

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.set("venueId", venue.id);
  }, []);
 
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsEditModalOpen(false);
      }}
      animationType="fade"
    >
      <StyledScrollView >
          <StyledView className="flex-1 bg-gray-dark pt-5 relative pb-16 ">
        
            {type === "UPDATE" && venue?.hasOvernightStay === true ? (
              <ProposalPerDayForm
                setIsEditModalOpen={setIsEditModalOpen}
                
                proposal={proposal}
              />
            ) : type === "UPDATE" && venue?.hasOvernightStay === false ? (
              <ProposalPerPersonForm
              setIsInfoModalOpen={setIsInfoModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                proposal={proposal}
              />
            ) : type === "CREATE" && venue?.hasOvernightStay === true ? (
              <ProposalPerDayForm setIsEditModalOpen={setIsEditModalOpen} />
            ) : (
              <ProposalPerPersonForm  setIsInfoModalOpen={setIsInfoModalOpen} setIsEditModalOpen={setIsEditModalOpen} />
            )}
          </StyledView>
        </StyledScrollView>
    </StyledModal>
  );
}
