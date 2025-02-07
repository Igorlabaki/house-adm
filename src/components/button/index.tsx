import React, { useEffect, useState } from "react";
import { ActivityIndicator, PressableProps } from "react-native"; 
import { StyledPressable, StyledText } from "styledComponents";

interface ButtonProps  extends PressableProps{
    title: string,
    handleSubmit: () => void
}

export default function ButtonComponent({ handleSubmit,title, ...rest }:ButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    try {
        setIsLoading(true);
        await setTimeout( handleSubmit, 3000)
    } catch (error) {
        
    }
    
    
    setIsLoading(false);
  };

  return (
    <StyledPressable
      onPress={handlePress}
      disabled={isLoading}
      className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" /> 
      ) : (
        <StyledText className="font-bold text-custom-white">{title}</StyledText>
      )}
    </StyledPressable>
  );
}