import { Animated } from "react-native";
import React, { useState, useEffect } from "react";
import { StyledAnimatedView, StyledText, StyledView } from "styledComponents";

interface CustomToastProps {
  message: string;
  visible: boolean;
}

const CustomToast: React.FC<CustomToastProps> = ({ message, visible }) => {
  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [visible]);

  return (
    <StyledAnimatedView
      style={{ opacity }}
      className="absolute top-14 left-1/2 -translate-x-1/2"
    >
      <StyledView className="bg-black px-4 py-2 rounded-lg shadow-md">
        <StyledText className="text-white text-sm font-semibold">
          {message}
        </StyledText>
      </StyledView>
    </StyledAnimatedView>
  );
};

export default CustomToast;