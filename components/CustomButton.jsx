import { Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
  primaryColor,
}) => {
  return (
    <TouchableOpacity
      className={`${primaryColor ? primaryColor : "bg-secondary"} rounded-xl min-h-[62px] justify-center ${
        isLoading ? "opacity-50" : ""
      } items-center ${containerStyles}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      <Text className={`text-primary ${textStyles} font-psemibold text-lg`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
