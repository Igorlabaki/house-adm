import { ValueForm } from "../form/valueForm";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { TextType, ValueType } from "../../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { AppDispatch, RootState } from "../../../../../../store";
import { deleteTextByIdAsync } from "../../../../../../store/text/textSlice";
import { deleteValueByIdAsync } from "../../../../../../store/value/valuesSlice";

interface ValueModalProps {
  value?: ValueType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ValueModal({
  isModalOpen,
  setIsModalOpen,
  type,
  value,
}: ValueModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.textList.error
  );
  return (
    <Modal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <View className="flex-1 bg-gray-dark pt-10 relative">
        <Pressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </Pressable>
        {value && (
          <Pressable
            onPress={async () => {
              const deleteItem = await dispatch(deleteValueByIdAsync(value.id));

              if (deleteItem.meta.requestStatus === "fulfilled") {
                Toast.show("Value deleted successfully." as string, 3000, {
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
            }}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </Pressable>
        )}
        {value ? <ValueForm value={value} /> : <ValueForm />}
      </View>
    </Modal>
  );
}
