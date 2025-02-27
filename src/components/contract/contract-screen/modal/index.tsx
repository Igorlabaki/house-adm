import { useState } from "react";
import { ContractType } from "type";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { ContractFormComponent } from "../form";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { deleteContractByIdAsync } from "@store/contract/contract-slice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

interface ContractModalProps {
  contract?: ContractType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ContractModalComponent({
  type,
  contract,
  isModalOpen,
  setIsModalOpen,
}: ContractModalProps) {

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.contractList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteContractByIdAsync(contract.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Contrato deletada com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (deleteItem.meta.requestStatus == "rejected") {
      Toast.show(error as string, 3000, {
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
        {type === "UPDATE" && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        { type === "UPDATE" ? (
          <ContractFormComponent contract={contract} setIsModalOpen={setIsModalOpen}/>
        ) : (
          <ContractFormComponent setIsModalOpen={setIsModalOpen}/>
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="contrato"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
