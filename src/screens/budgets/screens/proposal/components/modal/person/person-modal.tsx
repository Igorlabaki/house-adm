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
import { Person, updatePersonAsync } from "@store/person/person-slice";
import { PersonForm } from "./person-form";

interface TextModalProps {
  person?: Person;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  personType: "GUEST" | "WORKER";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PersonModal({
  person,
  personType,
  isModalOpen,
  setIsModalOpen,
}: TextModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);

  const proposal: ProposalType = useSelector<RootState>(
    (state: RootState) => state.proposalList.proposal
  );

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(
      updatePersonAsync({
        personId: person?.id,
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
        <PersonForm setIsModalOpen={setIsModalOpen} person={person} personType={personType} />
        {person?.id && (
          <>
            <StyledPressable
              onPress={async () => {
                if (person?.attendance) {
                  handleDelete();
                } else {
                  const response = await dispatch(
                    updatePersonAsync({
                      personId: person?.id,
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
                person?.attendance ? "bg-red-700" : "bg-green-700"
              } flex justify-center items-center py-3 mt-2 rounded-md`}
            >
              <StyledText className="font-bold text-custom-white">
                {person?.attendance ? "Cancelar Presenca" : "Confirmar Presenca"}
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
