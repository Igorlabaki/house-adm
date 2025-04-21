import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import Toast from "react-native-simple-toast";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { ProposalType } from "type";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

import { GuestType, updateGuestAsync } from "@store/guest/guest-slice";
import { GuestForm } from "../form/guest-form";

interface GuestModalProps {
  guest?: GuestType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GuestModal({
  guest,
  isModalOpen,
  setIsModalOpen,
}: GuestModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);

  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(
      updateGuestAsync({
        personId: guest?.id,
        data: {
          attendance: false,
        },
      })
    );

    if (response.meta.requestStatus == "fulfilled") {
      Toast.show("Presenca cancelada!", 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      await dispatch(fetchProposalByIdAsync(proposal?.id));
      setIsModalOpen(false);
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
      <StyledView className="bg-gray-dark h-full px-3">
        <GuestForm setIsModalOpen={setIsModalOpen} guest={guest} />
        {guest?.id && (
          <>
            <StyledPressable
              onPress={async () => {
                if (guest?.attendance) {
                  handleDelete();
                } else {
                  const response = await dispatch(
                    updateGuestAsync({
                      personId: guest?.id,
                      data: {
                        attendance: true,
                      },
                    })
                  );

                  if (response.meta.requestStatus == "fulfilled") {
                    Toast.show("Presenca confirmada!", 3000, {
                      backgroundColor: "rgb(75,181,67)",
                      textColor: "white",
                    });
                    await dispatch(fetchProposalByIdAsync(proposal?.id));
                    setIsModalOpen(false);
                  }

                  if (response.meta.requestStatus == "rejected") {
                    Toast.show(response.payload as string, 3000, {
                      backgroundColor: "#FF9494",
                      textColor: "white",
                    });
                  }
                }
              }}
              className={`${
                guest?.attendance ? "bg-red-700" : "bg-blue-800"
              } flex justify-center items-center py-3 rounded-md`}
            >
              <StyledText className="font-bold text-custom-white">
                {guest?.attendance ? "Cancelar Presenca" : "Confirmar Presenca"}
              </StyledText>
            </StyledPressable>
            <DeleteConfirmationModal
              entity="convidado"
              onCancel={cancelDelete}
              onConfirm={confirmDelete}
              visible={modalVisible}
            />
          </>
        )}
      </StyledView>
    </StyledModal>
  );
}
