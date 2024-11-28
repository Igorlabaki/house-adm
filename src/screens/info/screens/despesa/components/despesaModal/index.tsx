import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";


import { AppDispatch, RootState } from "@store/index";
import { deleteValueByIdAsync } from "@store/value/valuesSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DespesaType } from "type";
import { DespesaForm } from "../../form/despesaForm";
import { deleteDespesaByIdAsync } from "@store/despesa/despesaSlice";
import { useState } from "react";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

interface DespesaModalProps {
  despesa?: DespesaType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DespesaModal({
  despesa,
  isModalOpen,
  setIsModalOpen,
}: DespesaModalProps) {

  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.despesaList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const despesaItem = await dispatch(deleteDespesaByIdAsync(despesa.id));

    if (despesaItem.meta.requestStatus === "fulfilled") {
      Toast.show("Despesa deletada com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (despesaItem.meta.requestStatus == "rejected") {
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
        <StyledPressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </StyledPressable>
        {despesa && (
          <StyledPressable
            onPress={async () =>handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {despesa ? <DespesaForm despesa={despesa} setIsModalOpen={setIsModalOpen}/> : <DespesaForm setIsModalOpen={setIsModalOpen}/>}
      </StyledView>
      <DeleteConfirmationModal
        entity="despesa"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
