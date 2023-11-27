import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
      <View className="mt-6 space-x-4 flex-row w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl focus:border-secondary items-center">
        <TextInput
          className="flex-1 font-pregular text-white mt-0.5 text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor={"#7b7b8d"}
          onChange={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
            }}
          >
            <Image source={icons.search} className="w-5 h-5" resizeMode="contain"></Image>
          </TouchableOpacity>
      </View>
  );
};

export default SearchInput;
