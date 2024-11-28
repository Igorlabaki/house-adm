import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { fecthValues } from "@store/value/valuesSlice";
import { format } from "date-fns";
import moment from "moment";
import { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { formatCurrency } from "react-native-format-currency";
import { useDispatch, useSelector } from "react-redux";
import {
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { BugdetType, ValueType } from "type";
import React, { useState } from "react";
import InfoPessoais from "./pessoais";
import InfoEventos from "./evento";
import { Dimensions } from "react-native";

export function InfoSection() {
  return (
    <StyledView className="flex">
      <StyledView
        className={`flex-1 flex-grow flex-col relative `}
      >
        <InfoEventos  />
        <InfoPessoais  />
      </StyledView>
    </StyledView>
  );
}

export default InfoSection;
